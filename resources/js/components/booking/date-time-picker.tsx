import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { toDateString } from '@/lib/date';

interface BusySlot {
    fecha: string;
    hora: string;
}

interface DateTimePickerProps {
    selectedDate: Date | undefined;
    selectedTime: string;
    ocupados: BusySlot[];
    onDateSelect: (date: Date | undefined) => void;
    onTimeSelect: (time: string) => void;
    errors?: {
        fecha?: string;
        hora?: string;
    };
    preserveState?: boolean;
}

const HORARIOS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

function formatTime(hora: string) {
    const [h, m] = hora.split(':');
    const d = new Date();
    d.setHours(parseInt(h), parseInt(m));
    return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export function DateTimePicker({
    selectedDate,
    selectedTime,
    ocupados,
    onDateSelect,
    onTimeSelect,
    errors,
    preserveState = false,
}: DateTimePickerProps) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const handleDateChange = (date: Date | undefined) => {
        onDateSelect(date);
        if (date) {
            if (preserveState) {
                router.get(window.location.href, {}, { preserveState: true, only: ['ocupados'] });
            } else {
                router.reload({ only: ['ocupados'] });
            }
        }
    };

    const isOcupado = (hora: string) => {
        if (!selectedDate) return false;
        const dateStr = toDateString(selectedDate);
        return ocupados.some((o) => o.fecha.slice(0, 10) === dateStr && o.hora === hora);
    };

    const isPasado = (hora: string) => {
        if (!selectedDate) return false;
        const now = new Date();
        if (toDateString(selectedDate) !== toDateString(now)) return false;
        const [h, m] = hora.split(':');
        const horaCita = new Date();
        horaCita.setHours(parseInt(h), parseInt(m), 0, 0);
        return horaCita < now;
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
                <Label>Fecha *</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full justify-start text-left font-normal transition-colors hover:border-rose-200',
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
                            onSelect={handleDateChange}
                            disabled={{ before: hoy }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.fecha && <p className="text-xs text-red-500">{errors.fecha}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label>Hora *</Label>
                {errors?.hora && <p className="text-xs text-red-500">{errors.hora}</p>}
                {!selectedDate && (
                    <p className="text-sm font-medium text-gray-400 italic">
                        Selecciona una fecha primero para ver horarios
                    </p>
                )}
                <div className="grid gap-2 [grid-template-columns:repeat(auto-fill,minmax(4.5rem,1fr))]">
                    {HORARIOS.map((h) => {
                        const ocupado = isOcupado(h);
                        const pasado = isPasado(h);
                        const selected = selectedTime === h;

                        let stateStyles =
                            'border-gray-100 hover:border-rose-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900';
                        let textColor = 'text-gray-900 dark:text-gray-100';
                        let disabled = !selectedDate;

                        if (selected) {
                            stateStyles = 'border-rose-500 bg-rose-600 shadow-md';
                            textColor = 'text-white';
                        } else if (ocupado) {
                            stateStyles =
                                'border-rose-100 bg-rose-50/50 cursor-not-allowed dark:border-rose-900/30 dark:bg-rose-900/10';
                            textColor = 'text-rose-300 dark:text-rose-800';
                            disabled = true;
                        } else if (pasado) {
                            stateStyles =
                                'border-gray-50 bg-gray-50/30 cursor-not-allowed opacity-50 dark:border-gray-900 dark:bg-gray-900/40';
                            textColor = 'text-gray-300 dark:text-gray-700';
                            disabled = true;
                        }

                        return (
                            <button
                                key={h}
                                type="button"
                                disabled={disabled}
                                onClick={() => onTimeSelect(h)}
                                className={cn(
                                    'relative rounded-md border py-2 text-xs font-semibold transition-all duration-200',
                                    stateStyles,
                                    textColor,
                                    pasado && 'line-through',
                                )}
                                title={ocupado ? 'Ocupado' : pasado ? 'Ya pasó esta hora' : ''}
                            >
                                {formatTime(h)}
                                {ocupado && (
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
