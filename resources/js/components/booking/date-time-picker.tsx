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
}

const HORARIOS = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
];

function formatTime(hora: string) {
    const [h, m] = hora.split(':');
    const d = new Date();
    d.setHours(parseInt(h), parseInt(m));
    return d.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function toDateString(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

export function DateTimePicker({
    selectedDate,
    selectedTime,
    ocupados,
    onDateSelect,
    onTimeSelect,
    errors,
}: DateTimePickerProps) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const isOcupado = (hora: string) => {
        if (!selectedDate) return false;
        const dateStr = toDateString(selectedDate);
        return ocupados.some((o) => o.fecha === dateStr && o.hora === hora);
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
                            onSelect={onDateSelect}
                            disabled={{ before: hoy }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.fecha && (
                    <p className="text-xs text-red-500">{errors.fecha}</p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label>Hora *</Label>
                {errors?.hora && (
                    <p className="text-xs text-red-500">{errors.hora}</p>
                )}
                {!selectedDate && (
                    <p className="text-sm font-medium text-gray-400 italic">
                        Selecciona una fecha primero para ver horarios
                    </p>
                )}
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
                                onClick={() => onTimeSelect(h)}
                                className={`rounded-md border py-2 text-xs font-medium transition-all ${
                                    selectedTime === h
                                        ? 'border-rose-500 bg-rose-600 text-white shadow-sm'
                                        : disabled
                                          ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-600'
                                          : 'border-gray-100 hover:border-rose-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900'
                                }`}
                                title={
                                    ocupado
                                        ? 'Ya ocupado'
                                        : pasado
                                          ? 'Hora pasada'
                                          : ''
                                }
                            >
                                {formatTime(h)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
