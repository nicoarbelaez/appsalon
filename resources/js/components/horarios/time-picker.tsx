import * as React from 'react';
import { Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0'),
);
const MINUTES = ['00', '30'];

export interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    invalid?: boolean;
}

export function TimePicker({
    value,
    onChange,
    placeholder = 'Hora',
    invalid,
}: TimePickerProps) {
    const [open, setOpen] = React.useState(false);
    const hourRef = React.useRef<HTMLDivElement>(null);

    const [selHour, selMin] = value ? value.split(':') : ['', ''];

    function pickHour(h: string) {
        onChange(`${h}:${selMin || '00'}`);
    }

    function pickMinute(m: string) {
        onChange(`${selHour || '00'}:${m}`);
        setOpen(false);
    }

    React.useEffect(() => {
        if (!open || !selHour || !hourRef.current) return;
        const btn = hourRef.current.querySelector<HTMLElement>(
            `[data-hour="${selHour}"]`,
        );
        btn?.scrollIntoView({ block: 'center' });
    }, [open, selHour]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={cn(
                        'h-8 w-full justify-start gap-1.5 px-2 text-sm font-normal',
                        !value && 'text-muted-foreground',
                        invalid && 'border-red-500 focus-visible:ring-red-500',
                    )}
                >
                    <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {value || placeholder}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" sideOffset={6} className="w-auto p-0">
                <div className="flex divide-x">
                    {/* Hours column */}
                    <div className="flex flex-col">
                        <p className="border-b px-3 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Hora
                        </p>
                        <div
                            ref={hourRef}
                            className="flex max-h-52 flex-col overflow-y-auto py-1"
                        >
                            {HOURS.map((h) => (
                                <button
                                    key={h}
                                    data-hour={h}
                                    type="button"
                                    onClick={() => pickHour(h)}
                                    className={cn(
                                        'px-4 py-1 text-sm transition-colors hover:bg-accent',
                                        selHour === h &&
                                            'bg-primary text-primary-foreground hover:bg-primary/90',
                                    )}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Minutes column */}
                    <div className="flex flex-col">
                        <p className="border-b px-3 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Min
                        </p>
                        <div className="flex flex-col py-1">
                            {MINUTES.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => pickMinute(m)}
                                    className={cn(
                                        'px-4 py-1 text-sm transition-colors hover:bg-accent',
                                        selMin === m &&
                                            'bg-primary text-primary-foreground hover:bg-primary/90',
                                    )}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
