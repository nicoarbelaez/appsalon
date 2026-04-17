import { Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Servicio {
    id: number;
    nombre: string;
    precio: string;
    descripcion: string | null;
    duracion: number;
    activo: boolean;
}

interface Props {
    servicios: Servicio[];
}

export default function AdminServiciosIndex({ servicios }: Props) {
    function handleDelete(id: number, nombre: string) {
        if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
        router.delete(`/admin/servicios/${id}`);
    }

    return (
        <>
            <Head title="Admin — Servicios" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Servicios</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {servicios.length} servicio(s) registrado(s)
                        </p>
                    </div>
                    <Button asChild className="bg-rose-600 hover:bg-rose-700">
                        <Link href="/admin/servicios/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo servicio
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        {servicios.length === 0 ? (
                            <div className="py-12 text-center">
                                <p className="text-sm text-gray-500">No hay servicios registrados.</p>
                                <Button className="mt-4" asChild>
                                    <Link href="/admin/servicios/create">Crear primer servicio</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-gray-100 dark:border-gray-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left font-medium text-gray-500">Nombre</th>
                                            <th className="px-6 py-3 text-left font-medium text-gray-500">Descripción</th>
                                            <th className="px-6 py-3 text-left font-medium text-gray-500">Duración</th>
                                            <th className="px-6 py-3 text-right font-medium text-gray-500">Precio</th>
                                            <th className="px-6 py-3 text-center font-medium text-gray-500">Estado</th>
                                            <th className="px-6 py-3 text-right font-medium text-gray-500">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                        {servicios.map((s) => (
                                            <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                    {s.nombre}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {s.descripcion ?? '—'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{s.duracion} min</td>
                                                <td className="px-6 py-4 text-right font-semibold text-rose-600">
                                                    ${s.precio}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {s.activo ? (
                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                                            Activo
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">Inactivo</Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button size="sm" variant="outline" asChild>
                                                            <Link href={`/admin/servicios/${s.id}/edit`}>
                                                                <Edit className="h-3.5 w-3.5" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            onClick={() => handleDelete(s.id, s.nombre)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
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

AdminServiciosIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Servicios', href: '/admin/servicios' },
    ],
};
