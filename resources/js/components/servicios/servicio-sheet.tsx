import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type { Servicio } from '@/types/servicios';

interface ServicioSheetProps {
    mode: 'create' | 'edit';
    servicio?: Servicio;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ServicioSheet({ mode, servicio, open, onOpenChange }: ServicioSheetProps) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nombre: '',
        precio: '',
        descripcion: '',
        duracion: 30,
        activo: true,
    });

    React.useEffect(() => {
        if (mode === 'edit' && servicio) {
            setData({
                nombre: servicio.nombre,
                precio: servicio.precio,
                descripcion: servicio.descripcion ?? '',
                duracion: servicio.duracion,
                activo: servicio.activo,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [mode, servicio?.id]);

    function handleOpenChange(v: boolean) {
        if (!v) { reset(); clearErrors(); }
        onOpenChange(v);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (mode === 'create') {
            post('/admin/servicios', {
                preserveScroll: true,
                onSuccess: () => handleOpenChange(false),
            });
        } else {
            put(`/admin/servicios/${servicio!.id}`, {
                preserveScroll: true,
                onSuccess: () => handleOpenChange(false),
            });
        }
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader className="mb-4">
                    <SheetTitle>{mode === 'create' ? 'Nuevo servicio' : 'Editar servicio'}</SheetTitle>
                    <SheetDescription>
                        {mode === 'create'
                            ? 'Completa los datos para crear un servicio.'
                            : 'Modifica los datos del servicio.'}
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 pb-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="nombre">Nombre *</Label>
                        <Input
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            placeholder="Corte de cabello"
                        />
                        {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-1 flex-col gap-1.5">
                            <Label htmlFor="precio">Precio *</Label>
                            <Input
                                id="precio"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.precio}
                                onChange={(e) => setData('precio', e.target.value)}
                                placeholder="25.00"
                            />
                            {errors.precio && <p className="text-xs text-red-500">{errors.precio}</p>}
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5">
                            <Label htmlFor="duracion">Duración (min) *</Label>
                            <Input
                                id="duracion"
                                type="number"
                                min="15"
                                max="480"
                                value={data.duracion}
                                onChange={(e) => setData('duracion', parseInt(e.target.value))}
                                placeholder="30"
                            />
                            {errors.duracion && <p className="text-xs text-red-500">{errors.duracion}</p>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <textarea
                            id="descripcion"
                            rows={3}
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            placeholder="Descripción opcional…"
                        />
                        {errors.descripcion && <p className="text-xs text-red-500">{errors.descripcion}</p>}
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="activo"
                            checked={data.activo}
                            onCheckedChange={(v) => setData('activo', !!v)}
                        />
                        <Label htmlFor="activo" className="cursor-pointer">Servicio activo</Label>
                    </div>

                    <Separator />

                    <Button
                        type="submit"
                        className="w-full bg-rose-600 hover:bg-rose-700"
                        disabled={processing}
                    >
                        {processing ? 'Guardando…' : mode === 'create' ? 'Crear servicio' : 'Guardar cambios'}
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}
