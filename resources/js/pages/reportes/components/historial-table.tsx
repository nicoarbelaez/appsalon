import * as React from 'react';
import { Copy, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ReporteHistorial } from '@/types/reportes';

const ESTADO_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    pendiente:  'secondary',
    procesando: 'secondary',
    listo:      'default',
    error:      'destructive',
};

const TIPO_LABEL: Record<string, string> = {
    citas:     'Citas',
    ingresos:  'Ingresos',
    clientes:  'Clientes',
};

function formatFecha(iso: string) {
    return new Date(iso).toLocaleDateString('es', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

interface Props {
    historial: ReporteHistorial[];
}

export function HistorialTable({ historial }: Props) {
    const [descargando, setDescargando] = React.useState<number | null>(null);

    async function handleDescargar(reporte: ReporteHistorial) {
        if (descargando !== null) return;
        setDescargando(reporte.id);

        const toastId = toast.loading('Obteniendo enlace de descarga...');
        try {
            const res = await fetch(
                `/funcionario/reportes/${reporte.id}/url-descarga`,
                { headers: { Accept: 'application/json' } },
            );
            if (!res.ok) throw new Error('No se pudo obtener la URL.');
            const { url } = await res.json();
            toast.success('Descarga iniciada.', { id: toastId });
            window.open(url, '_blank');
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Error al descargar.', { id: toastId });
        } finally {
            setDescargando(null);
        }
    }

    function handleCopyId(id: number) {
        navigator.clipboard.writeText(String(id));
        toast.success(`ID #${id} copiado al portapapeles`);
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="py-2 text-left font-medium text-muted-foreground">ID</th>
                        <th className="py-2 text-left font-medium text-muted-foreground">Tipo</th>
                        <th className="py-2 text-left font-medium text-muted-foreground">Estado</th>
                        <th className="py-2 text-left font-medium text-muted-foreground">Generado</th>
                        <th className="py-2 text-left font-medium text-muted-foreground">Expira</th>
                        <th className="py-2 text-right font-medium text-muted-foreground">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {historial.map((r) => (
                        <tr key={r.id} className="border-b last:border-0">
                            <td className="py-2">
                                <span className="inline-flex items-center gap-1">
                                    <span className="font-mono text-xs text-muted-foreground">
                                        #{r.id}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleCopyId(r.id)}
                                        className="rounded p-0.5 opacity-50 hover:bg-muted hover:opacity-100"
                                        title="Copiar ID"
                                    >
                                        <Copy className="h-3 w-3" />
                                    </button>
                                </span>
                            </td>
                            <td className="py-2">{TIPO_LABEL[r.tipo] ?? r.tipo}</td>
                            <td className="py-2">
                                <Badge variant={ESTADO_VARIANT[r.estado] ?? 'secondary'}>
                                    {r.estado}
                                </Badge>
                            </td>
                            <td className="py-2 text-muted-foreground">
                                {formatFecha(r.created_at)}
                            </td>
                            <td className="py-2 text-muted-foreground">
                                {r.expira_en ? formatFecha(r.expira_en) : '—'}
                            </td>
                            <td className="py-2 text-right">
                                {r.estado === 'listo' && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={descargando === r.id}
                                        onClick={() => handleDescargar(r)}
                                    >
                                        {descargando === r.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Download className="h-3 w-3" />
                                        )}
                                        <span className="ml-1.5">Descargar</span>
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
