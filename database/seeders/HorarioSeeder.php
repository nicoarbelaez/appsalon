<?php

namespace Database\Seeders;

use App\Models\Horario;
use Illuminate\Database\Seeder;

class HorarioSeeder extends Seeder
{
    public function run(): void
    {
        // 0=domingo, 1=lunes … 6=sábado
        $defaults = [
            0 => ['activo' => false, 'tramos' => []],                                    // Domingo
            1 => ['activo' => true,  'tramos' => [['inicio' => '09:00', 'fin' => '18:00']]], // Lunes
            2 => ['activo' => true,  'tramos' => [['inicio' => '09:00', 'fin' => '18:00']]], // Martes
            3 => ['activo' => true,  'tramos' => [['inicio' => '09:00', 'fin' => '18:00']]], // Miércoles
            4 => ['activo' => true,  'tramos' => [['inicio' => '09:00', 'fin' => '18:00']]], // Jueves
            5 => ['activo' => true,  'tramos' => [['inicio' => '09:00', 'fin' => '18:00']]], // Viernes
            6 => ['activo' => true,  'tramos' => [['inicio' => '09:00', 'fin' => '14:00']]], // Sábado
        ];

        foreach ($defaults as $dia => $config) {
            Horario::updateOrCreate(
                ['dia_semana' => $dia],
                ['activo' => $config['activo'], 'tramos' => $config['tramos']],
            );
        }
    }
}
