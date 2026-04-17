<?php

namespace App\Imports;

use App\Models\Cita;
use App\Models\Servicio;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;

class CitasImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    private array $failures = [];

    public function model(array $row): ?Cita
    {
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
            return null;
        }

        $nombresServicios = array_map('trim', explode(',', $row['nombres_servicios']));
        $nombresLower = array_map('strtolower', $nombresServicios);
        $servicios = Servicio::whereIn(DB::raw('LOWER(nombre)'), $nombresLower)->get();
        $servicioIds = $servicios->pluck('id')->toArray();
        $total = $servicios->sum('precio');

        $cita = Cita::create([
            'fecha'            => $row['fecha'],
            'hora'             => $hora,
            'usuarioId'        => $usuarioId,
            'nombre_invitado'  => $usuarioId ? null : ($row['nombre_invitado'] ?? null),
            'email_invitado'   => $usuarioId ? null : ($row['email_invitado'] ?? null),
            'telefono_invitado' => $usuarioId ? null : ($row['telefono_invitado'] ?? null),
            'total'            => $total,
            'estado'           => $row['estado'] ?? 'pendiente',
        ]);

        if (!empty($servicioIds)) {
            $cita->servicios()->sync($servicioIds);
        }

        return null;
    }

    public function rules(): array
    {
        return [
            'fecha'            => ['required', 'date'],
            'hora'             => ['required', 'regex:/^\d{2}:\d{2}$/'],
            'email_usuario'    => ['nullable', 'email', 'exists:usuarios,email'],
            'nombres_servicios' => ['required', 'string'],
            'estado'           => ['nullable', 'in:pendiente,confirmada,completada,cancelada'],
            'nombre_invitado'  => ['nullable', 'string', 'max:120'],
            'email_invitado'   => ['nullable', 'email'],
            'telefono_invitado' => ['nullable', 'string', 'max:10'],
        ];
    }

    public function onFailure(Failure ...$failures): void
    {
        foreach ($failures as $failure) {
            $this->failures[] = $failure;
        }
    }

    public function failures(): array
    {
        return $this->failures;
    }
}
