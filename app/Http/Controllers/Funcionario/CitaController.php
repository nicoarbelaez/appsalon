<?php

namespace App\Http\Controllers\Funcionario;

use App\Exports\CitasExport;
use App\Exports\CitasTemplateExport;
use App\Http\Controllers\Controller;
use App\Imports\CitasImport;
use App\Models\Cita;
use App\Models\Servicio;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CitaController extends Controller
{
    public function index()
    {
        $citas = Cita::with(['usuario', 'servicios'])
            ->orderBy('fecha')
            ->orderBy('hora')
            ->get();

        $ocupados = Cita::where('fecha', '>=', now()->toDateString())
            ->where('estado', '!=', 'cancelada')
            ->select('fecha', 'hora')
            ->get()
            ->map(fn($c) => ['fecha' => $c->fecha, 'hora' => substr($c->hora, 0, 5)]);

        return Inertia::render('agenda/citas', [
            'citas'    => $citas,
            'servicios' => Servicio::where('activo', true)->orderBy('nombre')->get(),
            'ocupados' => $ocupados,
            'usuarios' => User::orderBy('nombre')->get(['id', 'nombre', 'apellido', 'telefono']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'fecha'          => ['required', 'date', 'after_or_equal:today'],
            'hora'           => ['required', 'date_format:H:i'],
            'servicios'      => ['required', 'array', 'min:1'],
            'servicios.*'    => ['integer', 'exists:servicios,id'],
            'usuarioId'      => ['nullable', 'integer', 'exists:usuarios,id'],
            'nombre_invitado' => ['nullable', 'string', 'max:120'],
        ]);

        $ocupado = Cita::where('fecha', $data['fecha'])
            ->where('hora', $data['hora'] . ':00')
            ->where('estado', '!=', 'cancelada')
            ->exists();

        if ($ocupado) {
            return back()->withErrors(['hora' => 'Ese horario ya está ocupado.']);
        }

        $total = Servicio::whereIn('id', $data['servicios'])->sum('precio');

        $cita = Cita::create([
            'fecha'           => $data['fecha'],
            'hora'            => $data['hora'] . ':00',
            'usuarioId'       => $data['usuarioId'] ?? null,
            'nombre_invitado' => $data['usuarioId'] ? null : ($data['nombre_invitado'] ?? null),
            'total'           => $total,
            'estado'          => 'pendiente',
        ]);

        $cita->servicios()->attach($data['servicios']);

        return redirect()->back()->with('success', 'Cita creada exitosamente.');
    }

    public function export(Request $request): BinaryFileResponse
    {
        $format = in_array($request->query('format'), ['csv', 'xlsx']) ? $request->query('format') : 'xlsx';
        $filename = 'citas_' . now()->format('Y-m-d') . '.' . $format;

        return Excel::download(
            new CitasExport(
                $request->query('estado', ''),
                $request->query('fecha_desde', ''),
                $request->query('fecha_hasta', '')
            ),
            $filename
        );
    }

    public function importTemplate(): BinaryFileResponse
    {
        return Excel::download(new CitasTemplateExport(), 'plantilla_citas.xlsx');
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate(['file' => 'required|file|mimes:xlsx,xls,csv|max:2048']);

        $import = new CitasImport();
        Excel::import($import, $request->file('file'));

        $failures = $import->failures();
        if (!empty($failures)) {
            $errors = array_map(
                fn($f) => "Fila {$f->row()}: " . implode(', ', $f->errors()),
                $failures
            );
            return back()->withErrors(['import' => $errors]);
        }

        return back()->with('success', 'Citas importadas correctamente.');
    }

    public function preview(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|file|mimes:xlsx,xls,csv|max:2048']);

        $rows = $this->parseFileToRows($request);
        $errors = $this->validateRowsArray($rows, $this->importRules());

        return response()->json([
            'columns' => !empty($rows) ? array_keys($rows[0]) : [],
            'rows'    => $rows,
            'errors'  => $errors,
        ]);
    }

    public function revalidate(Request $request): JsonResponse
    {
        $rows = $request->input('rows', []);
        return response()->json([
            'errors' => $this->validateRowsArray($rows, $this->importRules()),
        ]);
    }

    public function importRows(Request $request): RedirectResponse
    {
        $rows = $request->input('rows', []);
        $errors = $this->validateRowsArray($rows, $this->importRules());

        if (!empty($errors)) {
            return back()->withErrors(['import' => 'Aún hay filas con errores.']);
        }

        foreach ($rows as $row) {
            $usuarioId = null;
            if (!empty($row['email_usuario'])) {
                $usuario = User::where('email', $row['email_usuario'])->first();
                if ($usuario) {
                    $usuarioId = $usuario->id;
                }
            }

            $hora = substr($row['hora'], 0, 5) . ':00';

            $ocupado = Cita::where('fecha', $row['fecha'])
                ->where('hora', $hora)
                ->where('estado', '!=', 'cancelada')
                ->exists();

            if ($ocupado) {
                continue;
            }

            $nombresServicios = array_map('trim', explode(',', $row['nombres_servicios']));
            $servicios = Servicio::whereIn(DB::raw('LOWER(nombre)'), array_map('strtolower', $nombresServicios))->get();
            $total = $servicios->sum('precio');

            $cita = Cita::create([
                'fecha'             => $row['fecha'],
                'hora'              => $hora,
                'usuarioId'         => $usuarioId,
                'nombre_invitado'   => $usuarioId ? null : ($row['nombre_invitado'] ?? null),
                'email_invitado'    => $usuarioId ? null : ($row['email_invitado'] ?? null),
                'telefono_invitado' => $usuarioId ? null : ($row['telefono_invitado'] ?? null),
                'total'             => $total,
                'estado'            => $row['estado'] ?? 'pendiente',
            ]);

            $cita->servicios()->sync($servicios->pluck('id')->toArray());
        }

        return back()->with('success', count($rows) . ' cita(s) importadas correctamente.');
    }

    private function parseFileToRows(Request $request): array
    {
        $import = new class implements ToCollection, WithHeadingRow {
            public \Illuminate\Support\Collection $rows;
            public function collection(\Illuminate\Support\Collection $rows): void
            {
                $this->rows = $rows;
            }
        };

        Excel::import($import, $request->file('file'));

        return $import->rows->map(
            fn($row) => array_map('strval', $row->toArray())
        )->toArray();
    }

    private function validateRowsArray(array $rows, array $rules): array
    {
        $errors = [];
        foreach ($rows as $i => $row) {
            $v = Validator::make((array) $row, $rules);
            if ($v->fails()) {
                $errors[$i] = $v->errors()->all();
            }
        }
        return $errors;
    }

    private function importRules(): array
    {
        return [
            'fecha'             => ['required', 'date'],
            'hora'              => ['required', 'regex:/^\d{2}:\d{2}$/'],
            'email_usuario'     => ['nullable', 'email', 'exists:usuarios,email'],
            'nombres_servicios' => ['required', 'string'],
            'estado'            => ['nullable', 'in:pendiente,confirmada,completada,cancelada'],
            'nombre_invitado'   => ['nullable', 'string', 'max:120'],
            'email_invitado'    => ['nullable', 'email'],
            'telefono_invitado' => ['nullable', 'string', 'max:10'],
        ];
    }

    public function update(Request $request, Cita $cita)
    {
        $data = $request->validate([
            'estado'        => ['required', 'in:pendiente,confirmada,completada,cancelada'],
            'servicioIds'   => ['required', 'array', 'min:1'],
            'servicioIds.*' => ['integer', 'exists:servicios,id'],
        ]);

        $total = Servicio::whereIn('id', $data['servicioIds'])->sum('precio');

        $cita->update([
            'estado' => $data['estado'],
            'total'  => $total,
        ]);

        $cita->servicios()->sync($data['servicioIds']);

        return redirect()->back();
    }
}
