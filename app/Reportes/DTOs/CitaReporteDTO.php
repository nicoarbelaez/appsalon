<?php

namespace App\Reportes\DTOs;

use App\Models\Cita;

final class CitaReporteDTO
{
    public function __construct(
        public readonly int    $id,
        public readonly string $fecha,
        public readonly string $hora,
        public readonly string $clienteNombre,
        public readonly string $clienteEmail,
        public readonly string $estado,
        public readonly string $total,
        public readonly string $servicios,
        public readonly int    $duracionTotal,
    ) {}

    public static function fromCita(Cita $cita): self
    {
        $nombre = $cita->usuario
            ? "{$cita->usuario->nombre} {$cita->usuario->apellido}"
            : 'Invitado';

        $email = $cita->usuario?->email ?? '—';

        return new self(
            id:            $cita->id,
            fecha:         \Carbon\Carbon::parse($cita->fecha)->format('d/m/Y'),
            hora:          substr($cita->hora, 0, 5),
            clienteNombre: $nombre,
            clienteEmail:  $email,
            estado:        $cita->estado,
            total:         '$' . number_format((float) $cita->total, 2),
            servicios:     $cita->servicios->pluck('nombre')->join(', '),
            duracionTotal: $cita->servicios->sum('duracion'),
        );
    }
}
