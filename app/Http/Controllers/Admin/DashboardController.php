<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use App\Models\Servicio;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $hoy = now()->toDateString();

        $citasHoy = Cita::whereDate('fecha', $hoy)
            ->with(['usuario', 'servicios'])
            ->orderBy('hora')
            ->get();

        $stats = [
            'citasHoy' => $citasHoy->count(),
            'ingresosDia' => $citasHoy->whereNotIn('estado', ['cancelada'])->sum('total'),
            'totalClientes' => User::where('admin', false)->count(),
            'totalServicios' => Servicio::where('activo', true)->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'citasHoy' => $citasHoy,
        ]);
    }
}
