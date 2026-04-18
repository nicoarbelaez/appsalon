<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reportes_pdf', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuarioId')
                  ->constrained('usuarios')
                  ->cascadeOnDelete();
            $table->string('tipo', 40);
            $table->enum('estado', ['pendiente', 'procesando', 'listo', 'error'])
                  ->default('pendiente');
            $table->json('filtros')->nullable();
            $table->string('ruta_archivo', 255)->nullable();
            $table->string('nombre_archivo', 255)->nullable();
            $table->text('error_mensaje')->nullable();
            $table->timestamp('expira_en')->nullable();
            $table->timestamps();

            $table->index(['usuarioId', 'estado']);
            $table->index('expira_en');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportes_pdf');
    }
};
