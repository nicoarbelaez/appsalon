import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, CheckCircle2, Clock3, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

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
    estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
    servicios: Servicio[];
}

interface Stats {
    totalCitas: number;
    citasPendientes: number;
    citasCompletadas: number;
}

interface Props {
    proximasCitas: Cita[];
    stats: Stats;
}

const estadoBadge: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmada: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completada: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelada: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
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
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export default function Dashboard({ proximasCitas = [], stats }: Props) {
    const { auth } = usePage().props as { auth: { user: { nombre: string; apellido: string } } };

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            ¡Hola, {auth.user.nombre}!
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Gestiona tus citas desde aquí
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/citas/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Reservar cita
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total citas</CardTitle>
                            <CalendarDays className="h-4 w-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.totalCitas}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Próximas / Pendientes</CardTitle>
                            <Clock3 className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-yellow-600">{stats.citasPendientes}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Completadas</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-600">{stats.citasCompletadas}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Share Link */}
                <Card className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-gray-900 border-indigo-100 dark:border-indigo-900">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Plus className="h-5 w-5 text-indigo-500" />
                            Comparte tu negocio
                        </CardTitle>
                        <CardDescription>Usa este link para que tus clientes agenden sin registrarse</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 rounded-md border bg-white px-3 py-2 text-sm text-gray-600 shadow-sm dark:bg-gray-800 dark:border-gray-700 truncate font-mono">
                                {typeof window !== 'undefined' ? `${window.location.origin}/reservar` : '/reservar'}
                            </div>
                            <Button 
                                variant="outline"
                                className="border-indigo-200 hover:bg-indigo-50 text-indigo-600 dark:border-indigo-800 dark:hover:bg-indigo-950"
                                onClick={() => {
                                    const url = `${window.location.origin}/reservar`;
                                    const shareData = {
                                        title: 'App Salón',
                                        text: 'Agenda tu cita en App Salón',
                                        url: url,
                                    };

                                    if (navigator.share && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                                        navigator.share(shareData).catch(console.error);
                                    } else if (navigator.clipboard) {
                                        navigator.clipboard.writeText(url);
                                        alert('Link copiado al portapapeles');
                                    } else {
                                        // Fallback for non-secure contexts
                                        const textArea = document.createElement("textarea");
                                        textArea.value = url;
                                        document.body.appendChild(textArea);
                                        textArea.select();
                                        try {
                                            document.execCommand('copy');
                                            alert('Link copiado al portapapeles');
                                        } catch (err) {
                                            alert('No se pudo copiar el link. Por favor, cópialo manualmente: ' + url);
                                        }
                                        document.body.removeChild(textArea);
                                    }
                                }}
                            >
                                Compartir
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Upcoming appointments */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Próximas citas</CardTitle>
                                <CardDescription>Tus citas programadas</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/citas">Ver todas</Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {proximasCitas.length === 0 ? (
                            <div className="py-8 text-center">
                                <CalendarDays className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                                <p className="text-sm text-gray-500">No tienes citas próximas.</p>
                                <Button className="mt-4" asChild>
                                    <Link href="/citas/create">Reservar primera cita</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {proximasCitas.map((cita) => (
                                    <div key={cita.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                                                {formatFecha(cita.fecha)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatHora(cita.hora)} —{' '}
                                                {cita.servicios.map((s) => s.nombre).join(', ')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-rose-600">
                                                ${cita.total}
                                            </span>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${estadoBadge[cita.estado]}`}
                                            >
                                                {cita.estado}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
