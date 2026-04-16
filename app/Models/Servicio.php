<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    use HasFactory;

    protected $table = 'servicios';

    protected $fillable = ['nombre', 'precio', 'descripcion', 'duracion', 'activo'];

    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'activo' => 'boolean',
        ];
    }

    public function citas()
    {
        return $this->belongsToMany(Cita::class, 'citasServicios', 'servicioId', 'citaId');
    }
}
