import { Head, Link, router } from '@inertiajs/react';
import { Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string | null;
    rol: 'cliente' | 'funcionario' | 'admin';
    confirmado: boolean;
    admin: boolean;
}

interface Props {
    usuarios: Usuario[];
}

const rolConfig: Record<string, { label: string; className: string }> = {
    admin: { label: 'Admin', className: 'bg-red-100 text-red-700' },
    funcionario: { label: 'Funcionario', className: 'bg-purple-100 text-purple-700' },
    cliente: { label: 'Cliente', className: 'bg-gray-100 text-gray-600' },
};

export default function AdminUsuariosIndex({ usuarios }: Props) {
    function handleDelete(id: number, nombre: string) {
        if (!confirm(`¿Eliminar usuario "${nombre}"? Esta acción no se puede deshacer.`)) return;
        router.delete(`/admin/usuarios/${id}`);
    }

    return (
        <>
            <Head title="Admin — Usuarios" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Gestión de usuarios
                        </h1>
                        <p className="text-sm text-gray-500">{usuarios.length} usuario(s) registrado(s)</p>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-medium text-gray-500">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left font-medium text-gray-500">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left font-medium text-gray-500">
                                            Teléfono
                                        </th>
                                        <th className="px-6 py-3 text-center font-medium text-gray-500">
                                            Rol
                                        </th>
                                        <th className="px-6 py-3 text-center font-medium text-gray-500">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-right font-medium text-gray-500">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                    {usuarios.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-900"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                                {u.nombre} {u.apellido}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {u.telefono ?? '—'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${rolConfig[u.rol]?.className ?? ''}`}
                                                >
                                                    {rolConfig[u.rol]?.label ?? u.rol}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {u.confirmado ? (
                                                    <span className="flex items-center justify-center gap-1 text-xs text-green-600">
                                                        <UserCheck className="h-3.5 w-3.5" />
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-1 text-xs text-gray-400">
                                                        <UserX className="h-3.5 w-3.5" />
                                                        Pendiente
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button size="sm" variant="outline" asChild>
                                                        <Link href={`/admin/usuarios/${u.id}/edit`}>
                                                            <Edit className="h-3.5 w-3.5" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:bg-red-50"
                                                        onClick={() =>
                                                            handleDelete(u.id, `${u.nombre} ${u.apellido}`)
                                                        }
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
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminUsuariosIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Usuarios', href: '/admin/usuarios' },
    ],
};
