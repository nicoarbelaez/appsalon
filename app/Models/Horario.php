<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Horario extends Model
{
    protected $table = 'horarios';

    protected $fillable = ['dia_semana', 'activo', 'tramos'];

    protected $casts = [
        'activo'  => 'boolean',
        'tramos'  => 'array',
    ];

    /** Check whether a date+time slot is within the configured business hours. */
    public static function isValidSlot(string $fecha, string $hora): bool
    {
        $diaSemana = \Carbon\Carbon::parse($fecha)->dayOfWeek; // 0=domingo
        $horario   = static::where('dia_semana', $diaSemana)->first();

        if (! $horario || ! $horario->activo) {
            return false;
        }

        $min = self::toMinutes($hora);

        foreach ($horario->tramos as $tramo) {
            if ($min >= self::toMinutes($tramo['inicio']) && $min < self::toMinutes($tramo['fin'])) {
                return true;
            }
        }

        return false;
    }

    private static function toMinutes(string $time): int
    {
        [$h, $m] = explode(':', $time);

        return (int) $h * 60 + (int) $m;
    }
}
