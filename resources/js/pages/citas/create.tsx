import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarDays, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';

interface Servicio {
    id: number;
    nombre: string;
    precio: string;
    duracion: number;
}

interface Props {
    servicios: Servicio[];
}

const HORARIOS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

function formatHora(hora: string) {
    const [h, m] = hora.split(':');
    const d = new Date();
    d.setHours(parseInt(h), parseInt(m));
    return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export default function CitasCreate({ servicios }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        fecha: string;
        hora: string;
        servicios: number[];
    }>({
        fecha: '',
        hora: '',
        servicios: [],
    });

    function toggleServicio(id: number) {
        if (data.servicios.includes(id)) {
            setData('servicios', data.servicios.filter((s) => s !== id));
        } else {
            setData('servicios', [...data.servicios, id]);
        }
    }

    const totalSeleccionado = servicios
        .filter((s) => data.servicios.includes(s.id))
        .reduce((acc, s) => acc + parseFloat(s.precio), 0);

    const duracionTotal = servicios
        .filter((s) => data.servicios.includes(s.id))
        .reduce((acc, s) => acc + s.duracion, 0);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/citas');
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <Head title="Reservar cita" />

            <div className="mx-auto max-w-2xl p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reservar cita</h1>
                    <p className="text-sm text-gray-500">
                        Elige los servicios, la fecha y el horario que prefieras.
                    </p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    {/* Services selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">1. Selecciona servicios</CardTitle>
                            <CardDescription>Puedes elegir uno o más servicios.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {errors.servicios && (
                                <p className="mb-3 text-xs text-red-500">{errors.servicios}</p>
                            )}
                            <div className="grid gap-3 sm:grid-cols-2">
                                {servicios.map((s) => {
                                    const selected = data.servicios.includes(s.id);
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => toggleServicio(s.id)}
                                            className={`rounded-lg border p-3 text-left transition-all ${
                                                selected
                                                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                                                    : 'border-gray-100 hover:border-gray-300 dark:border-gray-800'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {s.nombre}
                                                </p>
                                                {selected && (
                                                    <span className="ml-1 text-rose-600">✓</span>
                                                )}
                                            </div>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="text-sm font-semibold text-rose-600">
                                                    ${s.precio}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    • {s.duracion} min
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {data.servicios.length > 0 && (
                                <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Clock className="h-4 w-4" />
                                        <span>Duración total: {duracionTotal} min</span>
                                    </div>
                                    <p className="font-bold text-rose-600">
                                        Total: ${totalSeleccionado.toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Date and time */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">2. Elige fecha y hora</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="fecha">Fecha *</Label>
                                <Input
                                    id="fecha"
                                    type="date"
                                    min={today}
                                    value={data.fecha}
                                    onChange={(e) => setData('fecha', e.target.value)}
                                />
                                {errors.fecha && (
                                    <p className="text-xs text-red-500">{errors.fecha}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label>Hora *</Label>
                                {errors.hora && (
                                    <p className="text-xs text-red-500">{errors.hora}</p>
                                )}
                                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                                    {HORARIOS.map((h) => (
                                        <button
                                            key={h}
                                            type="button"
                                            onClick={() => setData('hora', h)}
                                            className={`rounded-md border py-2 text-xs font-medium transition-all ${
                                                data.hora === h
                                                    ? 'border-rose-500 bg-rose-600 text-white'
                                                    : 'border-gray-100 hover:border-rose-300 dark:border-gray-800'
                                            }`}
                                        >
                                            {formatHora(h)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary */}
                    {data.servicios.length > 0 && data.fecha && data.hora && (
                        <Card className="border-rose-100 bg-rose-50 dark:border-rose-900 dark:bg-rose-900/10">
                            <CardContent className="pt-4">
                                <p className="text-sm font-medium text-rose-700 dark:text-rose-400">
                                    Resumen de tu cita
                                </p>
                                <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                                    <p>
                                        <span className="font-medium">Fecha:</span>{' '}
                                        {new Date(data.fecha + 'T00:00:00').toLocaleDateString('es-CO', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                    <p>
                                        <span className="font-medium">Hora:</span> {formatHora(data.hora)}
                                    </p>
                                    <p>
                                        <span className="font-medium">Total:</span>{' '}
                                        <span className="font-bold text-rose-600">
                                            ${totalSeleccionado.toFixed(2)}
                                        </span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex gap-3">
                        <Button
                            type="submit"
                            disabled={processing || !data.fecha || !data.hora || data.servicios.length === 0}
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
