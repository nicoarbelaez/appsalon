import { Link } from '@inertiajs/react';
import { CalendarDays, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EstadoBadge } from '@/components/citas/estado-badge';
import { formatFecha, formatHora } from '@/lib/date';
import type { ProximaCita } from '@/types/dashboard';

interface NextAppointmentCardProps {
    cita: ProximaCita | null;
}

export function NextAppointmentCard({ cita }: NextAppointmentCardProps) {
    if (!cita) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <CalendarDays className="mb-3 h-10 w-10 text-muted-foreground opacity-40" />
                    <p className="mb-4 text-sm text-muted-foreground">
                        No tienes citas próximas.
                    </p>
                    <Button asChild size="sm" className="bg-rose-600 hover:bg-rose-700">
                        <Link href="/citas">
                            <Plus className="mr-1.5 h-4 w-4" />
                            Reservar cita
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const totalNum = Number(cita.total);

    return (
        <Card className="border-l-4 border-l-rose-500">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">Próxima cita</CardTitle>
                    <EstadoBadge estado={cita.estado} />
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span className="capitalize">{formatFecha(cita.fecha)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span>{formatHora(cita.hora)}</span>
                    </div>
                </div>

                <ul className="space-y-1">
                    {cita.servicios.map((s) => (
                        <li
                            key={s.id}
                            className="flex justify-between text-sm"
                        >
                            <span>{s.nombre}</span>
                            <span className="text-muted-foreground">
                                ${Number(s.precio).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-medium text-muted-foreground">Total</span>
                    <span className="text-lg font-bold text-rose-600">
                        ${totalNum.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
