import * as React from 'react';
import { Head, router } from '@inertiajs/react';
import {
    CalendarCheck,
    CalendarDays,
    Scissors,
    TrendingUp,
    Users,
} from 'lucide-react';
import { CitasHoyTable } from '@/components/dashboard/citas-hoy-table';
import { CitasAreaChart } from '@/components/dashboard/charts/citas-area-chart';
import { CitasLineChart } from '@/components/dashboard/charts/citas-line-chart';
import { DashboardFilters } from '@/components/dashboard/dashboard-filters';
import { StatCard } from '@/components/dashboard/stat-card';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { dashboard } from '@/routes';
import type {
    DashboardFiltros,
    FuncionarioDashboardProps,
} from '@/types/dashboard';

export default function FuncionarioDashboard({
    stats,
    citasPorDia,
    citasPorServicio,
    citasHoyDetalle,
    servicios,
    filtros,
}: FuncionarioDashboardProps) {
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
            <Head title="Dashboard — Funcionario" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Panel de Funcionario
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Resumen de actividad del salón
                        </p>
                    </div>
                    <DashboardFilters
                        filtros={filtros}
                        servicios={servicios}
                        onFiltrosChange={handleFiltrosChange}
                    />
                </div>

                {/* Fixed stats — always visible */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

FuncionarioDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
