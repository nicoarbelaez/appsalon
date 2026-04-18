import { useForm, Head, Link, router } from '@inertiajs/react';
import { Edit, Plus, Trash2, UserCheck, UserX } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';

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
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [deletingUsuario, setDeletingUsuario] = useState<{ id: number; nombre: string } | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        apellido: '',
        email: '',
        rol: 'cliente',
        password: '',
    });

    function handleDelete(id: number, nombre: string) {
        setDeletingUsuario({ id, nombre });
    }

    function confirmDelete() {
        if (!deletingUsuario) return;
        const { id, nombre } = deletingUsuario;
        router.delete(`/admin/usuarios/${id}`, {
            onSuccess: () => toast.success(`Usuario "${nombre}" eliminado`),
            onError: () => toast.error('No se pudo eliminar el usuario'),
        });
        setDeletingUsuario(null);
    }

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/usuarios', {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
                toast.success('Usuario creado correctamente');
            },
            onError: () => toast.error('No se pudo crear el usuario'),
        });
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

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo usuario
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Crear nuevo usuario</DialogTitle>
                                    <DialogDescription>
                                        Ingresa los detalles del nuevo usuario. Se le pedirá cambiar la contraseña en su primer inicio de sesión.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid items-center gap-2">
                                        <Label htmlFor="nombre">Nombre</Label>
                                        <Input
                                            id="nombre"
                                            value={data.nombre}
                                            onChange={(e) => setData('nombre', e.target.value)}
                                            required
                                        />
                                        {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
                                    </div>
                                    <div className="grid items-center gap-2">
                                        <Label htmlFor="apellido">Apellido</Label>
                                        <Input
                                            id="apellido"
                                            value={data.apellido}
                                            onChange={(e) => setData('apellido', e.target.value)}
                                            required
                                        />
                                        {errors.apellido && <p className="text-xs text-red-500">{errors.apellido}</p>}
                                    </div>
                                    <div className="grid items-center gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                    <div className="grid items-center gap-2">
                                        <Label htmlFor="rol">Rol</Label>
                                        <Select
                                            value={data.rol}
                                            onValueChange={(value: any) => setData('rol', value)}
                                        >
                                            <SelectTrigger id="rol">
                                                <SelectValue placeholder="Selecciona un rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cliente">Cliente</SelectItem>
                                                <SelectItem value="funcionario">Funcionario</SelectItem>
                                                <SelectItem value="admin">Administrador</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.rol && <p className="text-xs text-red-500">{errors.rol}</p>}
                                    </div>
                                    <div className="grid items-center gap-2">
                                        <Label htmlFor="password">Contraseña temporal</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            required
                                        />
                                        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>
                                        Crear usuario
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
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

            <AlertDialog open={deletingUsuario !== null} onOpenChange={(v) => { if (!v) setDeletingUsuario(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se eliminará <strong>{deletingUsuario?.nombre}</strong> permanentemente. Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={confirmDelete}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

AdminUsuariosIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Usuarios', href: '/admin/usuarios' },
    ],
};
