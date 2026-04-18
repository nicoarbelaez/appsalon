import type { CitasPorServicioItem, CitasPorServicioPivot } from '@/types/dashboard';

const CHART_COLORS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
];

export function slugify(s: string): string {
    return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export function getServiciosUnicos(data: CitasPorServicioItem[]): string[] {
    return Array.from(new Set(data.map((d) => d.servicio)));
}

export function pivotCitasPorServicio(
    data: CitasPorServicioItem[],
): CitasPorServicioPivot[] {
    const map = new Map<string, CitasPorServicioPivot>();

    for (const item of data) {
        const key = slugify(item.servicio);
        if (!map.has(item.dia)) {
            map.set(item.dia, { dia: item.dia });
        }
        map.get(item.dia)![key] = item.total;
    }

    return Array.from(map.values()).sort((a, b) =>
        (a.dia as string).localeCompare(b.dia as string),
    );
}

export function buildChartConfig(
    servicios: string[],
): Record<string, { label: string; color: string }> {
    return Object.fromEntries(
        servicios.map((s, i) => [
            slugify(s),
            { label: s, color: CHART_COLORS[i % CHART_COLORS.length] },
        ]),
    );
}
