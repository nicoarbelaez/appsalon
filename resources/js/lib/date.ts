import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha en formato string (YYYY-MM-DD) a un formato legible en español.
 * Ejemplo: "2024-04-20" -> "sábado, 20 de abril de 2024"
 */
export function formatFecha(fecha: string) {
    try {
        // Nos aseguramos de tomar solo la parte de la fecha si viene un datetime
        const soloFecha = fecha.slice(0, 10);
        return format(parseISO(soloFecha), "eeee, d 'de' MMMM 'de' yyyy", {
            locale: es,
        });
    } catch (e) {
        return fecha;
    }
}

/**
 * Formatea una hora en formato string (HH:MM:SS) a formato HH:MM.
 * Ejemplo: "14:30:00" -> "14:30"
 */
export function formatHora(hora: string) {
    try {
        const [h, m] = hora.split(':');

        let hour = parseInt(h, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';

        hour = hour % 12;
        hour = hour === 0 ? 12 : hour; // 0 → 12

        return `${hour}:${m} ${ampm}`;
    } catch (e) {
        return hora;
    }
}

/**
 * Convierte un objeto Date a un string de fecha (YYYY-MM-DD).
 */
export function toDateString(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
