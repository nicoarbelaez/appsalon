import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type { DateRange };

interface DateRangePickerProps {
    value?: DateRange;
    onValueChange: (range: DateRange | undefined) => void;
    placeholder?: string;
    numberOfMonths?: number;
    className?: string;
}

function formatShort(d: Date) {
    return format(d, 'd MMM yyyy', { locale: es });
}

export function DateRangePicker({
    value,
    onValueChange,
    placeholder = 'Seleccionar rango',
    numberOfMonths = 1,
    className,
}: DateRangePickerProps) {
    const label = value?.from
        ? value.to
            ? `${formatShort(value.from)} — ${formatShort(value.to)}`
            : formatShort(value.from)
        : null;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'h-8 justify-start gap-2 px-3 text-sm font-normal',
                        !label && 'text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
                    {label ?? placeholder}
                    {label && (
                        <span
                            role="button"
                            aria-label="Limpiar rango"
                            className="ml-1 rounded-sm p-0.5 opacity-60 hover:bg-muted hover:opacity-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                onValueChange(undefined);
                            }}
                        >
                            <X className="h-3 w-3" />
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                    mode="range"
                    selected={value}
                    onSelect={onValueChange}
                    numberOfMonths={numberOfMonths}
                    locale={es}
                    classNames={{
                        day_range_start:
                            'rounded-r-none bg-rose-600 text-white hover:bg-rose-700 hover:text-white',
                        day_range_end:
                            'rounded-l-none bg-rose-600 text-white hover:bg-rose-700 hover:text-white',
                        day_range_middle:
                            'rounded-none aria-selected:bg-rose-100 aria-selected:text-rose-900 dark:aria-selected:bg-rose-900/30 dark:aria-selected:text-rose-100',
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
