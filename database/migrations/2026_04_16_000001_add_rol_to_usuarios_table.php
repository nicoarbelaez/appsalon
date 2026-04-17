<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->enum('rol', ['cliente', 'funcionario', 'admin'])->default('cliente')->after('admin');
        });

        // Migrate existing admin flag to rol column
        DB::table('usuarios')->where('admin', true)->update(['rol' => 'admin']);
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn('rol');
        });
    }
};
