import { CalendarDays } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { EstadoBadge } from '@/components/citas/estado-badge';
import { getNombreCliente } from '@/components/citas/citas-table';
import { formatHora } from '@/lib/date';
import type { Cita } from '@/types/citas';

interface CitasHoyTableProps {
    citas: Cita[];
    onRowClick?: (cita: Cita) => void;
}

export function CitasHoyTable({ citas, onRowClick }: CitasHoyTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Citas de hoy</CardTitle>
                <CardDescription>
                    {citas.length === 0
                        ? 'No hay citas programadas para hoy.'
                        : `${citas.length} cita(s) programada(s)`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {citas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                        <CalendarDays className="mb-3 h-10 w-10 opacity-30" />
                        <p className="text-sm">Sin citas para hoy.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Hora</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Servicios</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right">Estado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {citas.map((cita) => (
                                    <TableRow
                                        key={cita.id}
                                        onClick={() => onRowClick?.(cita)}
                                        className={onRowClick ? 'cursor-pointer' : undefined}
                                    >
                                        <TableCell className="font-medium">
                                            {formatHora(cita.hora)}
                                        </TableCell>
                                        <TableCell>{getNombreCliente(cita)}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {cita.servicios.map((s) => s.nombre).join(', ')}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold text-rose-600">
                                            ${Number(cita.total).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <EstadoBadge estado={cita.estado} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
