import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import type { CitasPorDiaItem } from '@/types/dashboard';

const chartConfig: ChartConfig = {
    total: { label: 'Ingresos', color: 'var(--chart-1)' },
};

function fmtShort(v: number): string {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
    return `$${v}`;
}

interface CitasLineChartProps {
    data: CitasPorDiaItem[];
    loading?: boolean;
}

export function CitasLineChart({ data, loading }: CitasLineChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Ingresos por día</CardTitle>
                <CardDescription>
                    Ingresos de citas completadas / confirmadas
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
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[200px] w-full sm:h-[260px]"
                    >
                        <LineChart
                            data={data}
                            margin={{ left: 4, right: 8, top: 4 }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                            />
                            <XAxis
                                dataKey="dia"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={40}
                                tickFormatter={(v: string) =>
                                    format(parseISO(v), 'd MMM', { locale: es })
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
                                        formatter={(value: unknown) => [
                                            `$${Number(value ?? 0).toLocaleString('es-CO', { minimumFractionDigits: 2 })}`,
                                            ' ',
                                            'Ingresos',
                                        ]}
                                        indicator="line"
                                    />
                                }
                            />
                            <Line
                                dataKey="total"
                                type="monotone"
                                stroke="var(--color-total)"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </LineChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    );
}
