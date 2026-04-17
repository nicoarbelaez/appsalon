<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->string('nombre_invitado', 120)->nullable()->after('estado');
            $table->string('email_invitado', 100)->nullable()->after('nombre_invitado');
            $table->string('telefono_invitado', 20)->nullable()->after('email_invitado');
            $table->string('token_seguimiento', 64)->nullable()->unique()->after('telefono_invitado');
        });
    }

    public function down(): void
    {
        Schema::table('citas', function (Blueprint $table) {
            $table->dropColumn(['nombre_invitado', 'email_invitado', 'telefono_invitado', 'token_seguimiento']);
        });
    }
};
