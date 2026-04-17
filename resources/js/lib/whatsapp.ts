import { formatFecha, formatHora } from '@/lib/date';
import { estadoConfig } from '@/components/citas/estado-badge';
import type { EstadoCita } from '@/types/citas';

interface CitaParaCompartir {
    fecha: string;
    hora: string;
    total: string;
    estado: string;
    servicios: { nombre: string; precio: string }[];
    nombre_invitado?: string | null;
    usuario?: { nombre: string; apellido: string } | null;
}

export function buildWhatsAppUrl(cita: CitaParaCompartir, token?: string): string {
    const nombre =
        cita.usuario
            ? `${cita.usuario.nombre} ${cita.usuario.apellido}`
            : cita.nombre_invitado ?? '';

    const serviciosList = cita.servicios.map((s) => `- ${s.nombre}`).join('\n');
    const estadoLabel =
        estadoConfig[cita.estado as EstadoCita]?.label ?? cita.estado;

    let mensaje =
        `¡Hola${nombre ? `, ${nombre}` : ''}! Aquí están los datos de tu cita en AppSalon:\n\n` +
        `📅 Fecha: ${formatFecha(cita.fecha)}\n` +
        `🕐 Hora: ${formatHora(cita.hora)}\n` +
        `💇 Servicios:\n${serviciosList}\n` +
        `💰 Total: $${parseFloat(cita.total).toFixed(2)}\n` +
        `📋 Estado: ${estadoLabel}`;

    if (token) {
        const urlSeguimiento = `${window.location.origin}/reservar/estado/${token}`;
        mensaje += `\n\n🔗 Ver / gestionar cita:\n${urlSeguimiento}`;
    }

    return `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
}

export function compartirCitaWhatsApp(cita: CitaParaCompartir, token?: string): void {
    window.open(buildWhatsAppUrl(cita, token), '_blank');
}
