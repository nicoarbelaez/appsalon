import { Head, Link } from '@inertiajs/react';
import { CalendarDays, DollarSign, Scissors, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Servicio {
    id: number;
    nombre: string;
    precio: string;
}

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
}

interface Cita {
    id: number;
    fecha: string;
    hora: string;
    total: string;
    estado: string;
    usuario: Usuario;
    servicios: Servicio[];
}

interface Stats {
    citasHoy: number;
    ingresosDia: number;
    totalClientes: number;
    totalServicios: number;
}

interface Props {
    stats: Stats;
    citasHoy: Cita[];
}

const estadoBadge: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmada: 'bg-blue-100 text-blue-800',
    completada: 'bg-green-100 text-green-800',
    cancelada: 'bg-red-100 text-red-800',
};

function formatHora(hora: string) {
    const [h, m] = hora.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export default function AdminDashboard({ stats, citasHoy = [] }: Props) {
    return (
        <>
            <Head title="Admin — Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Panel de Administración
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Resumen del día de hoy
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/admin/servicios">Gestionar servicios</Link>
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Citas hoy</CardTitle>
                            <CalendarDays className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.citasHoy}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Ingresos hoy</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-600">
                                ${Number(stats.ingresosDia).toFixed(2)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Total clientes</CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-blue-600">{stats.totalClientes}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">Servicios activos</CardTitle>
                            <Scissors className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-purple-600">{stats.totalServicios}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Today's appointments */}
                <Card>
                    <CardHeader>
                        <CardTitle>Citas de hoy</CardTitle>
                        <CardDescription>
                            {citasHoy.length === 0
                                ? 'No hay citas programadas para hoy.'
                                : `${citasHoy.length} cita(s) programada(s)`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {citasHoy.length === 0 ? (
                            <div className="py-8 text-center">
                                <CalendarDays className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                                <p className="text-sm text-gray-500">Sin citas para hoy.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <th className="py-2 text-left font-medium text-gray-500">Hora</th>
                                            <th className="py-2 text-left font-medium text-gray-500">Cliente</th>
                                            <th className="py-2 text-left font-medium text-gray-500">Servicios</th>
                                            <th className="py-2 text-right font-medium text-gray-500">Total</th>
                                            <th className="py-2 text-right font-medium text-gray-500">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {citasHoy.map((cita) => (
                                            <tr key={cita.id}>
                                                <td className="py-3 font-medium">{formatHora(cita.hora)}</td>
                                                <td className="py-3">
                                                    {cita.usuario?.nombre} {cita.usuario?.apellido}
                                                </td>
                                                <td className="py-3 text-gray-500">
                                                    {cita.servicios.map((s) => s.nombre).join(', ')}
                                                </td>
                                                <td className="py-3 text-right font-semibold text-rose-600">
                                                    ${cita.total}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${estadoBadge[cita.estado] ?? ''}`}
                                                    >
                                                        {cita.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Dashboard', href: '/admin' },
    ],
};
