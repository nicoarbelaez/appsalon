<?php

namespace App\Reportes\DTOs;

use Illuminate\Http\Request;

final class FiltroPdfDTO
{
    public function __construct(
        public readonly string  $tipo,
        public readonly ?string $fechaDesde,
        public readonly ?string $fechaHasta,
        public readonly ?string $estado,
        public readonly ?int    $servicioId,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            tipo:       $request->input('tipo', 'citas'),
            fechaDesde: $request->input('fecha_desde'),
            fechaHasta: $request->input('fecha_hasta'),
            estado:     $request->input('estado'),
            servicioId: $request->integer('servicio_id') ?: null,
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            tipo:       $data['tipo'] ?? 'citas',
            fechaDesde: $data['fecha_desde'] ?? null,
            fechaHasta: $data['fecha_hasta'] ?? null,
            estado:     $data['estado'] ?? null,
            servicioId: isset($data['servicio_id']) ? (int) $data['servicio_id'] : null,
        );
    }

    public function toArray(): array
    {
        return [
            'tipo'        => $this->tipo,
            'fecha_desde' => $this->fechaDesde,
            'fecha_hasta' => $this->fechaHasta,
            'estado'      => $this->estado,
            'servicio_id' => $this->servicioId,
        ];
    }
}
