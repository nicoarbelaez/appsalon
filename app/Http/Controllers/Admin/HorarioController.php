<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HorarioController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/horarios/index', [
            'horarios' => Horario::orderBy('dia_semana')->get(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'horarios'               => ['required', 'array', 'size:7'],
            'horarios.*.dia_semana'  => ['required', 'integer', 'min:0', 'max:6'],
            'horarios.*.activo'      => ['required', 'boolean'],
            'horarios.*.tramos'      => ['required', 'array'],
            'horarios.*.tramos.*.inicio' => ['required', 'date_format:H:i'],
            'horarios.*.tramos.*.fin'    => ['required', 'date_format:H:i', 'after:horarios.*.tramos.*.inicio'],
        ]);

        foreach ($data['horarios'] as $row) {
            Horario::where('dia_semana', $row['dia_semana'])->update([
                'activo' => $row['activo'],
                'tramos' => $row['activo'] ? $row['tramos'] : [],
            ]);
        }

        return back()->with('success', 'Horarios actualizados correctamente.');
    }
}
