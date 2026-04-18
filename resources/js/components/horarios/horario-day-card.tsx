import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TramoRow } from '@/components/horarios/tramo-row';
import { cn } from '@/lib/utils';
import type { Horario, HorarioTramo } from '@/types/horarios';

const DIAS = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
];

interface HorarioDayCardProps {
    horario: Horario;
    errors: string[];
    onUpdate: (patch: Partial<Horario>) => void;
    onTramoChange: (idx: number, tramo: HorarioTramo) => void;
    onTramoAdd: () => void;
    onTramoRemove: (idx: number) => void;
}

export function HorarioDayCard({
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
