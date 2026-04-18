<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('horarios', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('dia_semana')->unique(); // 0=domingo … 6=sábado
            $table->boolean('activo')->default(true);
            $table->json('tramos'); // [{"inicio":"09:00","fin":"18:00"}, ...]
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('horarios');
    }
};
