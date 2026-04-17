import { Badge } from '@/components/ui/badge';
import type { EstadoCita } from '@/types/citas';

export const estadoConfig: Record<EstadoCita, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
    pendiente:  { label: 'Pendiente',  variant: 'outline',    className: 'border-yellow-400 text-yellow-700 dark:text-yellow-400' },
    confirmada: { label: 'Confirmada', variant: 'default',    className: 'bg-blue-500 text-white hover:bg-blue-600' },
    completada: { label: 'Completada', variant: 'default',    className: 'bg-green-600 text-white hover:bg-green-700' },
    cancelada:  { label: 'Cancelada',  variant: 'destructive', className: '' },
};

export function EstadoBadge({ estado }: { estado: EstadoCita }) {
    const cfg = estadoConfig[estado] ?? estadoConfig.pendiente;
    return (
        <Badge variant={cfg.variant} className={cfg.className}>
            {cfg.label}
        </Badge>
    );
}
