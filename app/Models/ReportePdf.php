<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportePdf extends Model
{
    protected $table = 'reportes_pdf';

    protected $fillable = [
        'usuarioId',
        'tipo',
        'estado',
        'filtros',
        'ruta_archivo',
        'nombre_archivo',
        'error_mensaje',
        'expira_en',
    ];

    protected function casts(): array
    {
        return [
            'filtros'   => 'array',
            'expira_en' => 'datetime',
        ];
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuarioId');
    }

    public function isListo(): bool
    {
        return $this->estado === 'listo';
    }

    public function isError(): bool
    {
        return $this->estado === 'error';
    }

    public function estaExpirado(): bool
    {
        return $this->expira_en !== null && $this->expira_en->isPast();
    }
}
