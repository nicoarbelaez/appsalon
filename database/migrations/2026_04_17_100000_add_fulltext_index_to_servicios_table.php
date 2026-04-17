<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE servicios ADD FULLTEXT INDEX ft_servicios (nombre, descripcion)');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE servicios DROP INDEX ft_servicios');
    }
};
