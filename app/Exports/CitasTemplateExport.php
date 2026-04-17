<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CitasTemplateExport implements FromArray, WithHeadings, ShouldAutoSize
{
    public function array(): array
    {
        return [
            ['2026-05-01', '09:00', 'cliente@appsalon.com', 'Corte de cabello, Manicure', 'pendiente', '', '', ''],
            ['2026-05-01', '10:00', '', 'Manicure', 'pendiente', 'María García', 'maria@ejemplo.com', '3001234567'],
        ];
    }

    public function headings(): array
    {
        return ['fecha', 'hora', 'email_usuario', 'nombres_servicios', 'estado', 'nombre_invitado', 'email_invitado', 'telefono_invitado'];
    }
}
