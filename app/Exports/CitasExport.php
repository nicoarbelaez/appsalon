<?php

namespace App\Exports;

use App\Models\Cita;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class CitasExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    public function __construct(
        private string $estado = '',
        private string $fechaDesde = '',
        private string $fechaHasta = ''
    ) {}

    public function query(): Builder
    {
        $q = Cita::with(['usuario', 'servicios'])->orderBy('fecha')->orderBy('hora');

        if ($this->estado) {
            $q->where('estado', $this->estado);
        }

        if ($this->fechaDesde) {
            $q->where('fecha', '>=', $this->fechaDesde);
        }

        if ($this->fechaHasta) {
            $q->where('fecha', '<=', $this->fechaHasta);
        }

        return $q;
    }

    public function headings(): array
    {
        return ['id', 'fecha', 'hora', 'email_usuario', 'nombre_invitado', 'email_invitado', 'telefono_invitado', 'nombres_servicios', 'total', 'estado'];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->fecha->format('Y-m-d'),
            substr($row->hora, 0, 5),
            $row->usuario?->email ?? '',
            $row->nombre_invitado ?? '',
            $row->email_invitado ?? '',
            $row->telefono_invitado ?? '',
            $row->servicios->pluck('nombre')->implode(', '),
            $row->total,
            $row->estado,
        ];
    }
}
