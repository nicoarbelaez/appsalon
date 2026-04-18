import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TimePicker } from '@/components/horarios/time-picker';
import type { HorarioTramo } from '@/types/horarios';

interface TramoRowProps {
    tramo: HorarioTramo;
    onChange: (t: HorarioTramo) => void;
    onRemove: () => void;
    canRemove: boolean;
}

export function TramoRow({ tramo, onChange, onRemove, canRemove }: TramoRowProps) {
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
