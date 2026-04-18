<?php

namespace App\Reportes\Actions;

use App\Models\ReportePdf;
use App\Reportes\DTOs\FiltroPdfDTO;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerarPdfAction
{
    public function __construct(
        private ConsultarDatosReporteAction $consultar,
    ) {}

    public function execute(ReportePdf $reporte): void
    {
        $filtros = FiltroPdfDTO::fromArray($reporte->filtros ?? []);
        $datos   = $this->consultar->execute($filtros);

        $vista = match ($filtros->tipo) {
            'citas'    => 'reportes.citas',
            'ingresos' => 'reportes.ingresos',
            'clientes' => 'reportes.clientes',
            default    => throw new \InvalidArgumentException("Tipo inválido: {$filtros->tipo}"),
        };

        $nombreArchivo = "reporte_{$filtros->tipo}_{$reporte->id}_" . now()->format('Ymd_His') . '.pdf';
        $rutaRelativa  = "reportes/{$nombreArchivo}";
        $rutaCompleta  = storage_path("app/private/{$rutaRelativa}");

        if (! is_dir(dirname($rutaCompleta))) {
            mkdir(dirname($rutaCompleta), 0755, true);
        }

        $pdf = Pdf::loadView($vista, array_merge($datos, [
            'generado_en' => now()->format('d/m/Y H:i'),
            'filtros'     => $filtros,
        ]));
        $pdf->setPaper('a4', 'portrait');
        $pdf->save($rutaCompleta);

        $reporte->update([
            'estado'         => 'listo',
            'ruta_archivo'   => $rutaRelativa,
            'nombre_archivo' => $nombreArchivo,
            'expira_en'      => now()->addHours(24),
        ]);
    }
}
