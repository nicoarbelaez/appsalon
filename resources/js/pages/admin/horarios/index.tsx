import * as React from 'react';
import { Head, router } from '@inertiajs/react';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { Horario, HorarioTramo } from '@/types/horarios';

// ─── Constants ────────────────────────────────────────────────────────────────

const DIAS = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
];

const DIA_ORDER = [1, 2, 3, 4, 5, 6, 0];

const HOURS = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, '0'),
);
const MINUTES = ['00', '30'];

// ─── Types ────────────────────────────────────────────────────────────────────

type ValidationErrors = Record<string, string | string[]>;

interface HorarioPayload {
    dia_semana: number;
    activo: boolean;
    tramos: { inicio: string; fin: string }[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function flattenErrors(errors: ValidationErrors): string[] {
    return Object.values(errors).flatMap((v) =>
        Array.isArray(v) ? v : [v],
    );
}

function buildCardErrors(
    errors: ValidationErrors,
    snapshot: Horario[],
): Record<number, string[]> {
    const grouped: Record<number, string[]> = {};
    Object.entries(errors).forEach(([key, value]) => {
        const match = key.match(/^horarios\.(\d+)(?:\.|$)/);
        if (!match) return;
        const idx = Number(match[1]);
        const dia = snapshot[idx]?.dia_semana;
        if (dia === undefined) return;
        const message = Array.isArray(value) ? value[0] : value;
        if (!grouped[dia]) grouped[dia] = [];
        grouped[dia].push(message);
    });
    return grouped;
}

function serializeHorarios(source: Horario[]): HorarioPayload[] {
    return source.map((h) => ({
        dia_semana: h.dia_semana,
        activo: h.activo,
        tramos: h.tramos.map(({ inicio, fin }) => ({ inicio, fin })),
    }));
}

function sortByDiaOrder(list: Horario[]): Horario[] {
    return [...list].sort(
        (a, b) =>
            DIA_ORDER.indexOf(a.dia_semana) - DIA_ORDER.indexOf(b.dia_semana),
    );
}

// ─── TimePicker ───────────────────────────────────────────────────────────────

interface TimePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    invalid?: boolean;
}

function TimePicker({
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

    // Scroll the selected hour into view when popover opens
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

            <PopoverContent
                align="start"
                sideOffset={6}
                className="w-auto p-0"
            >
                <div className="flex divide-x">
                    {/* Hours */}
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

                    {/* Minutes */}
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

// ─── TramoRow ─────────────────────────────────────────────────────────────────

interface TramoRowProps {
    tramo: HorarioTramo;
    onChange: (t: HorarioTramo) => void;
    onRemove: () => void;
    canRemove: boolean;
}

function TramoRow({ tramo, onChange, onRemove, canRemove }: TramoRowProps) {
    return (
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:hidden">
                    Desde
                </p>
                <TimePicker
                    value={tramo.inicio}
                    onChange={(v) => onChange({ ...tramo, inicio: v })}
                    placeholder="Inicio"
                />
            </div>

            <span className="hidden justify-self-center text-sm text-muted-foreground sm:block">
                —
            </span>

            <div className="min-w-0">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground sm:hidden">
                    Hasta
                </p>
                <TimePicker
                    value={tramo.fin}
                    onChange={(v) => onChange({ ...tramo, fin: v })}
                    placeholder="Fin"
                />
            </div>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                disabled={!canRemove}
                title={
                    canRemove
                        ? 'Eliminar tramo'
                        : 'Debe existir al menos un tramo'
                }
                className="h-8 w-8 shrink-0 justify-self-end self-end text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 sm:self-auto"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}

// ─── HorarioDayCard ───────────────────────────────────────────────────────────

interface HorarioDayCardProps {
    horario: Horario;
    errors: string[];
    onUpdate: (patch: Partial<Horario>) => void;
    onTramoChange: (idx: number, tramo: HorarioTramo) => void;
    onTramoAdd: () => void;
    onTramoRemove: (idx: number) => void;
}

function HorarioDayCard({
    horario: h,
    errors,
    onUpdate,
    onTramoChange,
    onTramoAdd,
    onTramoRemove,
}: HorarioDayCardProps) {
    return (
        <Card className={cn('flex flex-col', !h.activo && 'opacity-60')}>
            <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <CardTitle className="min-w-0 text-base">
                        {DIAS[h.dia_semana]}
                    </CardTitle>

                    <div className="flex shrink-0 items-center gap-2">
                        <Label
                            htmlFor={`activo-${h.dia_semana}`}
                            className="text-xs text-muted-foreground"
                        >
                            {h.activo ? 'Abierto' : 'Cerrado'}
                        </Label>
                        <Switch
                            id={`activo-${h.dia_semana}`}
                            checked={h.activo}
                            onCheckedChange={(v) =>
                                onUpdate({
                                    activo: v,
                                    tramos:
                                        v && h.tramos.length === 0
                                            ? [{ inicio: '09:00', fin: '18:00' }]
                                            : h.tramos,
                                })
                            }
                        />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex min-w-0 flex-col gap-3">
                {errors.length > 0 && (
                    <div
                        className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                        aria-live="polite"
                    >
                        <p className="mb-1 font-medium">Revisa este día</p>
                        <ul className="list-disc space-y-1 pl-4">
                            {errors.map((err, idx) => (
                                <li key={`${h.dia_semana}-${idx}`}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {!h.activo ? (
                    <p className="text-sm italic text-muted-foreground">
                        Día no laborable
                    </p>
                ) : (
                    <>
                        <div className="flex min-w-0 flex-col gap-2">
                            {h.tramos.map((tramo, idx) => (
                                <TramoRow
                                    key={`${h.dia_semana}-${idx}`}
                                    tramo={tramo}
                                    onChange={(t) => onTramoChange(idx, t)}
                                    onRemove={() => onTramoRemove(idx)}
                                    canRemove={h.tramos.length > 1}
                                />
                            ))}
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onTramoAdd}
                            className="mt-1 h-8 justify-start gap-1.5 px-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Agregar tramo
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface Props {
    horarios: Horario[];
}

export default function AdminHorariosIndex({ horarios: initialHorarios }: Props) {
    const [horarios, setHorarios] = React.useState<Horario[]>(() =>
        sortByDiaOrder(initialHorarios),
    );
    const [saving, setSaving] = React.useState(false);
    const [cardErrors, setCardErrors] = React.useState<Record<number, string[]>>({});

    function clearErrors() {
        setCardErrors({});
    }

    function updateHorario(dia: number, patch: Partial<Horario>) {
        clearErrors();
        setHorarios((prev) =>
            prev.map((h) => (h.dia_semana === dia ? { ...h, ...patch } : h)),
        );
    }

    function handleTramoChange(dia: number, idx: number, tramo: HorarioTramo) {
        const h = horarios.find((item) => item.dia_semana === dia);
        if (!h) return;
        updateHorario(dia, {
            tramos: h.tramos.map((t, i) => (i === idx ? tramo : t)),
        });
    }

    function handleTramoAdd(dia: number) {
        const h = horarios.find((item) => item.dia_semana === dia);
        if (!h) return;
        const last = h.tramos[h.tramos.length - 1];
        const nuevoInicio = last ? last.fin : '09:00';
        updateHorario(dia, {
            tramos: [...h.tramos, { inicio: nuevoInicio, fin: '18:00' }],
        });
    }

    function handleTramoRemove(dia: number, idx: number) {
        const h = horarios.find((item) => item.dia_semana === dia);
        if (!h) return;
        updateHorario(dia, { tramos: h.tramos.filter((_, i) => i !== idx) });
    }

    function handleSave() {
        setSaving(true);
        clearErrors();

        router.put(
            '/admin/horarios',
            { horarios: serializeHorarios(horarios) } as any,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCardErrors({});
                    toast.success('Horarios actualizados correctamente');
                },
                onError: (errors: ValidationErrors) => {
                    setCardErrors(buildCardErrors(errors, horarios));
                    const messages = flattenErrors(errors);
                    toast.error('No se pudieron guardar los horarios', {
                        description:
                            messages.slice(0, 3).join(' · ') ||
                            'Revisa los campos marcados en rojo.',
                    });
                },
                onFinish: () => setSaving(false),
            },
        );
    }

    return (
        <>
            <Head title="Admin — Horarios de atención" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Horarios de atención
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Define qué días trabaja el salón y en qué horarios.
                        </p>
                    </div>

                    <Button
                        className="self-start bg-rose-600 hover:bg-rose-700 sm:self-auto"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Guardando…' : 'Guardar cambios'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {horarios.map((h) => (
                        <HorarioDayCard
                            key={h.dia_semana}
                            horario={h}
                            errors={cardErrors[h.dia_semana] ?? []}
                            onUpdate={(patch) =>
                                updateHorario(h.dia_semana, patch)
                            }
                            onTramoChange={(idx, tramo) =>
                                handleTramoChange(h.dia_semana, idx, tramo)
                            }
                            onTramoAdd={() => handleTramoAdd(h.dia_semana)}
                            onTramoRemove={(idx) =>
                                handleTramoRemove(h.dia_semana, idx)
                            }
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

AdminHorariosIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Horarios', href: '/admin/horarios' },
    ],
};
