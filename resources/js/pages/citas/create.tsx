import * as React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { ServiceSelector } from '@/components/booking/service-selector';
import { DateTimePicker } from '@/components/booking/date-time-picker';

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

function toDateString(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export default function CitasCreate({ servicios, ocupados }: Props) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
        undefined,
    );

    const { data, setData, post, processing, errors } = useForm<{
        fecha: string;
        hora: string;
        servicios: number[];
    }>({
        fecha: '',
        hora: '',
        servicios: [],
    });

    function handleDaySelect(day: Date | undefined) {
        setSelectedDate(day);
        setData('fecha', day ? toDateString(day) : '');
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
        post('/citas');
    }

    return (
        <>
            <Head title="Reservar cita" />

            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Reservar cita
                    </h1>
                    <p className="text-sm text-gray-500">
                        Elige los servicios, la fecha y el horario que
                        prefieras.
                    </p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    {/* Services */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                1. Selecciona servicios
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

                    {/* Date & Time */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                2. Elige fecha y hora
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DateTimePicker
                                selectedDate={selectedDate}
                                selectedTime={data.hora}
                                ocupados={ocupados}
                                onDateSelect={handleDaySelect}
                                onTimeSelect={(h) => setData('hora', h)}
                                errors={{
                                    fecha: errors.fecha,
                                    hora: errors.hora,
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    {data.servicios.length > 0 && data.fecha && data.hora && (
                        <Card className="border-rose-100 bg-rose-50 dark:border-rose-900 dark:bg-rose-900/10">
                            <CardContent className="pt-4 text-sm">
                                <p className="mb-2 font-semibold text-rose-700 dark:text-rose-400">
                                    Resumen de tu cita
                                </p>
                                <div className="space-y-1 text-gray-600 dark:text-gray-300">
                                    <p>
                                        <span className="font-medium">
                                            Fecha:
                                        </span>{' '}
                                        {selectedDate?.toLocaleDateString(
                                            'es-CO',
                                            {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            },
                                        )}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Hora:
                                        </span>{' '}
                                        {data.hora}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={
                                processing ||
                                !data.fecha ||
                                !data.hora ||
                                data.servicios.length === 0
                            }
                            className="bg-rose-600 hover:bg-rose-700"
                        >
                            {processing ? 'Reservando...' : 'Confirmar reserva'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/citas">Cancelar</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CitasCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Mis citas', href: '/citas' },
        { title: 'Nueva cita', href: '/citas/create' },
    ],
};
