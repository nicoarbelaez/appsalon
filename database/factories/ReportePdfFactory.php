<?php

namespace Database\Factories;

use App\Models\ReportePdf;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportePdfFactory extends Factory
{
    protected $model = ReportePdf::class;

    public function definition(): array
    {
        return [
            'usuarioId'      => User::factory(),
            'tipo'           => $this->faker->randomElement(['citas', 'ingresos', 'clientes']),
            'estado'         => 'pendiente',
            'filtros'        => null,
            'ruta_archivo'   => null,
            'nombre_archivo' => null,
            'error_mensaje'  => null,
            'expira_en'      => null,
        ];
    }

    public function listo(): static
    {
        return $this->state(fn() => [
            'estado'         => 'listo',
            'ruta_archivo'   => 'reportes/reporte_test.pdf',
            'nombre_archivo' => 'reporte_test.pdf',
            'expira_en'      => now()->addHours(24),
        ]);
    }

    public function error(): static
    {
        return $this->state(fn() => [
            'estado'        => 'error',
            'error_mensaje' => 'Error simulado en test.',
        ]);
    }
}
