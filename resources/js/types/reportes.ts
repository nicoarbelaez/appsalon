export type TipoReporte = 'citas' | 'ingresos' | 'clientes';
export type EstadoReporte = 'pendiente' | 'procesando' | 'listo' | 'error';

export interface FiltroReporte {
    tipo: TipoReporte;
    fecha_desde?: string;
    fecha_hasta?: string;
    estado?: string;
    servicio_id?: number;
}

export interface ReporteHistorial {
    id: number;
    tipo: TipoReporte;
    estado: EstadoReporte;
    filtros: FiltroReporte | null;
    nombre_archivo: string | null;
    expira_en: string | null;
    created_at: string;
}
