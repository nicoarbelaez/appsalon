<?php

namespace App\Imports;

use App\Models\Servicio;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;

class ServiciosImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure, WithBatchInserts
{
    private array $failures = [];

    public function model(array $row): Servicio
    {
        $activo = $row['activo'] ?? '1';
        $activo = in_array(strtolower((string) $activo), ['1', 'si', 'sí', 'yes', 'true']) ? true : false;

        return new Servicio([
            'nombre'      => $row['nombre'],
            'precio'      => $row['precio'],
            'descripcion' => $row['descripcion'] ?? null,
            'duracion'    => (int) $row['duracion'],
            'activo'      => $activo,
        ]);
    }

    public function rules(): array
    {
        return [
            'nombre'      => ['required', 'string', 'max:60'],
            'precio'      => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'descripcion' => ['nullable', 'string', 'max:500'],
            'duracion'    => ['required', 'integer', 'min:15', 'max:480'],
        ];
    }

    public function batchSize(): int
    {
        return 100;
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
