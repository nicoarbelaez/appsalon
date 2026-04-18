import * as React from 'react';
import type { EstadoReporte } from '@/types/reportes';

interface PollingResult {
    estado: EstadoReporte | null;
    error: string | null;
}

export function useReportePolling(
    reporteId: number | null,
    intervalMs = 2000,
): PollingResult {
    const [estado, setEstado] = React.useState<EstadoReporte | null>(null);
    const [error, setError]   = React.useState<string | null>(null);

    React.useEffect(() => {
        if (reporteId === null) {
            setEstado(null);
            setError(null);
            return;
        }

        let timer: ReturnType<typeof setInterval>;
        let cancelled = false;

        async function poll() {
            try {
                const res = await fetch(
                    `/funcionario/reportes/${reporteId}/estado`,
                    { headers: { Accept: 'application/json' } },
                );

                if (!res.ok) throw new Error('Error al consultar estado del reporte.');

                const data = await res.json();

                if (!cancelled) {
                    setEstado(data.estado);

                    if (data.estado === 'error') {
                        setError(data.error_mensaje ?? 'Error desconocido.');
                        clearInterval(timer);
                    } else if (data.estado === 'listo') {
                        clearInterval(timer);
                    }
                }
            } catch (e) {
                if (!cancelled) {
                    setError(e instanceof Error ? e.message : 'Error de red.');
                    clearInterval(timer);
                }
            }
        }

        poll();
        timer = setInterval(poll, intervalMs);

        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [reporteId, intervalMs]);

    return { estado, error };
}
