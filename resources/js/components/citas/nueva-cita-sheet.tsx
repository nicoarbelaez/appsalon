import * as React from 'react';
import { router } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { DateTimePicker } from '@/components/booking/date-time-picker';
import { ServiceSelector } from '@/components/booking/service-selector';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { toDateString } from '@/lib/date';
import type { BusySlot, Servicio, Usuario } from '@/types/citas';

// ─── User Combobox ────────────────────────────────────────────────────────────

interface UserComboboxProps {
    usuarios: Usuario[];
    value: number | null;
    onChange: (id: number | null) => void;
}

function UserCombobox({ usuarios, value, onChange }: UserComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const selected = usuarios.find((u) => u.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                >
                    {selected ? `${selected.nombre} ${selected.apellido}` : 'Buscar cliente…'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
                <Command>
                    <CommandInput placeholder="Nombre o teléfono…" />
                    <CommandList>
                        <CommandEmpty>Sin resultados.</CommandEmpty>
                        <CommandGroup>
                            {value !== null && (
                                <CommandItem
                                    value="__clear__"
                                    onSelect={() => { onChange(null); setOpen(false); }}
                                    className="text-muted-foreground"
                                >
                                    Limpiar selección
                                </CommandItem>
                            )}
                            {usuarios.map((u) => (
                                <CommandItem
                                    key={u.id}
                                    value={`${u.nombre} ${u.apellido} ${u.telefono ?? ''}`}
                                    onSelect={() => { onChange(u.id); setOpen(false); }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', value === u.id ? 'opacity-100' : 'opacity-0')} />
                                    <span className="font-medium">{u.nombre} {u.apellido}</span>
                                    {u.telefono && (
                                        <span className="ml-2 text-xs text-muted-foreground">{u.telefono}</span>
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

// ─── Sheet ────────────────────────────────────────────────────────────────────

interface NuevaCitaSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'agenda' | 'mis-citas';
    servicios: Servicio[];
    ocupados: BusySlot[];
    usuarios?: Usuario[];
}

export function NuevaCitaSheet({
    open,
    onOpenChange,
    mode,
    servicios,
    ocupados,
    usuarios = [],
}: NuevaCitaSheetProps) {
    const [selectedUsuarioId, setSelectedUsuarioId] = React.useState<number | null>(null);
    const [nombreInvitado, setNombreInvitado] = React.useState('');
    const [selectedServicioIds, setSelectedServicioIds] = React.useState<number[]>([]);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = React.useState('');
    const [saving, setSaving] = React.useState(false);
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    function reset() {
        setSelectedUsuarioId(null);
        setNombreInvitado('');
        setSelectedServicioIds([]);
        setSelectedDate(undefined);
        setSelectedTime('');
        setSaving(false);
        setErrors({});
    }

    function handleOpenChange(v: boolean) {
        if (!v) reset();
        onOpenChange(v);
    }

    function handleSubmit() {
        const errs: Record<string, string> = {};
        if (!selectedDate) errs.fecha = 'Selecciona una fecha.';
        if (!selectedTime) errs.hora = 'Selecciona una hora.';
        if (selectedServicioIds.length === 0) errs.servicios = 'Selecciona al menos un servicio.';
        if (mode === 'agenda' && selectedUsuarioId === null && !nombreInvitado.trim()) {
            errs.cliente = 'Selecciona un cliente o ingresa un nombre.';
        }
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSaving(true);
        const url = mode === 'agenda' ? '/funcionario/citas' : '/citas';
        const body =
            mode === 'agenda'
                ? {
                      fecha: toDateString(selectedDate!),
                      hora: selectedTime,
                      servicios: selectedServicioIds,
                      usuarioId: selectedUsuarioId,
                      nombre_invitado: selectedUsuarioId ? null : nombreInvitado.trim(),
                  }
                : {
                      fecha: toDateString(selectedDate!),
                      hora: selectedTime,
                      servicios: selectedServicioIds,
                  };

        router.post(url, body, {
            preserveScroll: true,
            onSuccess: () => { setSaving(false); handleOpenChange(false); },
            onError: (e) => { setSaving(false); setErrors(e as Record<string, string>); },
        });
    }

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-md">
                <SheetHeader className="mb-4">
                    <SheetTitle>Nueva cita</SheetTitle>
                    <SheetDescription>
                        {mode === 'agenda'
                            ? 'Registra una cita para un cliente.'
                            : 'Reserva una cita a tu nombre.'}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-5 px-4 pb-4">
                    {/* Cliente — solo agenda */}
                    {mode === 'agenda' && (
                        <>
                            <div className="flex flex-col gap-2">
                                <Label>Cliente existente</Label>
                                <UserCombobox
                                    usuarios={usuarios}
                                    value={selectedUsuarioId}
                                    onChange={setSelectedUsuarioId}
                                />
                            </div>

                            {selectedUsuarioId === null && (
                                <div className="flex flex-col gap-2">
                                    <Label>
                                        Nombre invitado{' '}
                                        <span className="text-xs font-normal text-muted-foreground">
                                            (sin cuenta)
                                        </span>
                                    </Label>
                                    <Input
                                        placeholder="Nombre completo"
                                        value={nombreInvitado}
                                        onChange={(e) => setNombreInvitado(e.target.value)}
                                    />
                                    {errors.cliente && (
                                        <p className="text-xs text-red-500">{errors.cliente}</p>
                                    )}
                                </div>
                            )}

                            <Separator />
                        </>
                    )}

                    {/* Fecha + Hora */}
                    <DateTimePicker
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        ocupados={ocupados}
                        onDateSelect={(d) => { setSelectedDate(d); setSelectedTime(''); }}
                        onTimeSelect={setSelectedTime}
                        errors={{ fecha: errors.fecha, hora: errors.hora }}
                        preserveState
                    />

                    <Separator />

                    {/* Servicios */}
                    <div className="flex flex-col gap-2">
                        <Label>Servicios</Label>
                        <ServiceSelector
                            servicios={servicios}
                            selectedIds={selectedServicioIds}
                            onToggle={(id) =>
                                setSelectedServicioIds((prev) =>
                                    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                                )
                            }
                            error={errors.servicios}
                        />
                    </div>

                    <Separator />

                    <Button
                        className="w-full bg-rose-600 hover:bg-rose-700"
                        onClick={handleSubmit}
                        disabled={saving}
                    >
                        {saving ? 'Guardando…' : 'Reservar cita'}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
