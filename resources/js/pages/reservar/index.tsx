import * as React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ServiceSelector } from '@/components/booking/service-selector';
import { DateTimePicker } from '@/components/booking/date-time-picker';
import { toDateString } from '@/lib/date';

interface Servicio {
    id: number;
    nombre: string;
    precio: string;
    duracion: number;
    descripcion: string | null;
}

interface Props {
    servicios: Servicio[];
    ocupados: { fecha: string; hora: string }[];
}



export default function ReservarIndex({ servicios, ocupados }: Props) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        undefined,
    );

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        email: '',
        telefono: '',
        fecha: '',
        hora: '',
        servicios: [] as number[],
    });

    function handleDaySelect(day: Date | undefined) {
        console.log('[index.tsx] day: ', day); // TODO: Remove
        console.log('[index.tsx] BEFORE handleDaySelect (fecha): ', data.fecha); // TODO: Remove
        console.log('[index.tsx] BEFORE handleDaySelect (hora): ', data.hora); // TODO: Remove
        setSelectedDate(day);
        setData('fecha', day ? toDateString(day) : '');
        console.log("=========")
        console.log('[index.tsx] selectedDate: ', selectedDate); // TODO: Remove
        console.log('[index.tsx] AFTER handleDaySelect (fecha): ', data.fecha); // TODO: Remove
        console.log('[index.tsx] AFTER handleDaySelect (hora): ', data.hora); // TODO: Remove
    }

    function toggleServicio(id: number) {
        setData(
            'servicios',
            data.servicios.includes(id)
                ? data.servicios.filter((s) => s !== id)
                : [...data.servicios, id],
        );
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/reservar');
    }

    return (
        <>
            <Head title="Reservar cita — AppSalon" />

            {/* Minimal header */}
            <header className="border-b border-gray-100 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <a href="/" className="flex items-center gap-2">
                        <Scissors className="h-5 w-5 text-rose-600" />
                        <span className="font-bold text-gray-900 dark:text-white">
                            App<span className="text-rose-600">Salon</span>
                        </span>
                    </a>
                    <a
                        href="/login"
                        className="text-sm text-gray-500 hover:text-rose-600"
                    >
                        Ya tengo cuenta
                    </a>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-6 py-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Reserva tu cita
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Sin necesidad de crear una cuenta. Recibirás un código
                        de seguimiento.
                    </p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    {/* Contact info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                1. Tus datos de contacto
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="nombre">
                                    Nombre completo *
                                </Label>
                                <Input
                                    id="nombre"
                                    value={data.nombre}
                                    onChange={(e) =>
                                        setData('nombre', e.target.value)
                                    }
                                    placeholder="María García"
                                />
                                {errors.nombre && (
                                    <p className="text-xs text-red-500">
                                        {errors.nombre}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="telefono">Teléfono *</Label>
                                <Input
                                    id="telefono"
                                    value={data.telefono}
                                    onChange={(e) =>
                                        setData('telefono', e.target.value)
                                    }
                                    placeholder="3001234567"
                                    maxLength={20}
                                />
                                {errors.telefono && (
                                    <p className="text-xs text-red-500">
                                        {errors.telefono}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <Label htmlFor="email">
                                    Correo electrónico *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="correo@ejemplo.com"
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                2. Selecciona servicios
                            </CardTitle>
                            <CardDescription>
                                Puedes elegir uno o más servicios.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ServiceSelector
                                servicios={servicios}
                                selectedIds={data.servicios}
                                onToggle={toggleServicio}
                                error={errors.servicios}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                3. Elige fecha y hora
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DateTimePicker
                                selectedDate={selectedDate}
                                selectedTime={data.hora}
                                ocupados={ocupados}
                                onDateSelect={handleDaySelect}
                                onTimeSelect={(h) => {
                                    console.log(
                                        '[index.tsx] onTimeSelect (hora): ',
                                        h,
                                    ); // TODO: Remove
                                    return setData('hora', h);
                                }}
                                errors={{
                                    fecha: errors.fecha,
                                    hora: errors.hora,
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        size="lg"
                        disabled={
                            processing ||
                            !data.nombre ||
                            !data.email ||
                            !data.telefono ||
                            !data.fecha ||
                            !data.hora ||
                            data.servicios.length === 0
                        }
                        className="w-full bg-rose-600 hover:bg-rose-700"
                    >
                        {processing
                            ? 'Reservando...'
                            : 'Confirmar reserva gratuita'}
                    </Button>
                </form>
            </main>
        </>
    );
}
