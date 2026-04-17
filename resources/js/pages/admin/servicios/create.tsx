import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminServiciosCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        precio: '',
        descripcion: '',
        duracion: '60',
        activo: true as boolean,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/servicios');
    }

    return (
        <>
            <Head title="Admin — Nuevo servicio" />

            <div className="mx-auto max-w-xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nuevo servicio</h1>
                    <p className="text-sm text-gray-500">Completa el formulario para agregar un servicio.</p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="nombre">Nombre *</Label>
                                <Input
                                    id="nombre"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Ej: Corte de cabello"
                                    maxLength={60}
                                />
                                {errors.nombre && (
                                    <p className="text-xs text-red-500">{errors.nombre}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="precio">Precio (USD) *</Label>
                                    <Input
                                        id="precio"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="99999999.99"
                                        value={data.precio}
                                        onChange={(e) => setData('precio', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {errors.precio && (
                                        <p className="text-xs text-red-500">{errors.precio}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label htmlFor="duracion">Duración (min) *</Label>
                                    <Input
                                        id="duracion"
                                        type="number"
                                        min="15"
                                        max="480"
                                        step="15"
                                        value={data.duracion}
                                        onChange={(e) => setData('duracion', e.target.value)}
                                    />
                                    {errors.duracion && (
                                        <p className="text-xs text-red-500">{errors.duracion}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <textarea
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    rows={3}
                                    maxLength={500}
                                    className="rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Descripción del servicio (opcional)"
                                />
                                {errors.descripcion && (
                                    <p className="text-xs text-red-500">{errors.descripcion}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="activo"
                                    checked={data.activo}
                                    onCheckedChange={(v) => setData('activo', !!v)}
                                />
                                <Label htmlFor="activo">Servicio activo (visible al público)</Label>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-rose-600 hover:bg-rose-700"
                                >
                                    {processing ? 'Guardando...' : 'Crear servicio'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/admin/servicios">Cancelar</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminServiciosCreate.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Servicios', href: '/admin/servicios' },
        { title: 'Nuevo', href: '/admin/servicios/create' },
    ],
};
