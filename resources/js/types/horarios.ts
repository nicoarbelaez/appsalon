export interface HorarioTramo {
    inicio: string; // "HH:MM"
    fin: string;    // "HH:MM"
}

export interface Horario {
    id: number;
    dia_semana: number; // 0=domingo … 6=sábado
    activo: boolean;
    tramos: HorarioTramo[];
}
