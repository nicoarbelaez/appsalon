import * as React from 'react';
import { router } from '@inertiajs/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { toast } from 'sonner';
import { EstadoBadge, estadoConfig } from '@/components/citas/estado-badge';
import { getNombreCliente } from '@/components/citas/citas-table';
import { formatFecha, formatHora } from '@/lib/date';
import type { Cita, EstadoCita, Servicio } from '@/types/citas';

interface DetailSheetProps {
    cita: Cita | null;
    serviciosDisponibles: Servicio[];
    mode: 'agenda' | 'mis-citas';
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCancelar?: (id: number) => void;
}

export function DetailSheet({
    cita,
    serviciosDisponibles,
    mode,
    open,
    onOpenChange,
    onCancelar,
}: DetailSheetProps) {
    const [estado, setEstado] = React.useState<EstadoCita>('pendiente');
    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
    const [saving, setSaving] = React.useState(false);
    const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false);
    const [pendingEstado, setPendingEstado] = React.useState<EstadoCita | null>(null);

    React.useEffect(() => {
        if (cita) {
            setEstado(cita.estado);
            setSelectedIds(cita.servicios.map((s) => s.id));
        }
    }, [cita]);

    const isCancelada = cita?.estado === 'cancelada';
    const isReadonly = isCancelada || mode === 'mis-citas';

    const total = React.useMemo(
        () =>
            (isReadonly ? cita?.servicios ?? [] : serviciosDisponibles.filter((s) => selectedIds.includes(s.id)))
                .reduce((sum, s) => sum + parseFloat(s.precio), 0),
        [isReadonly, cita, selectedIds, serviciosDisponibles],
    );

    function toggleServicio(id: number) {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }

    function handleSave() {
        if (!cita) return;
        setSaving(true);
        router.patch(
            `/funcionario/citas/${cita.id}`,
            { estado, servicioIds: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => { setSaving(false); onOpenChange(false); toast.success('Cambios guardados correctamente'); },
                onError: () => { setSaving(false); toast.error('No se pudo guardar los cambios'); },
            },
        );
    }

    function handleCancelar() {
        setCancelConfirmOpen(true);
    }

    function confirmCancelar() {
        if (!cita) return;
        onCancelar?.(cita.id);
        setCancelConfirmOpen(false);
        onOpenChange(false);
    }

    if (!cita) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader className="mb-4">
                    <SheetTitle>Detalle de cita</SheetTitle>
                    <SheetDescription>
                        {formatFecha(cita.fecha)} — {formatHora(cita.hora)}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-5 px-4 pb-4">
                    {/* Cliente */}
                    {mode === 'agenda' && (
                        <>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Cliente
                                </p>
                                <p className="mt-1 font-medium">{getNombreCliente(cita)}</p>
                            </div>
                            <Separator />
                        </>
                    )}

                    {/* Estado */}
                    <div className="flex flex-col gap-2">
                        <Label>Estado</Label>
                        {isReadonly ? (
                            <div>
                                <EstadoBadge estado={cita.estado} />
                            </div>
                        ) : (
                            <Select
                                value={estado}
                                onValueChange={(v) => {
                                    const next = v as EstadoCita;
                                    if (next === 'cancelada') {
                                        setPendingEstado(next);
                                    } else {
                                        setEstado(next);
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {(Object.keys(estadoConfig) as EstadoCita[]).map((e) => (
                                        <SelectItem key={e} value={e}>
                                            {estadoConfig[e].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <Separator />

                    {/* Servicios */}
                    <div className="flex flex-col gap-2">
                        <Label>Servicios</Label>
                        {isReadonly ? (
                            <div className="flex flex-wrap gap-2">
                                {cita.servicios.map((s) => (
                                    <Badge key={s.id} variant="secondary">
                                        {s.nombre}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {serviciosDisponibles.map((s) => (
                                    <label
                                        key={s.id}
                                        className="flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors hover:bg-accent"
                                    >
                                        <Checkbox
                                            checked={selectedIds.includes(s.id)}
                                            onCheckedChange={() => toggleServicio(s.id)}
                                        />
                                        <span className="flex-1 text-sm font-medium">{s.nombre}</span>
                                        <span className="text-sm text-muted-foreground">
                                            ${parseFloat(s.precio).toLocaleString('es-CO')}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex items-center justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="text-lg font-bold text-rose-600">
                            ${total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    {/* Actions */}
                    {!isCancelada && mode === 'agenda' && (
                        <Button
                            className="w-full bg-rose-600 hover:bg-rose-700"
                            onClick={handleSave}
                            disabled={saving || selectedIds.length === 0}
                        >
                            {saving ? 'Guardando…' : 'Guardar cambios'}
                        </Button>
                    )}

                    {!isCancelada && mode === 'mis-citas' && (
                        <Button
                            variant="destructive"
                            className="w-full"
                            disabled={!['pendiente', 'confirmada'].includes(cita.estado)}
                            onClick={handleCancelar}
                        >
                            Cancelar cita
                        </Button>
                    )}
                </div>
            </SheetContent>

            <AlertDialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Cancelar esta cita?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no tiene marcha atrás. La cita quedará cancelada y no podrá recuperarse.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Volver</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={confirmCancelar}>
                            Sí, cancelar cita
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={pendingEstado !== null} onOpenChange={(v) => { if (!v) setPendingEstado(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Cambiar estado a "Cancelada"?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Una vez guardada, la cita quedará cancelada y no podrá editarse de nuevo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingEstado(null)}>Volver</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                if (pendingEstado) setEstado(pendingEstado);
                                setPendingEstado(null);
                            }}
                        >
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Sheet>
    );
}
