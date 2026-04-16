<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citasServicios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('citaId')->constrained('citas')->cascadeOnDelete();
            $table->foreignId('servicioId')->constrained('servicios')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citasServicios');
    }
};
