<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Servicio;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        if ($request->user()->isAdmin()) {
            return $this->adminDashboard($request);
        }

        if ($request->user()->isFuncionario()) {
            return $this->funcionarioDashboard($request);
        }

        return $this->clienteDashboard($request);
    }

    // ── Admin ─────────────────────────────────────────────────────────────────

    private function adminDashboard(Request $request): Response
    {
        [$desde, $hasta, $servicioId] = $this->parseFiltros($request);

        $stats = [
            'citasHoy' => Cita::whereDate('fecha', today())->count(),
            'citasTotal' => Cita::count(),
            'totalClientes' => User::where('rol', 'cliente')->count(),
            'totalServicios' => Servicio::where('activo', true)->count(),
            'ingresos' => $desde && $hasta
                ? (string) Cita::whereBetween('fecha', [$desde, $hasta])
                    ->whereIn('estado', ['completada', 'confirmada'])
                    ->sum('total')
                : '0',
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'citasPorDia' => $desde && $hasta ? $this->getCitasPorDia($desde, $hasta) : collect(),
            'citasPorServicio' => $desde && $hasta ? $this->getCitasPorServicio($desde, $hasta, $servicioId) : collect(),
            'citasHoyDetalle' => $this->getCitasHoy(),
            'servicios' => Servicio::where('activo', true)->select('id', 'nombre')->orderBy('nombre')->get(),
            'filtros' => compact('desde', 'hasta', 'servicioId'),
            'config' => ['showIngresos' => true],
        ]);
    }

    // ── Funcionario ───────────────────────────────────────────────────────────

    private function funcionarioDashboard(Request $request): Response
    {
        [$desde, $hasta, $servicioId] = $this->parseFiltros($request);

        $stats = [
            'citasHoy' => Cita::whereDate('fecha', today())->count(),
            'citasTotal' => Cita::count(),
            'totalClientes' => User::where('rol', 'cliente')->count(),
            'totalServicios' => Servicio::where('activo', true)->count(),
        ];

        return Inertia::render('funcionario/dashboard', [
            'stats' => $stats,
            'citasPorDia' => $desde && $hasta ? $this->getCitasPorDia($desde, $hasta) : collect(),
            'citasPorServicio' => $desde && $hasta ? $this->getCitasPorServicio($desde, $hasta, $servicioId) : collect(),
            'citasHoyDetalle' => $this->getCitasHoy(),
            'servicios' => Servicio::where('activo', true)->select('id', 'nombre')->orderBy('nombre')->get(),
            'filtros' => compact('desde', 'hasta', 'servicioId'),
            'config' => ['showIngresos' => false],
        ]);
    }

    // ── Cliente ───────────────────────────────────────────────────────────────

    private function clienteDashboard(Request $request): Response
    {
        $userId = $request->user()->id;
        $hoy = today()->toDateString();

        $misCitas = Cita::where('usuarioId', $userId)
            ->with(['servicios:id,nombre,precio,duracion'])
            ->orderByDesc('fecha')
            ->orderByDesc('hora')
            ->get();

        $proximaCita = $misCitas
            ->whereIn('estado', ['pendiente', 'confirmada'])
            ->where('fecha', '>=', $hoy)
            ->sortBy('fecha')
            ->sortBy('hora')
            ->first();

        $stats = [
            'totalCitas' => $misCitas->count(),
            'citasPendientes' => $misCitas->whereIn('estado', ['pendiente', 'confirmada'])->count(),
            'citasCompletadas' => $misCitas->where('estado', 'completada')->count(),
        ];

        return Inertia::render('dashboard', compact('stats', 'proximaCita', 'misCitas'));
    }

    // ── Shared queries ────────────────────────────────────────────────────────

    private function parseFiltros(Request $request): array
    {
        if (!$request->has('fecha_desde')) {
            // First load — default to last 7 days
            $desde = Carbon::now()->subDays(6)->toDateString();
            $hasta = Carbon::now()->toDateString();
        } else {
            // User explicitly set or cleared the range
            $desde = $request->query('fecha_desde') ?: null;
            $hasta = $request->query('fecha_hasta') ?: null;
        }
        $servicioId = $request->query('servicio_id') ? (int) $request->query('servicio_id') : null;

        if ($desde && $hasta && $desde > $hasta) {
            $desde = $hasta;
        }

        return [$desde, $hasta, $servicioId];
    }

    private function getCitasPorDia(string $desde, string $hasta): \Illuminate\Support\Collection
    {
        return Cita::selectRaw('DATE(fecha) as dia, SUM(total) as total')
            ->whereBetween('fecha', [$desde, $hasta])
            ->whereIn('estado', ['completada', 'confirmada'])
            ->groupBy('dia')
            ->orderBy('dia')
            ->get()
            ->map(fn($r) => ['dia' => $r->dia, 'total' => (float) $r->total]);
    }

    private function getCitasPorServicio(string $desde, string $hasta, ?int $servicioId): \Illuminate\Support\Collection
    {
        return DB::table('citasServicios')
            ->join('servicios', 'servicios.id', '=', 'citasServicios.servicioId')
            ->join('citas', 'citas.id', '=', 'citasServicios.citaId')
            ->whereBetween('citas.fecha', [$desde, $hasta])
            ->whereIn('citas.estado', ['completada', 'confirmada'])
            ->when($servicioId, fn($q) => $q->where('servicios.id', $servicioId))
            ->selectRaw('DATE(citas.fecha) as dia, servicios.nombre as servicio, SUM(servicios.precio) as total')
            ->groupBy('dia', 'servicio')
            ->orderBy('dia')
            ->get()
            ->map(fn($r) => ['dia' => $r->dia, 'servicio' => $r->servicio, 'total' => (float) $r->total]);
    }

    private function getCitasHoy(): \Illuminate\Database\Eloquent\Collection
    {
        return Cita::whereDate('fecha', today())
            ->with(['usuario:id,nombre,apellido', 'servicios:id,nombre,precio'])
            ->orderBy('hora')
            ->get();
    }
}
