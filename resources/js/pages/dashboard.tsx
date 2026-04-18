import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, CheckCircle2, Clock3, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { NextAppointmentCard } from '@/components/dashboard/next-appointment-card';
import { StatCard } from '@/components/dashboard/stat-card';
import { CitasTable } from '@/components/citas/citas-table';
import { dashboard } from '@/routes';
import type { ClienteDashboardProps } from '@/types/dashboard';
import type { Cita } from '@/types/citas';
import { shareOrCopy } from '@/lib/clipboard/copyToClipboard';

type PageProps = ClienteDashboardProps & {
    auth: { user: { nombre: string; apellido: string } };
};

export default function Dashboard({
    stats,
    proximaCita,
    misCitas,
}: ClienteDashboardProps) {
    const { auth } = usePage().props as unknown as PageProps;

    function handleRowClick(_cita: Cita) {
        // Navigate to appointments list for full management
    }

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            ¡Hola, {auth.user.nombre}!
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Gestiona tus citas desde aquí
                        </p>
                    </div>
                    <Button asChild className="bg-rose-600 hover:bg-rose-700">
                        <Link href="/citas">
                            <Plus className="mr-2 h-4 w-4" />
                            Reservar cita
                        </Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                        title="Total citas"
                        value={stats.totalCitas}
                        icon={CalendarDays}
                    />
                    <StatCard
                        title="Próximas / Pendientes"
                        value={stats.citasPendientes}
                        icon={Clock3}
                        iconClassName="text-yellow-500"
                        valueClassName="text-yellow-600"
                    />
                    <StatCard
                        title="Completadas"
                        value={stats.citasCompletadas}
                        icon={CheckCircle2}
                        iconClassName="text-green-500"
                        valueClassName="text-green-600"
                    />
                </div>

                {/* Next appointment */}
                <NextAppointmentCard cita={proximaCita} />

                {/* Share Link */}
                <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white dark:border-indigo-900 dark:from-indigo-950/20 dark:to-gray-900">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                            <Plus className="h-5 w-5 text-indigo-500" />
                            Comparte tu negocio
                        </CardTitle>
                        <CardDescription>
                            Usa este link para que tus clientes agenden sin
                            registrarse
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 truncate rounded-md border bg-white px-3 py-2 font-mono text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                {typeof window !== 'undefined'
                                    ? `${window.location.origin}/reservar`
                                    : '/reservar'}
                            </div>
                            <Button
                                variant="outline"
                                className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-950"
                                onClick={() => {
                                    const url = `${window.location.origin}/reservar`;
                                    shareOrCopy(url, {
                                        onSuccess: () =>
                                            toast.success('Texto copiado'),
                                        onError: () =>
                                            toast.error('No se pudo copiar'),
                                    });
                                }}
                            >
                                Compartir
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Historial */}
                {misCitas.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                Historial de citas
                            </h2>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/citas">Ver todas</Link>
                            </Button>
                        </div>
                        <CitasTable
                            citas={misCitas}
                            mode="mis-citas"
                            onRowClick={handleRowClick}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
