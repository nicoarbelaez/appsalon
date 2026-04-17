<?php

namespace Database\Seeders;

use App\Models\Cita;
use App\Models\Servicio;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'nombre' => 'Admin',
            'apellido' => 'AppSalon',
            'email' => 'admin@appsalon.com',
            'password' => Hash::make('password'),
            'telefono' => '3001234567',
            'admin' => true,
            'confirmado' => true,
        ]);

        $cliente = User::create([
            'nombre' => 'María',
            'apellido' => 'García',
            'email' => 'cliente@appsalon.com',
            'password' => Hash::make('password'),
            'telefono' => '3009876543',
            'admin' => false,
            'confirmado' => true,
        ]);

        $servicios = collect([
            ['nombre' => 'Corte de cabello', 'precio' => 25.00, 'descripcion' => 'Corte personalizado para dama o caballero', 'duracion' => 30],
            ['nombre' => 'Tinte', 'precio' => 60.00, 'descripcion' => 'Coloración completa con productos premium', 'duracion' => 90],
            ['nombre' => 'Manicure', 'precio' => 20.00, 'descripcion' => 'Cuidado y esmaltado de uñas de manos', 'duracion' => 45],
            ['nombre' => 'Pedicure', 'precio' => 22.00, 'descripcion' => 'Cuidado y esmaltado de uñas de pies', 'duracion' => 45],
            ['nombre' => 'Facial', 'precio' => 45.00, 'descripcion' => 'Limpieza facial profunda e hidratación', 'duracion' => 60],
            ['nombre' => 'Depilación', 'precio' => 35.00, 'descripcion' => 'Depilación con cera fría o caliente', 'duracion' => 40],
            ['nombre' => 'Tratamiento capilar', 'precio' => 50.00, 'descripcion' => 'Hidratación y nutrición del cabello', 'duracion' => 60],
        ])->map(fn($s) => Servicio::create(array_merge($s, ['activo' => true])));

        // Demo appointments for the client
        $citaFutura = Cita::create([
            'fecha' => now()->addDays(3)->toDateString(),
            'hora' => '10:00:00',
            'usuarioId' => $cliente->id,
            'total' => 45.00,
            'estado' => 'confirmada',
        ]);
        $citaFutura->servicios()->attach([$servicios[0]->id, $servicios[2]->id]);

        $citaHoy = Cita::create([
            'fecha' => now()->toDateString(),
            'hora' => '14:00:00',
            'usuarioId' => $cliente->id,
            'total' => 60.00,
            'estado' => 'pendiente',
        ]);
        $citaHoy->servicios()->attach([$servicios[1]->id]);

        $citaPasada = Cita::create([
            'fecha' => now()->subDays(7)->toDateString(),
            'hora' => '11:00:00',
            'usuarioId' => $cliente->id,
            'total' => 22.00,
            'estado' => 'completada',
        ]);
        $citaPasada->servicios()->attach([$servicios[3]->id]);
    }
}
