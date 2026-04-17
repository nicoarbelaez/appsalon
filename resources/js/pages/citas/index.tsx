import { Head, Link, router } from '@inertiajs/react';
import { CalendarDays, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

interface Servicio {
    id: number;
    nombre: string;
}

interface Cita {
    id: number;
    fecha: string;
    hora: string;
    total: string;
    estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
    servicios: Servicio[];
}

interface Props {
    citas: Cita[];
}

const estadoConfig: Record<string, { label: string; className: string }> = {
    pendiente: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
    confirmada: { label: 'Confirmada', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
    completada: { label: 'Completada', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
    cancelada: { label: 'Cancelada', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

function formatFecha(fecha: string) {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatHora(hora: string) {
    const [h, m] = hora.split(':');
    const d = new Date();
    d.setHours(parseInt(h), parseInt(m));
    return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export default function CitasIndex({ citas }: Props) {
    function cancelar(id: number) {
        if (!confirm('¿Cancelar esta cita?')) return;
        router.delete(`/citas/${id}`);
    }

    const activas = citas.filter((c) => c.estado !== 'cancelada');
    const canceladas = citas.filter((c) => c.estado === 'cancelada');

    return (
        <>
            <Head title="Mis citas" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis citas</h1>
                        <p className="text-sm text-gray-500">{activas.length} cita(s) activa(s)</p>
                    </div>
                    <Button asChild className="bg-rose-600 hover:bg-rose-700">
                        <Link href="/citas/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Reservar cita
                        </Link>
                    </Button>
                </div>

                {citas.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <CalendarDays className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                            <p className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                                No tienes citas registradas
                            </p>
                            <p className="mb-6 text-sm text-gray-500">
                                Reserva tu primera cita y empieza a lucir increíble.
                            </p>
                            <Button asChild className="bg-rose-600 hover:bg-rose-700">
                                <Link href="/citas/create">Reservar ahora</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {activas.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Citas activas</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {activas.map((cita) => (
                                            <div
                                                key={cita.id}
                                                className="flex items-center justify-between px-6 py-4"
                                            >
                                                <div>
                                                    <p className="font-medium capitalize text-gray-900 dark:text-white">
                                                        {formatFecha(cita.fecha)} — {formatHora(cita.hora)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {cita.servicios.map((s) => s.nombre).join(', ')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-rose-600">
                                                        ${cita.total}
                                                    </span>
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${estadoConfig[cita.estado]?.className}`}
                                                    >
                                                        {estadoConfig[cita.estado]?.label}
                                                    </span>
                                                    {['pendiente', 'confirmada'].includes(cita.estado) && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            onClick={() => cancelar(cita.id)}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {canceladas.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-400">Citas canceladas</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {canceladas.map((cita) => (
                                            <div
                                                key={cita.id}
                                                className="flex items-center justify-between px-6 py-4 opacity-60"
                                            >
                                                <div>
                                                    <p className="font-medium capitalize text-gray-700 dark:text-gray-400">
                                                        {formatFecha(cita.fecha)} — {formatHora(cita.hora)}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {cita.servicios.map((s) => s.nombre).join(', ')}
                                                    </p>
                                                </div>
                                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
                                                    Cancelada
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

CitasIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Mis citas', href: '/citas' },
    ],
};
