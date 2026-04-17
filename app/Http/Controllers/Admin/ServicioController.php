<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ServiciosExport;
use App\Exports\ServiciosTemplateExport;
use App\Http\Controllers\Controller;
use App\Imports\ServiciosImport;
use App\Models\Servicio;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ServicioController extends Controller
{
    public function index(Request $request)
    {
        $search = trim($request->query('search', ''));
        $activo = $request->query('activo', '');

        $query = Servicio::query();

        if ($activo === '1') {
            $query->where('activo', true);
        } elseif ($activo === '0') {
            $query->where('activo', false);
        }

        if (strlen($search) >= 3) {
            $query->whereRaw(
                'MATCH(nombre, descripcion) AGAINST (? IN NATURAL LANGUAGE MODE)
                 OR nombre LIKE ? OR descripcion LIKE ?',
                [$search, "%{$search}%", "%{$search}%"]
            )->orderByRaw(
                'MATCH(nombre, descripcion) AGAINST (? IN NATURAL LANGUAGE MODE) DESC',
                [$search]
            );
        } else {
            $query->orderBy('nombre');
        }

        return Inertia::render('admin/servicios/index', [
            'servicios' => $query->get(),
            'filters'   => ['search' => $search, 'activo' => $activo],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:60',
            'precio'      => 'required|numeric|min:0|max:999.99',
            'descripcion' => 'nullable|string|max:500',
            'duracion'    => 'required|integer|min:15|max:480',
            'activo'      => 'boolean',
        ]);

        Servicio::create($validated);

        return back()->with('success', 'Servicio creado correctamente.');
    }

    public function update(Request $request, Servicio $servicio)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:60',
            'precio'      => 'required|numeric|min:0|max:999.99',
            'descripcion' => 'nullable|string|max:500',
            'duracion'    => 'required|integer|min:15|max:480',
            'activo'      => 'boolean',
        ]);

        $servicio->update($validated);

        return back()->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy(Servicio $servicio)
    {
        try {
            $servicio->delete();
        } catch (\Illuminate\Database\QueryException $e) {
            return back()->withErrors(['ids' => 'El servicio está en uso y no puede eliminarse.']);
        }

        return back()->with('success', 'Servicio eliminado correctamente.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids'       => 'required_without:selectAll|array',
            'ids.*'     => ['integer', Rule::exists('servicios', 'id')],
            'selectAll' => 'boolean',
            'search'    => 'nullable|string',
            'activo'    => 'nullable|string|in:0,1,',
        ]);

        try {
            if ($request->boolean('selectAll')) {
                $this->buildFilteredQuery($request)->delete();
            } else {
                Servicio::whereIn('id', $request->ids)->delete();
            }
        } catch (\Illuminate\Database\QueryException $e) {
            return back()->withErrors(['ids' => 'Algunos servicios están en uso y no pueden eliminarse.']);
        }

        return back()->with('success', 'Servicios eliminados.');
    }

    public function bulkToggle(Request $request)
    {
        $request->validate([
            'ids'           => 'required_without:selectAll|array',
            'ids.*'         => ['integer', Rule::exists('servicios', 'id')],
            'activo'        => 'required|boolean',
            'selectAll'     => 'boolean',
            'search'        => 'nullable|string',
            'activo_filter' => 'nullable|string|in:0,1,',
        ]);

        $query = $request->boolean('selectAll')
            ? $this->buildFilteredQuery($request, filterKey: 'activo_filter')
            : Servicio::whereIn('id', $request->ids);

        $query->update(['activo' => $request->boolean('activo')]);

        return back()->with('success', 'Servicios actualizados.');
    }

    public function export(Request $request): BinaryFileResponse
    {
        $format = in_array($request->query('format'), ['csv', 'xlsx']) ? $request->query('format') : 'xlsx';
        $filename = 'servicios_' . now()->format('Y-m-d') . '.' . $format;

        return Excel::download(
            new ServiciosExport(
                $request->query('search', ''),
                $request->query('activo', '')
            ),
            $filename
        );
    }

    public function importTemplate(): BinaryFileResponse
    {
        return Excel::download(new ServiciosTemplateExport(), 'plantilla_servicios.xlsx');
    }

    public function import(Request $request): RedirectResponse
    {
        $request->validate(['file' => 'required|file|mimes:xlsx,xls,csv|max:2048']);

        $import = new ServiciosImport();
        Excel::import($import, $request->file('file'));

        $failures = $import->failures();
        if (!empty($failures)) {
            $errors = array_map(
                fn($f) => "Fila {$f->row()}: " . implode(', ', $f->errors()),
                $failures
            );
            return back()->withErrors(['import' => $errors]);
        }

        return back()->with('success', 'Servicios importados correctamente.');
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
            $activo = $row['activo'] ?? '1';
            $activo = in_array(strtolower((string) $activo), ['1', 'si', 'sí', 'yes', 'true']) ? true : false;
            Servicio::create([
                'nombre'      => $row['nombre'],
                'precio'      => $row['precio'],
                'descripcion' => $row['descripcion'] ?? null,
                'duracion'    => (int) $row['duracion'],
                'activo'      => $activo,
            ]);
        }

        return back()->with('success', count($rows) . ' servicio(s) importados correctamente.');
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
            'nombre'      => ['required', 'string', 'max:60'],
            'precio'      => ['required', 'numeric', 'min:0', 'max:999.99'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'duracion'    => ['required', 'integer', 'min:15', 'max:480'],
        ];
    }

    private function buildFilteredQuery(Request $request, string $filterKey = 'activo'): Builder
    {
        $search = trim($request->input('search', ''));
        $activo = $request->input($filterKey, '');
        $query = Servicio::query();

        if ($activo === '1') {
            $query->where('activo', true);
        } elseif ($activo === '0') {
            $query->where('activo', false);
        }

        if (strlen($search) >= 3) {
            $query->whereRaw(
                'MATCH(nombre, descripcion) AGAINST (? IN NATURAL LANGUAGE MODE)
                 OR nombre LIKE ? OR descripcion LIKE ?',
                [$search, "%{$search}%", "%{$search}%"]
            );
        }

        return $query;
    }
}
