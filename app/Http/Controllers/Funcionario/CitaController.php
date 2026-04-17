<?php

namespace App\Http\Controllers\Funcionario;

use App\Http\Controllers\Controller;
use App\Models\Cita;
use Inertia\Inertia;

class CitaController extends Controller
{
    public function index()
    {
        $hoy = now()->toDateString();

        $citas = Cita::whereDate('fecha', '>=', $hoy)
            ->with(['usuario', 'servicios'])
            ->orderBy('fecha')
            ->orderBy('hora')
            ->get();

        return Inertia::render('funcionario/citas', [
            'citas' => $citas,
            'hoy' => $hoy,
        ]);
    }
}
