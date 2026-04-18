import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import {
    buildChartConfig,
    getServiciosUnicos,
    pivotCitasPorServicio,
    slugify,
} from '@/lib/dashboard';
import type { CitasPorServicioItem } from '@/types/dashboard';

function fmtShort(v: number): string {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
    return `$${v}`;
}

interface CitasAreaChartProps {
    data: CitasPorServicioItem[];
    loading?: boolean;
}

export function CitasAreaChart({ data, loading }: CitasAreaChartProps) {
    const servicios = getServiciosUnicos(data);
    const pivoted = pivotCitasPorServicio(data);
    const config = buildChartConfig(servicios) as ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Ingresos por servicio</CardTitle>
                <CardDescription>
                    Ingresos de citas completadas / confirmadas por servicio
                </CardDescription>
            </CardHeader>
            <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
                {loading ? (
                    <Skeleton className="aspect-auto h-[200px] w-full rounded-xl sm:h-[260px]" />
                ) : data.length === 0 ? (
                    <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground sm:h-[260px]">
                        Sin datos para el período seleccionado.
                    </div>
                ) : (
                    <ChartContainer config={config} className="aspect-auto h-[200px] w-full sm:h-[260px]">
                        <AreaChart data={pivoted} margin={{ left: 4, right: 8, top: 4 }}>
                            <defs>
                                {servicios.map((s) => {
                                    const slug = slugify(s);
                                    return (
                                        <linearGradient
                                            key={slug}
                                            id={`fill-${slug}`}
                                            x1="0" y1="0" x2="0" y2="1"
                                        >
                                            <stop offset="5%"  stopColor={`var(--color-${slug})`} stopOpacity={0.8} />
                                            <stop offset="95%" stopColor={`var(--color-${slug})`} stopOpacity={0.1} />
                                        </linearGradient>
                                    );
                                })}
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="dia"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={40}
                                tickFormatter={(value: string) =>
                                    format(parseISO(value), 'd MMM', { locale: es })
                                }
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                width={52}
                                tickFormatter={fmtShort}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value: unknown) =>
                                            format(
                                                parseISO(value as string),
                                                "d 'de' MMMM",
                                                { locale: es },
                                            )
                                        }
                                        formatter={(value: unknown, name: unknown) => [
                                            `$${Number(value ?? 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
                                            config[name as string]?.label ?? (name as string),
                                        ]}
                                        indicator="dot"
                                    />
                                }
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            {servicios.map((s) => {
                                const slug = slugify(s);
                                return (
                                    <Area
                                        key={slug}
                                        dataKey={slug}
                                        type="natural"
                                        stroke={`var(--color-${slug})`}
                                        fill={`url(#fill-${slug})`}
                                        strokeWidth={2}
                                        stackId="1"
                                    />
                                );
                            })}
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
