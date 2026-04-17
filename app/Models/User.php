<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['nombre', 'apellido', 'email', 'password', 'telefono', 'admin', 'rol', 'confirmado', 'token'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $table = 'usuarios';

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'admin' => 'boolean',
            'confirmado' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->rol === 'admin' || $this->admin;
    }

    public function isFuncionario(): bool
    {
        return in_array($this->rol, ['admin', 'funcionario']) || $this->admin;
    }

    public function citas()
    {
        return $this->hasMany(Cita::class, 'usuarioId');
    }
}
