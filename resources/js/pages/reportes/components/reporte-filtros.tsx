import * as React from 'react';
import { format } from 'date-fns';
import { FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import type { DateRange } from '@/components/ui/date-range-picker';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { TipoReporte } from '@/types/reportes';

interface Servicio {
    id: number;
    nombre: string;
}

interface ReporteFiltrosProps {
    servicios: Servicio[];
    isDisabled: boolean;
    onSolicitar: (payload: Record<string, unknown>) => void;
}

export function ReporteFiltros({ servicios, isDisabled, onSolicitar }: ReporteFiltrosProps) {
    const [tipo, setTipo]             = React.useState<TipoReporte>('citas');
    const [rango, setRango]           = React.useState<DateRange | undefined>();
    const [estadoCita, setEstadoCita] = React.useState('todos');
    const [servicioId, setServicioId] = React.useState('todos');

    // Reset date range when tipo changes to clientes (no dates)
    React.useEffect(() => {
        if (tipo === 'clientes') setRango(undefined);
    }, [tipo]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const payload: Record<string, unknown> = { tipo };

        if (tipo !== 'clientes') {
            if (rango?.from) payload.fecha_desde = format(rango.from, 'yyyy-MM-dd');
            if (rango?.to)   payload.fecha_hasta = format(rango.to, 'yyyy-MM-dd');
        }
        if (tipo === 'citas' && estadoCita !== 'todos') {
            payload.estado = estadoCita;
        }
        if ((tipo === 'citas' || tipo === 'ingresos') && servicioId !== 'todos') {
            payload.servicio_id = Number(servicioId);
        }

        onSolicitar(payload);
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Tipo */}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="tipo">Tipo de reporte</Label>
                    <Select value={tipo} onValueChange={(v) => setTipo(v as TipoReporte)}>
                        <SelectTrigger id="tipo">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="citas">Citas</SelectItem>
                            <SelectItem value="ingresos">Ingresos</SelectItem>
                            <SelectItem value="clientes">Clientes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Rango de fechas (no para clientes) */}
                {tipo !== 'clientes' && (
                    <div className="flex flex-col gap-1.5">
                        <Label>Rango de fechas</Label>
                        <DateRangePicker
                            value={rango}
                            onValueChange={setRango}
                            placeholder="Seleccionar rango"
                            numberOfMonths={1}
                        />
                    </div>
                )}

                {/* Estado (solo citas) */}
                {tipo === 'citas' && (
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="estado_cita">Estado</Label>
                        <Select value={estadoCita} onValueChange={setEstadoCita}>
                            <SelectTrigger id="estado_cita">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="confirmada">Confirmada</SelectItem>
                                <SelectItem value="completada">Completada</SelectItem>
                                <SelectItem value="cancelada">Cancelada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Servicio (citas e ingresos) */}
                {(tipo === 'citas' || tipo === 'ingresos') && (
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="servicio">Servicio</Label>
                        <Select value={servicioId} onValueChange={setServicioId}>
                            <SelectTrigger id="servicio">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                {servicios.map((s) => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <div>
                <Button type="submit" disabled={isDisabled}>
                    {isDisabled ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <FileText className="mr-2 h-4 w-4" />
                    )}
                    {isDisabled ? 'Generando...' : 'Generar reporte'}
                </Button>
            </div>
        </form>
    );
}
