import * as React from 'react';
import { Head } from '@inertiajs/react';
import { CalendarDays, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

interface Servicio {
    id: number;
    nombre: string;
}

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
}

interface Cita {
    id: number;
    fecha: string;
    hora: string;
    total: string;
    estado: string;
    usuario: Usuario | null;
    nombre_invitado: string | null;
    servicios: Servicio[];
}

interface Props {
    citas: Cita[];
    hoy: string;
}

const estadoBadge: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmada: 'bg-blue-100 text-blue-800',
    completada: 'bg-green-100 text-green-800',
    cancelada: 'bg-red-100 text-red-800',
};

function formatFecha(fecha: string) {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
        weekday: 'long',
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

function getNombreCliente(cita: Cita) {
    if (cita.usuario) return `${cita.usuario.nombre} ${cita.usuario.apellido}`;
    if (cita.nombre_invitado) return `${cita.nombre_invitado} (invitado)`;
    return 'Sin datos';
}

export default function FuncionarioCitas({ citas, hoy }: Props) {
    const [fechaFiltro, setFechaFiltro] = React.useState(hoy);

    const citasFiltradas = citas.filter((c) => c.fecha === fechaFiltro || !fechaFiltro);

    const citasAgrupadas = citasFiltradas.reduce<Record<string, Cita[]>>((acc, cita) => {
        if (!acc[cita.fecha]) acc[cita.fecha] = [];
        acc[cita.fecha].push(cita);
        return acc;
    }, {});

    return (
        <>
            <Head title="Agenda de citas" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Agenda de citas
                        </h1>
                        <p className="text-sm text-gray-500">Vista de solo lectura</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-600">Filtrar fecha:</label>
                        <input
                            type="date"
                            value={fechaFiltro}
                            onChange={(e) => setFechaFiltro(e.target.value)}
                            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        />
                        {fechaFiltro && (
                            <button
                                onClick={() => setFechaFiltro('')}
                                className="text-xs text-gray-400 hover:text-gray-600"
                            >
                                Ver todas
                            </button>
                        )}
                    </div>
                </div>

                {Object.keys(citasAgrupadas).length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CalendarDays className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                            <p className="text-gray-500">No hay citas para mostrar.</p>
                        </CardContent>
                    </Card>
                ) : (
                    Object.entries(citasAgrupadas).map(([fecha, citasDia]) => (
                        <Card key={fecha}>
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base capitalize">
                                    <CalendarDays className="h-4 w-4 text-rose-600" />
                                    {formatFecha(fecha)}
                                    <span className="ml-auto text-sm font-normal text-gray-400">
                                        {citasDia.length} cita(s)
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {citasDia.map((cita) => (
                                        <div
                                            key={cita.id}
                                            className="flex items-center justify-between px-6 py-3"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1 text-sm font-medium text-rose-600">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {formatHora(cita.hora)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {getNombreCliente(cita)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {cita.servicios.map((s) => s.nombre).join(', ')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-gray-700">
                                                    ${cita.total}
                                                </span>
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${estadoBadge[cita.estado] ?? ''}`}
                                                >
                                                    {cita.estado}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </>
    );
}

FuncionarioCitas.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Agenda', href: '/funcionario/citas' },
    ],
};
