<?php

namespace App\Console\Commands;

use App\Models\ReportePdf;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class LimpiarReportesExpiradosCommand extends Command
{
    protected $signature   = 'reportes:limpiar-expirados';
    protected $description = 'Elimina los archivos PDF y registros de reportes expirados.';

    public function handle(): int
    {
        $expirados = ReportePdf::where('expira_en', '<', now())
            ->whereNotNull('ruta_archivo')
            ->get();

        $eliminados = 0;
        foreach ($expirados as $reporte) {
            if (Storage::disk('local')->exists($reporte->ruta_archivo)) {
                Storage::disk('local')->delete($reporte->ruta_archivo);
            }
            $reporte->delete();
            $eliminados++;
        }

        $this->info("Se eliminaron {$eliminados} reportes expirados.");

        return Command::SUCCESS;
    }
}
