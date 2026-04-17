<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ServiciosTemplateExport implements FromArray, WithHeadings, ShouldAutoSize
{
    public function array(): array
    {
        return [
            ['Corte de cabello', '25000', 'Corte clásico para damas y caballeros', '45', '1'],
            ['Manicure', '15000', 'Limpieza y esmaltado de uñas', '60', '1'],
        ];
    }

    public function headings(): array
    {
        return ['nombre', 'precio', 'descripcion', 'duracion', 'activo'];
    }
}
