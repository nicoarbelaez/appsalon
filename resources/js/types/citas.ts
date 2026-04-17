export interface Servicio {
    id: number;
    nombre: string;
    precio: string;
    duracion: number;
    descripcion: string | null;
}

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    telefono?: string | null;
}

export type EstadoCita = 'pendiente' | 'confirmada' | 'completada' | 'cancelada';

export interface Cita {
    id: number;
    fecha: string;
    hora: string;
    total: string;
    estado: EstadoCita;
    usuario: Usuario | null;
    nombre_invitado: string | null;
    servicios: Servicio[];
}

export interface BusySlot {
    fecha: string;
    hora: string;
}
