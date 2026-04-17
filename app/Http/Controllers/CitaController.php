<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CitaController extends Controller
{
    public function index()
    {
        $citas = Cita::where('usuarioId', auth()->id())
            ->with('servicios')
            ->orderByDesc('fecha')
            ->orderByDesc('hora')
            ->get();

        return Inertia::render('citas/index', [
            'citas' => $citas,
        ]);
    }

    public function create()
    {
        $ocupados = Cita::where('fecha', '>=', now()->toDateString())
            ->where('estado', '!=', 'cancelada')
            ->select('fecha', 'hora')
            ->get()
            ->map(function ($cita) {
                return [
                    'fecha' => $cita->fecha,
                    'hora' => substr($cita->hora, 0, 5),
                ];
            });

        return Inertia::render('citas/create', [
            'servicios' => Servicio::where('activo', true)->orderBy('nombre')->get(),
            'ocupados' => $ocupados,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required|date_format:H:i',
            'servicios' => 'required|array|min:1',
            'servicios.*' => 'integer|exists:servicios,id',
        ]);

        $ocupado = Cita::where('fecha', $validated['fecha'])
            ->where('hora', $validated['hora'] . ':00')
            ->where('estado', '!=', 'cancelada')
            ->exists();

        if ($ocupado) {
            return back()->withErrors([
                'hora' => 'Ese horario ya está ocupado. Por favor elige otro.',
            ])->withInput();
        }

        $total = Servicio::whereIn('id', $validated['servicios'])->sum('precio');

        $cita = Cita::create([
            'fecha' => $validated['fecha'],
            'hora' => $validated['hora'] . ':00',
            'usuarioId' => auth()->id(),
            'total' => $total,
            'estado' => 'pendiente',
        ]);

        $cita->servicios()->attach($validated['servicios']);

        return redirect()->route('citas.index')
            ->with('success', '¡Cita reservada exitosamente!');
    }

    public function destroy(Cita $cita)
    {
        abort_unless($cita->usuarioId === auth()->id(), 403);

        $cita->update(['estado' => 'cancelada']);

        return redirect()->route('citas.index')
            ->with('success', 'Cita cancelada correctamente.');
    }
}
