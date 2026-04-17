<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ReservaPublicaController extends Controller
{
    public function create()
    {
        $ocupados = Cita::where('fecha', '>=', now()->toDateString())
            ->where('estado', '!=', 'cancelada')
            ->select('fecha', 'hora')
            ->get()
            ->map(function ($cita) {
                return [
                    'fecha' => $cita->fecha,
                    'hora' => substr($cita->hora, 0, 5), // '10:30'
                ];
            });

        return Inertia::render('reservar/index', [
            'servicios' => Servicio::where('activo', true)->orderBy('nombre')->get(),
            'ocupados' => $ocupados,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:120',
            'email' => 'required|email|max:100',
            'telefono' => 'required|string|max:20',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required|date_format:H:i',
            'servicios' => 'required|array|min:1',
            'servicios.*' => 'integer|exists:servicios,id',
        ]);

        $ocupado = Cita::where('fecha', $validated['fecha'])
            ->where('hora', $validated['hora'].':00')
            ->where('estado', '!=', 'cancelada')
            ->exists();

        if ($ocupado) {
            return back()->withErrors([
                'hora' => 'Ese horario ya está ocupado. Por favor elige otro.',
            ])->withInput();
        }

        $total = Servicio::whereIn('id', $validated['servicios'])->sum('precio');
        $token = Str::random(32);

        $cita = Cita::create([
            'fecha' => $validated['fecha'],
            'hora' => $validated['hora'].':00',
            'usuarioId' => null,
            'total' => $total,
            'estado' => 'pendiente',
            'nombre_invitado' => $validated['nombre'],
            'email_invitado' => $validated['email'],
            'telefono_invitado' => $validated['telefono'],
            'token_seguimiento' => $token,
        ]);

        $cita->servicios()->attach($validated['servicios']);

        return redirect()->route('reservar.estado', $token);
    }

    public function estado(string $token)
    {
        $cita = Cita::where('token_seguimiento', $token)
            ->with('servicios')
            ->firstOrFail();

        return Inertia::render('reservar/estado', [
            'cita' => $cita,
            'token' => $token,
        ]);
    }
}
