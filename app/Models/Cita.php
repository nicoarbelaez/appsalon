<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;

    protected $table = 'citas';

    protected $fillable = ['fecha', 'hora', 'usuarioId', 'total', 'estado'];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'total' => 'decimal:2',
        ];
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuarioId');
    }

    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'citasServicios', 'citaId', 'servicioId');
    }
}
