import { Head, Link, useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: 'cliente' | 'funcionario' | 'admin';
    confirmado: boolean;
}

const ROLES = [
    { value: 'cliente', label: 'Cliente', desc: 'Puede reservar y ver sus propias citas.' },
    { value: 'funcionario', label: 'Funcionario', desc: 'Puede ver todas las citas del salón.' },
    { value: 'admin', label: 'Administrador', desc: 'Acceso completo al sistema.' },
] as const;

export default function AdminUsuariosEdit({ usuario }: { usuario: Usuario }) {
    const { data, setData, put, processing, errors } = useForm({
        rol: usuario.rol,
        confirmado: usuario.confirmado,
        admin: usuario.rol === 'admin',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/usuarios/${usuario.id}`, {
            onSuccess: () => toast.success('Cambios guardados correctamente'),
            onError: () => toast.error('No se pudieron guardar los cambios'),
        });
    }

    return (
        <>
            <Head title={`Admin — Editar: ${usuario.nombre}`} />

            <div className="mx-auto max-w-md p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Editar usuario
                    </h1>
                    <p className="text-sm text-gray-500">
                        {usuario.nombre} {usuario.apellido} · {usuario.email}
                    </p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="flex flex-col gap-6">
                            {/* Role */}
                            <div className="flex flex-col gap-3">
                                <Label className="text-sm font-medium">Rol del usuario</Label>
                                {errors.rol && <p className="text-xs text-red-500">{errors.rol}</p>}
                                <div className="flex flex-col gap-2">
                                    {ROLES.map((r) => (
                                        <button
                                            key={r.value}
                                            type="button"
                                            onClick={() => setData('rol', r.value)}
                                            className={`rounded-lg border p-3 text-left transition-all ${
                                                data.rol === r.value
                                                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                                                    : 'border-gray-100 hover:border-gray-300 dark:border-gray-800'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {r.label}
                                                </p>
                                                {data.rol === r.value && (
                                                    <span className="text-rose-600">✓</span>
                                                )}
                                            </div>
                                            <p className="mt-0.5 text-xs text-gray-500">{r.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Account confirmed */}
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="confirmado"
                                    checked={data.confirmado}
                                    onCheckedChange={(v) => setData('confirmado', !!v)}
                                />
                                <Label htmlFor="confirmado">Cuenta confirmada / activa</Label>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-rose-600 hover:bg-rose-700"
                                >
                                    {processing ? 'Guardando...' : 'Guardar cambios'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/admin/usuarios">Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminUsuariosEdit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Usuarios', href: '/admin/usuarios' },
        { title: 'Editar', href: '#' },
    ],
};
