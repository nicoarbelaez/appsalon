import * as React from 'react';
import { Head } from '@inertiajs/react';
import { CalendarDays, CheckCircle2, Clock, MessageCircle, Scissors, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Servicio {
    id: number;
    nombre: string;
    precio: string;
}

interface Cita {
    id: number;
    fecha: string;
    hora: string;
    total: string;
    estado: string;
    nombre_invitado: string | null;
    email_invitado: string | null;
    telefono_invitado: string | null;
    servicios: Servicio[];
}

interface Props {
    cita: Cita;
    token: string;
}

const estadoConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pendiente: {
        label: 'Pendiente de confirmación',
        color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        icon: <Clock className="h-5 w-5 text-yellow-600" />,
    },
    confirmada: {
        label: 'Confirmada',
        color: 'text-blue-600 bg-blue-50 border-blue-200',
        icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
    },
    completada: {
        label: 'Completada',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    },
    cancelada: {
        label: 'Cancelada',
        color: 'text-red-600 bg-red-50 border-red-200',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
    },
};

function formatFecha(fecha: string) {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatHora(hora: string) {
    const [h, m] = hora.split(':');
    const d = new Date();
    d.setHours(parseInt(h), parseInt(m));
    return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export default function ReservarEstado({ cita, token }: Props) {
    const config = estadoConfig[cita.estado] ?? estadoConfig.pendiente;

    function compartirWhatsApp() {
        const serviciosList = cita.servicios.map((s) => `• ${s.nombre}`).join('\n');
        const mensaje =
            `¡Hola! Aquí están los datos de mi cita en AppSalon:\n\n` +
            `📅 Fecha: ${formatFecha(cita.fecha)}\n` +
            `🕐 Hora: ${formatHora(cita.hora)}\n` +
            `💇 Servicios:\n${serviciosList}\n` +
            `💰 Total: $${parseFloat(cita.total).toFixed(2)}\n` +
            `📋 Estado: ${config.label}\n\n` +
            `Código de seguimiento: ${token}`;

        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    }

    return (
        <>
            <Head title="Estado de tu cita — AppSalon" />

            {/* Header */}
            <header className="border-b border-gray-100 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <a href="/" className="flex items-center gap-2">
                        <Scissors className="h-5 w-5 text-rose-600" />
                        <span className="font-bold text-gray-900 dark:text-white">
                            App<span className="text-rose-600">Salon</span>
                        </span>
                    </a>
                    <a href="/reservar" className="text-sm text-gray-500 hover:text-rose-600">
                        Nueva reserva
                    </a>
                </div>
            </header>

            <main className="mx-auto max-w-2xl px-6 py-10">
                {/* Success banner */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
                        <CheckCircle2 className="h-8 w-8 text-rose-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        ¡Reserva recibida!
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Guarda tu código de seguimiento para consultar el estado de tu cita.
                    </p>
                </div>

                {/* Token card */}
                <Card className="mb-6 border-rose-100 bg-rose-50 dark:border-rose-900 dark:bg-rose-900/10">
                    <CardContent className="py-4 text-center">
                        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-rose-600">
                            Código de seguimiento
                        </p>
                        <p className="font-mono text-sm font-bold text-rose-700 break-all dark:text-rose-400">
                            {token}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Visita{' '}
                            <span className="font-medium text-rose-600">/reservar/estado/{token}</span>{' '}
                            para ver el estado
                        </p>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                    {/* Status */}
                    <Card>
                        <CardContent className={`flex items-center gap-3 rounded-lg border py-4 ${config.color}`}>
                            {config.icon}
                            <div>
                                <p className="text-sm font-semibold">Estado actual</p>
                                <p className="text-sm capitalize">{config.label}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Details */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CalendarDays className="h-4 w-4 text-rose-600" />
                                Detalles de la cita
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Cliente</span>
                                <span className="font-medium">{cita.nombre_invitado}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Fecha</span>
                                <span className="font-medium capitalize">{formatFecha(cita.fecha)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Hora</span>
                                <span className="font-medium">{formatHora(cita.hora)}</span>
                            </div>
                            <div className="border-t pt-3">
                                <p className="mb-2 text-gray-500">Servicios</p>
                                <ul className="space-y-1">
                                    {cita.servicios.map((s) => (
                                        <li key={s.id} className="flex justify-between">
                                            <span>{s.nombre}</span>
                                            <span className="font-medium text-rose-600">
                                                ${parseFloat(s.precio).toFixed(2)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex justify-between border-t pt-3">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-rose-600">
                                    ${parseFloat(cita.total).toFixed(2)}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            onClick={compartirWhatsApp}
                            className="flex-1 bg-[#25D366] hover:bg-[#1ebe5d] text-white"
                        >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Compartir por WhatsApp
                        </Button>
                        <Button variant="outline" asChild className="flex-1">
                            <a href="/reservar">Hacer otra reserva</a>
                        </Button>
                    </div>
                </div>
            </main>
        </>
    );
}
