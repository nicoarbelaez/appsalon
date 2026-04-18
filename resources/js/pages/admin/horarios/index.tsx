import * as React from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { HorarioDayCard } from '@/components/horarios/horario-day-card';
import type { Horario, HorarioTramo } from '@/types/horarios';

// ─── Types ────────────────────────────────────────────────────────────────────

type ValidationErrors = Record<string, string | string[]>;

interface HorarioPayload {
    dia_semana: number;
    activo: boolean;
    tramos: { inicio: string; fin: string }[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DIA_ORDER = [1, 2, 3, 4, 5, 6, 0];

function sortByDiaOrder(list: Horario[]): Horario[] {
    return [...list].sort(
        (a, b) =>
            DIA_ORDER.indexOf(a.dia_semana) - DIA_ORDER.indexOf(b.dia_semana),
    );
}

function serializeHorarios(source: Horario[]): HorarioPayload[] {
    return source.map((h) => ({
        dia_semana: h.dia_semana,
        activo: h.activo,
        tramos: h.tramos.map(({ inicio, fin }) => ({ inicio, fin })),
    }));
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

function flattenErrors(errors: ValidationErrors): string[] {
    return Object.values(errors).flatMap((v) =>
        Array.isArray(v) ? v : [v],
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

    function updateHorario(dia: number, patch: Partial<Horario>) {
        setCardErrors({});
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
        updateHorario(dia, {
            tramos: [...h.tramos, { inicio: last?.fin ?? '09:00', fin: '18:00' }],
        });
    }

    function handleTramoRemove(dia: number, idx: number) {
        const h = horarios.find((item) => item.dia_semana === dia);
        if (!h) return;
        updateHorario(dia, { tramos: h.tramos.filter((_, i) => i !== idx) });
    }

    function handleSave() {
        setSaving(true);
        setCardErrors({});

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
