import type { Cita } from '@/types/citas';

export interface DashboardConfig {
    showIngresos: boolean;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface AdminStats {
    citasHoy: number;
    citasTotal: number;
    totalClientes: number;
    totalServicios: number;
    ingresos: string;
}

export interface FuncionarioStats {
    citasHoy: number;
    citasTotal: number;
    totalClientes: number;
    totalServicios: number;
}

export interface ClienteStats {
    totalCitas: number;
    citasPendientes: number;
    citasCompletadas: number;
}

// ─── Chart data ───────────────────────────────────────────────────────────────

export interface CitasPorDiaItem {
    dia: string;    // 'YYYY-MM-DD'
    total: number;
}

export interface CitasPorServicioItem {
    dia: string;
    servicio: string;
    total: number;
}

export interface CitasPorServicioPivot {
    dia: string;
    [servicio: string]: string | number;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface DashboardFiltros {
    desde: string;              // 'YYYY-MM-DD'
    hasta: string;              // 'YYYY-MM-DD'
    servicioId: number | null;
}

// ─── Cliente ─────────────────────────────────────────────────────────────────

export interface ProximaCita {
    id: number;
    fecha: string;
    hora: string;
    total: string;
    estado: 'pendiente' | 'confirmada';
    servicios: Array<{
        id: number;
        nombre: string;
        precio: string;
        duracion: number;
    }>;
}

// ─── Page props ───────────────────────────────────────────────────────────────

export interface AdminDashboardProps {
    stats: AdminStats;
    citasPorDia: CitasPorDiaItem[];
    citasPorServicio: CitasPorServicioItem[];
    citasHoyDetalle: Cita[];
    servicios: Array<{ id: number; nombre: string }>;
    filtros: DashboardFiltros;
    config: DashboardConfig;
}

export type FuncionarioDashboardProps = Omit<AdminDashboardProps, 'stats'> & {
    stats: FuncionarioStats;
};

export interface ClienteDashboardProps {
    stats: ClienteStats;
    proximaCita: ProximaCita | null;
    misCitas: Cita[];
}
