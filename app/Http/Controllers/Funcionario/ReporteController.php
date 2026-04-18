<?php

namespace App\Http\Controllers\Funcionario;

use App\Http\Controllers\Controller;
use App\Http\Requests\Reportes\SolicitarReporteRequest;
use App\Jobs\GenerarReportePdfJob;
use App\Models\ReportePdf;
use App\Models\Servicio;
use App\Reportes\DTOs\FiltroPdfDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReporteController extends Controller
{
    public function index(): Response
    {
        $servicios = Servicio::where('activo', true)
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        $historial = ReportePdf::where('usuarioId', auth()->id())
            ->orderByDesc('created_at')
            ->limit(10)
            ->get(['id', 'tipo', 'estado', 'filtros', 'nombre_archivo', 'expira_en', 'created_at']);

        return Inertia::render('reportes/index', [
            'servicios' => $servicios,
            'historial' => $historial,
        ]);
    }

    public function solicitar(SolicitarReporteRequest $request): JsonResponse
    {
        $filtros = FiltroPdfDTO::fromRequest($request);

        $existente = ReportePdf::where('usuarioId', auth()->id())
            ->where('tipo', $filtros->tipo)
            ->where('estado', 'listo')
            ->where('filtros', json_encode($filtros->toArray()))
            ->where('expira_en', '>', now())
            ->where('created_at', '>', now()->subHours(2))
            ->latest()
            ->first();

        if ($existente) {
            return response()->json([
                'reporte_id' => $existente->id,
                'estado'     => 'listo',
                'cached'     => true,
            ]);
        }

        $reporte = ReportePdf::create([
            'usuarioId' => auth()->id(),
            'tipo'      => $filtros->tipo,
            'estado'    => 'pendiente',
            'filtros'   => $filtros->toArray(),
        ]);

        dispatch(new GenerarReportePdfJob($reporte));

        return response()->json([
            'reporte_id' => $reporte->id,
            'estado'     => 'pendiente',
            'cached'     => false,
        ], 202);
    }

    public function estado(ReportePdf $reporte): JsonResponse
    {
        abort_unless($reporte->usuarioId === auth()->id(), 403);

        return response()->json([
            'id'             => $reporte->id,
            'estado'         => $reporte->estado,
            'nombre_archivo' => $reporte->nombre_archivo,
            'error_mensaje'  => $reporte->error_mensaje,
        ]);
    }

    public function urlDescarga(ReportePdf $reporte): JsonResponse
    {
        abort_unless($reporte->usuarioId === auth()->id(), 403);
        abort_unless($reporte->isListo(), 400, 'El reporte aún no está listo.');

        $url = URL::temporarySignedRoute(
            'funcionario.reportes.descargar',
            now()->addMinutes(5),
            ['reporte' => $reporte->id]
        );

        return response()->json(['url' => $url]);
    }

    public function descargar(Request $request, ReportePdf $reporte): StreamedResponse
    {
        abort_unless($request->hasValidSignature(), 403, 'URL de descarga inválida o expirada.');
        abort_unless($reporte->isListo(), 404, 'El reporte no está disponible.');
        abort_unless(! $reporte->estaExpirado(), 410, 'El reporte ha expirado.');
        abort_unless($reporte->usuarioId === auth()->id(), 403);

        abort_unless(
            Storage::disk('local')->exists($reporte->ruta_archivo),
            404,
            'Archivo no encontrado en el servidor.'
        );

        return Storage::disk('local')->download(
            $reporte->ruta_archivo,
            $reporte->nombre_archivo,
            ['Content-Type' => 'application/pdf']
        );
    }
}
