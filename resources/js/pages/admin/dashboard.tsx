import * as React from 'react';
import { Head, router } from '@inertiajs/react';
import {
    CalendarCheck,
    CalendarDays,
    DollarSign,
    Scissors,
    TrendingUp,
    Users,
} from 'lucide-react';
import { CitasHoyTable } from '@/components/dashboard/citas-hoy-table';
import { CitasAreaChart } from '@/components/dashboard/charts/citas-area-chart';
import { CitasLineChart } from '@/components/dashboard/charts/citas-line-chart';
import { DashboardFilters } from '@/components/dashboard/dashboard-filters';
import { StatCard } from '@/components/dashboard/stat-card';
import { StatCardSkeleton } from '@/components/dashboard/stat-card-skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboard } from '@/routes';
import type { AdminDashboardProps, DashboardFiltros } from '@/types/dashboard';

export default function AdminDashboard({
    stats,
    citasPorDia,
    citasPorServicio,
    citasHoyDetalle,
    servicios,
    filtros,
    config,
}: AdminDashboardProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const off1 = router.on('start', () => setIsLoading(true));
        const off2 = router.on('finish', () => setIsLoading(false));
        return () => {
            off1();
            off2();
        };
    }, []);

    function handleFiltrosChange(patch: Partial<DashboardFiltros>) {
        const next = { ...filtros, ...patch };
        const params: Record<string, string> = {
            fecha_desde: next.desde ?? '',
            fecha_hasta: next.hasta ?? '',
        };
        if (next.servicioId) params.servicio_id = String(next.servicioId);
        router.get('/dashboard', params, {
            preserveState: true,
            replace: true,
        });
    }

    const hasRange = Boolean(filtros.desde && filtros.hasta);

    return (
        <>
            <Head title="Dashboard — Admin" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Panel de Administración
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Métricas globales del salón
                        </p>
                    </div>
                    <DashboardFilters
                        filtros={filtros}
                        servicios={servicios}
                        onFiltrosChange={handleFiltrosChange}
                    />
                </div>

                {/* Fixed stats — always visible */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    <StatCard
                        title="Citas hoy"
                        value={stats.citasHoy}
                        icon={CalendarDays}
                        iconClassName="text-rose-500"
                    />

                    <StatCard
                        title="Citas totales"
                        value={stats.citasTotal}
                        icon={CalendarCheck}
                        iconClassName="text-blue-500"
                        valueClassName="text-blue-600"
                    />

                    <StatCard
                        title="Total clientes"
                        value={stats.totalClientes}
                        icon={Users}
                        iconClassName="text-indigo-500"
                        valueClassName="text-indigo-600"
                    />

                    <StatCard
                        title="Servicios activos"
                        value={stats.totalServicios}
                        icon={Scissors}
                        iconClassName="text-purple-500"
                        valueClassName="text-purple-600"
                    />

                    {config.showIngresos &&
                        (isLoading ? (
                            <div className="col-span-2 lg:col-span-1">
                                <StatCardSkeleton count={1} />
                            </div>
                        ) : hasRange ? (
                            <StatCard
                                className="col-span-2 lg:col-span-1"
                                title="Ingresos del período"
                                value={`$${Number(stats.ingresos).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`}
                                icon={DollarSign}
                                iconClassName="text-green-500"
                                valueClassName="text-green-600"
                                description="Citas completadas / confirmadas"
                            />
                        ) : (
                            <Card className="col-span-2 flex flex-col lg:col-span-1">
                                <CardHeader className="pb-2">
                                    <Skeleton className="h-4 w-28" />
                                </CardHeader>
                                <CardContent className="flex flex-1 items-center justify-center py-4">
                                    <p className="text-xs text-muted-foreground">
                                        Sin período seleccionado
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                </div>

                {/* Charts — conditional on date range */}
                {hasRange ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        <CitasLineChart
                            data={citasPorDia}
                            loading={isLoading}
                        />
                        <CitasAreaChart
                            data={citasPorServicio}
                            loading={isLoading}
                        />
                    </div>
                ) : (
                    <Empty className="border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <TrendingUp />
                            </EmptyMedia>
                            <EmptyTitle>Sin rango de fechas</EmptyTitle>
                            <EmptyDescription>
                                Selecciona un rango de fechas para ver las
                                gráficas de ingresos del período.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}

                {/* Today's appointments */}
                <CitasHoyTable citas={citasHoyDetalle} />
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
