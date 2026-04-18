<?php

namespace App\Reportes\Actions;

use App\Models\Cita;
use App\Models\User;
use App\Reportes\DTOs\CitaReporteDTO;
use App\Reportes\DTOs\FiltroPdfDTO;
use Illuminate\Support\Facades\DB;

class ConsultarDatosReporteAction
{
    public function execute(FiltroPdfDTO $filtros): array
    {
        return match ($filtros->tipo) {
            'citas'    => $this->datosCitas($filtros),
            'ingresos' => $this->datosIngresos($filtros),
            'clientes' => $this->datosClientes($filtros),
            default    => throw new \InvalidArgumentException("Tipo de reporte inválido: {$filtros->tipo}"),
        };
    }

    private function datosCitas(FiltroPdfDTO $filtros): array
    {
        $query = Cita::with(['usuario:id,nombre,apellido,email', 'servicios:id,nombre,precio,duracion'])
            ->orderBy('fecha')
            ->orderBy('hora');

        $this->aplicarFiltrosComunes($query, $filtros);

        $citas = $query->get();

        return [
            'titulo'    => 'Reporte de Citas',
            'subtitulo' => $this->subtituloFecha($filtros),
            'citas'     => $citas->map(fn(Cita $c) => CitaReporteDTO::fromCita($c)),
            'resumen'   => [
                'total_citas'    => $citas->count(),
                'completadas'    => $citas->where('estado', 'completada')->count(),
                'pendientes'     => $citas->where('estado', 'pendiente')->count(),
                'canceladas'     => $citas->where('estado', 'cancelada')->count(),
                'ingresos_total' => '$' . number_format(
                    (float) $citas->whereIn('estado', ['completada', 'confirmada'])->sum('total'), 2
                ),
            ],
        ];
    }

    private function datosIngresos(FiltroPdfDTO $filtros): array
    {
        $porDiaQuery = Cita::selectRaw('DATE(fecha) as dia, COUNT(*) as citas, SUM(total) as ingresos')
            ->whereIn('estado', ['completada', 'confirmada']);

        $this->aplicarFiltrosComunes($porDiaQuery, $filtros);

        $porDia = $porDiaQuery->groupBy('dia')->orderBy('dia')->get()
            ->map(fn($r) => [
                'dia'      => \Carbon\Carbon::parse($r->dia)->format('d/m/Y'),
                'citas'    => (int) $r->citas,
                'ingresos' => '$' . number_format((float) $r->ingresos, 2),
            ]);

        $porServicio = DB::table('citasServicios')
            ->join('servicios', 'servicios.id', '=', 'citasServicios.servicioId')
            ->join('citas', 'citas.id', '=', 'citasServicios.citaId')
            ->whereIn('citas.estado', ['completada', 'confirmada'])
            ->when($filtros->fechaDesde, fn($q) => $q->where('citas.fecha', '>=', $filtros->fechaDesde))
            ->when($filtros->fechaHasta, fn($q) => $q->where('citas.fecha', '<=', $filtros->fechaHasta))
            ->when($filtros->servicioId, fn($q) => $q->where('servicios.id', $filtros->servicioId))
            ->selectRaw('servicios.nombre, COUNT(*) as veces, SUM(servicios.precio) as total')
            ->groupBy('servicios.nombre')
            ->orderByDesc('total')
            ->get();

        $totalGeneral = (float) $porServicio->sum('total');

        return [
            'titulo'        => 'Reporte de Ingresos',
            'subtitulo'     => $this->subtituloFecha($filtros),
            'por_dia'       => $porDia,
            'por_servicio'  => $porServicio->map(fn($r) => [
                'servicio'   => $r->nombre,
                'veces'      => (int) $r->veces,
                'total'      => '$' . number_format((float) $r->total, 2),
                'porcentaje' => $totalGeneral > 0
                    ? round((float) $r->total * 100 / $totalGeneral, 1) . '%'
                    : '0%',
            ]),
            'total_general' => '$' . number_format($totalGeneral, 2),
        ];
    }

    private function datosClientes(FiltroPdfDTO $filtros): array
    {
        $clientes = User::where('rol', 'cliente')
            ->withCount('citas as total_citas')
            ->withSum('citas as total_gastado', 'total')
            ->orderByDesc('total_citas')
            ->get()
            ->map(fn(User $u) => [
                'nombre'        => "{$u->nombre} {$u->apellido}",
                'email'         => $u->email,
                'telefono'      => $u->telefono ?? '—',
                'total_citas'   => (int) $u->total_citas,
                'total_gastado' => '$' . number_format((float) $u->total_gastado, 2),
            ]);

        return [
            'titulo'         => 'Reporte de Clientes',
            'subtitulo'      => 'Todos los clientes registrados',
            'clientes'       => $clientes,
            'total_clientes' => $clientes->count(),
        ];
    }

    private function aplicarFiltrosComunes($query, FiltroPdfDTO $filtros): void
    {
        if ($filtros->fechaDesde) {
            $query->where('fecha', '>=', $filtros->fechaDesde);
        }
        if ($filtros->fechaHasta) {
            $query->where('fecha', '<=', $filtros->fechaHasta);
        }
        if ($filtros->estado) {
            $query->where('estado', $filtros->estado);
        }
        if ($filtros->servicioId) {
            $query->whereHas('servicios', fn($q) => $q->where('servicios.id', $filtros->servicioId));
        }
    }

    private function subtituloFecha(FiltroPdfDTO $filtros): string
    {
        if ($filtros->fechaDesde && $filtros->fechaHasta) {
            return "Del {$filtros->fechaDesde} al {$filtros->fechaHasta}";
        }
        if ($filtros->fechaDesde) {
            return "Desde {$filtros->fechaDesde}";
        }
        if ($filtros->fechaHasta) {
            return "Hasta {$filtros->fechaHasta}";
        }
        return 'Todos los registros';
    }
}
