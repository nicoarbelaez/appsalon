<?php

namespace App\Exports;

use App\Models\Servicio;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ServiciosExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    public function __construct(
        private string $search = '',
        private string $activo = ''
    ) {}

    public function query(): Builder
    {
        $q = Servicio::query();

        if ($this->activo === '1') {
            $q->where('activo', true);
        } elseif ($this->activo === '0') {
            $q->where('activo', false);
        }

        if (strlen($this->search) >= 3) {
            $q->whereRaw(
                'MATCH(nombre, descripcion) AGAINST (? IN NATURAL LANGUAGE MODE)
                 OR nombre LIKE ? OR descripcion LIKE ?',
                [$this->search, "%{$this->search}%", "%{$this->search}%"]
            )->orderByRaw(
                'MATCH(nombre, descripcion) AGAINST (? IN NATURAL LANGUAGE MODE) DESC',
                [$this->search]
            );
        } else {
            $q->orderBy('nombre');
        }

        return $q;
    }

    public function headings(): array
    {
        return ['id', 'nombre', 'precio', 'descripcion', 'duracion', 'activo'];
    }

    public function map($row): array
    {
        return [
            $row->id,
            $row->nombre,
            $row->precio,
            $row->descripcion,
            $row->duracion,
            $row->activo ? 1 : 0,
        ];
    }
}
