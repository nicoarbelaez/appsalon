<?php

namespace App\Jobs;

use App\Models\ReportePdf;
use App\Reportes\Actions\GenerarPdfAction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class GenerarReportePdfJob implements ShouldQueue
{
    use Queueable, InteractsWithQueue, SerializesModels;

    public int $tries   = 2;
    public int $timeout = 120;
    public int $backoff = 10;

    public function __construct(
        public readonly ReportePdf $reporte,
    ) {}

    public function handle(GenerarPdfAction $action): void
    {
        $this->reporte->update(['estado' => 'procesando']);

        $action->execute($this->reporte);
    }

    public function failed(Throwable $exception): void
    {
        $this->reporte->update([
            'estado'        => 'error',
            'error_mensaje' => $exception->getMessage(),
        ]);
    }
}
