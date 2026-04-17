export interface Servicio {
    id: number;
    nombre: string;
    precio: string;
    descripcion: string | null;
    duracion: number;
    activo: boolean;
}

export interface ServiciosFilters {
    search: string;
    activo: '' | '0' | '1';
}
