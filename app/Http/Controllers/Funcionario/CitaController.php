<?php

namespace App\Http\Controllers\Funcionario;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Servicio;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
