<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $proximasCitas = Cita::where('usuarioId', $userId)
            ->where('fecha', '>=', now()->toDateString())
            ->where('estado', '!=', 'cancelada')
            ->with('servicios')
            ->orderBy('fecha')
            ->orderBy('hora')
            ->take(5)
            ->get();

        $stats = [
            'totalCitas' => Cita::where('usuarioId', $userId)->count(),
            'citasPendientes' => Cita::where('usuarioId', $userId)->whereIn('estado', ['pendiente', 'confirmada'])->count(),
            'citasCompletadas' => Cita::where('usuarioId', $userId)->where('estado', 'completada')->count(),
        ];

        return Inertia::render('dashboard', [
            'proximasCitas' => $proximasCitas,
            'stats' => $stats,
        ]);
    }
}
