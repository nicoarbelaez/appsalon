<?php

namespace Database\Seeders;

use App\Models\Servicio;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'nombre' => 'Admin',
            'apellido' => 'AppSalon',
            'email' => 'admin@appsalon.com',
            'password' => Hash::make('password'),
            'telefono' => '3001234567',
            'admin' => true,
            'confirmado' => true,
        ]);

        User::create([
            'nombre' => 'Cliente',
            'apellido' => 'Demo',
            'email' => 'cliente@appsalon.com',
            'password' => Hash::make('password'),
            'telefono' => '3009876543',
            'admin' => false,
            'confirmado' => true,
        ]);

        $servicios = [
            ['nombre' => 'Corte de cabello', 'precio' => 25.00, 'descripcion' => 'Corte personalizado para dama o caballero', 'duracion' => 30],
            ['nombre' => 'Tinte', 'precio' => 60.00, 'descripcion' => 'Coloración completa con productos premium', 'duracion' => 90],
            ['nombre' => 'Manicure', 'precio' => 20.00, 'descripcion' => 'Cuidado y esmaltado de uñas de manos', 'duracion' => 45],
            ['nombre' => 'Pedicure', 'precio' => 22.00, 'descripcion' => 'Cuidado y esmaltado de uñas de pies', 'duracion' => 45],
            ['nombre' => 'Facial', 'precio' => 45.00, 'descripcion' => 'Limpieza facial profunda e hidratación', 'duracion' => 60],
        ];

        foreach ($servicios as $servicio) {
            Servicio::create(array_merge($servicio, ['activo' => true]));
        }
    }
}
