import * as React from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import type { EstadoReporte, ReporteHistorial } from '@/types/reportes';
import { useReportePolling } from '@/hooks/useReportePolling';
import { ReporteFiltros } from './components/reporte-filtros';
import { HistorialTable } from './components/historial-table';

interface Servicio {
    id: number;
    nombre: string;
}

interface Props {
    servicios: Servicio[];
    historial: ReporteHistorial[];
}

function getCsrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export default function ReportesIndex({ servicios, historial }: Props) {
    const [reporteId, setReporteId]   = React.useState<number | null>(null);
    const [generando, setGenerando]   = React.useState(false);
    const toastIdRef                  = React.useRef<string | number | undefined>(undefined);
    const prevEstadoRef               = React.useRef<EstadoReporte | null>(null);

    const { estado: estadoReporte, error: errorPolling } = useReportePolling(reporteId);

    // Reflect polling state changes in the persistent toast
    React.useEffect(() => {
        if (estadoReporte === null || estadoReporte === prevEstadoRef.current) return;
        prevEstadoRef.current = estadoReporte;

        if (estadoReporte === 'procesando') {
            toast.loading('Generando PDF...', { id: toastIdRef.current });
        }
    }, [estadoReporte]);

    // Handle terminal states: listo → download; error → show error
    React.useEffect(() => {
        if (estadoReporte === 'error' && errorPolling) {
            toast.error(errorPolling, { id: toastIdRef.current });
            setGenerando(false);
            return;
        }

        if (estadoReporte !== 'listo' || reporteId === null) return;

        toast.success('¡Reporte listo! Descargando...', { id: toastIdRef.current });
        setGenerando(false);

        router.reload({ only: ['historial'] });

        const timer = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/funcionario/reportes/${reporteId}/url-descarga`,
                    { headers: { Accept: 'application/json' } },
                );
                if (!res.ok) throw new Error('No se pudo obtener la URL de descarga.');
                const { url } = await res.json();
                window.open(url, '_blank');
            } catch (e) {
                toast.error(e instanceof Error ? e.message : 'Error al descargar.');
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [estadoReporte, errorPolling, reporteId]);

    async function handleSolicitar(payload: Record<string, unknown>) {
        setGenerando(true);
        setReporteId(null);
        prevEstadoRef.current = null;

        toastIdRef.current = toast.loading('Solicitando reporte...');

        try {
            const res = await fetch('/funcionario/reportes/solicitar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                const msg =
                    data.message ??
                    Object.values(data.errors ?? {}).flat().join(', ') ??
                    'Error al solicitar el reporte.';
                throw new Error(msg);
            }

            const data = await res.json();
            setReporteId(data.reporte_id);

            if (data.cached) {
                // Already ready — skip queue message, polling will resolve immediately
                toast.loading('Reporte en caché, obteniendo...', { id: toastIdRef.current });
            } else {
                toast.loading('Reporte en cola, en breve comenzará...', { id: toastIdRef.current });
            }
        } catch (e) {
            toast.error(e instanceof Error ? e.message : 'Error desconocido.', {
                id: toastIdRef.current,
            });
            setGenerando(false);
        }
    }

    function handleNuevoReporte() {
        setReporteId(null);
        setGenerando(false);
        prevEstadoRef.current = null;
        if (toastIdRef.current !== undefined) {
            toast.dismiss(toastIdRef.current);
            toastIdRef.current = undefined;
        }
    }

    const isTerminal = estadoReporte === 'listo' || estadoReporte === 'error';

    return (
        <>
            <Head title="Reportes PDF" />

            <div className="flex flex-col gap-6 p-4 sm:p-6">
                <div>
                    <h1 className="text-2xl font-bold">Reportes PDF</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Genera reportes en PDF con los filtros que necesites.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Configurar reporte</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <ReporteFiltros
                            servicios={servicios}
                            isDisabled={generando}
                            onSolicitar={handleSolicitar}
                        />

                        {isTerminal && (
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNuevoReporte}
                                >
                                    Nuevo reporte
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Reportes recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {historial.length > 0 ? (
                            <HistorialTable historial={historial} />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Aún no has generado reportes.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ReportesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Reportes PDF', href: '/funcionario/reportes' },
    ],
};
