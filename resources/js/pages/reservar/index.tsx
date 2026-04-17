import * as React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { CalendarIcon, Clock, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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

function toDateString(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export default function ReservarIndex({ servicios, ocupados }: Props) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        email: '',
        telefono: '',
        fecha: '',
        hora: '',
        servicios: [] as number[],
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

    const isOcupado = (hora: string) => {
        if (!data.fecha) return false;
        return ocupados.some((o) => o.fecha === data.fecha && o.hora === hora);
    };

    const isPasado = (hora: string) => {
        if (!selectedDate) return false;
        const hoy = new Date();
        if (toDateString(selectedDate) !== toDateString(hoy)) return false;
        const [h, m] = hora.split(':');
        const horaCita = new Date();
        horaCita.setHours(parseInt(h), parseInt(m), 0, 0);
        return horaCita < hoy;
    };

    const serviciosSeleccionados = servicios.filter((s) => data.servicios.includes(s.id));
    const total = serviciosSeleccionados.reduce((acc, s) => acc + parseFloat(s.precio), 0);
    const duracion = serviciosSeleccionados.reduce((acc, s) => acc + s.duracion, 0);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/reservar');
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

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
                    <a href="/login" className="text-sm text-gray-500 hover:text-rose-600">
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
                        Sin necesidad de crear una cuenta. Recibirás un código de seguimiento.
                    </p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    {/* Contact info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">1. Tus datos de contacto</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="nombre">Nombre completo *</Label>
                                <Input
                                    id="nombre"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="María García"
                                />
                                {errors.nombre && <p className="text-xs text-red-500">{errors.nombre}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="telefono">Teléfono *</Label>
                                <Input
                                    id="telefono"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    placeholder="3001234567"
                                    maxLength={20}
                                />
                                {errors.telefono && (
                                    <p className="text-xs text-red-500">{errors.telefono}</p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                                <Label htmlFor="email">Correo electrónico *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">2. Selecciona servicios</CardTitle>
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
                                                <p className="text-sm font-medium">{s.nombre}</p>
                                                {selected && <span className="text-rose-600">✓</span>}
                                            </div>
                                            {s.descripcion && (
                                                <p className="mt-0.5 text-xs text-gray-400">
                                                    {s.descripcion}
                                                </p>
                                            )}
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="text-sm font-bold text-rose-600">
                                                    ${s.precio}
                                                </span>
                                                <span className="text-xs text-gray-400">• {s.duracion} min</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {data.servicios.length > 0 && (
                                <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="h-4 w-4" />
                                        Duración: {duracion} min
                                    </div>
                                    <p className="font-bold text-rose-600">Total: ${total.toFixed(2)}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Date & Time */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">3. Elige fecha y hora</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label>Fecha *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !selectedDate && 'text-muted-foreground',
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate
                                                ? selectedDate.toLocaleDateString('es-CO', {
                                                      weekday: 'long',
                                                      year: 'numeric',
                                                      month: 'long',
                                                      day: 'numeric',
                                                  })
                                                : 'Selecciona una fecha'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={handleDaySelect}
                                            disabled={{ before: hoy }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.fecha && <p className="text-xs text-red-500">{errors.fecha}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <Label>Hora *</Label>
                                {errors.hora && <p className="text-xs text-red-500">{errors.hora}</p>}
                                {!selectedDate && <p className="text-sm text-gray-400 italic">Selecciona una fecha primero para ver horarios</p>}
                                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                                    {HORARIOS.map((h) => {
                                        const ocupado = isOcupado(h);
                                        const pasado = isPasado(h);
                                        const disabled = ocupado || pasado || !selectedDate;

                                        return (
                                            <button
                                                key={h}
                                                type="button"
                                                disabled={disabled}
                                                onClick={() => setData('hora', h)}
                                                className={`rounded-md border py-2 text-xs font-medium transition-all ${
                                                    data.hora === h
                                                        ? 'border-rose-500 bg-rose-600 text-white'
                                                        : disabled
                                                        ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-600'
                                                        : 'border-gray-100 hover:border-rose-300 dark:border-gray-800'
                                                }`}
                                                title={ocupado ? 'Ya ocupado' : pasado ? 'Hora pasada' : ''}
                                            >
                                                {formatHora(h)}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
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
                        {processing ? 'Reservando...' : 'Confirmar reserva gratuita'}
                    </Button>
                </form>
            </main>
        </>
    );
}
