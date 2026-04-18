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
        $request->validate([
            'horarios'              => ['required', 'array', 'size:7'],
            'horarios.*.dia_semana' => ['required', 'integer', 'min:0', 'max:6'],
            'horarios.*.activo'     => ['required', 'boolean'],
            'horarios.*.tramos'     => ['present', 'array'],
        ]);

        $horarios = $request->input('horarios', []);
        $errors   = [];

        foreach ($horarios as $i => $row) {
            $activo = (bool) ($row['activo'] ?? false);
            $tramos = $row['tramos'] ?? [];

            if (! $activo) {
                continue; // inactive days need no tramo validation
            }

            if (empty($tramos)) {
                $errors["horarios.{$i}.tramos"] = 'Debe tener al menos un tramo cuando el día está activo.';
                continue;
            }

            foreach ($tramos as $j => $tramo) {
                $inicio = $tramo['inicio'] ?? '';
                $fin    = $tramo['fin']    ?? '';

                if (! preg_match('/^\d{2}:\d{2}$/', $inicio)) {
                    $errors["horarios.{$i}.tramos.{$j}.inicio"] = 'Hora de inicio inválida.';
                }

                if (! preg_match('/^\d{2}:\d{2}$/', $fin)) {
                    $errors["horarios.{$i}.tramos.{$j}.fin"] = 'Hora de fin inválida.';
                }

                if ($inicio && $fin && $fin <= $inicio) {
                    $errors["horarios.{$i}.tramos.{$j}.fin"] = 'La hora de fin debe ser posterior a la de inicio.';
                }
            }
        }

        if (! empty($errors)) {
            return back()->withErrors($errors);
        }

        foreach ($horarios as $row) {
            Horario::where('dia_semana', $row['dia_semana'])->update([
                'activo' => $row['activo'],
                'tramos' => $row['activo'] ? $row['tramos'] : [],
            ]);
        }

        return back()->with('success', 'Horarios actualizados correctamente.');
    }
}
