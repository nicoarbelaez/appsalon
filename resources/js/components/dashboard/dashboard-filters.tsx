import type { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toDateString } from '@/lib/date';
import type { DashboardFiltros } from '@/types/dashboard';

interface DashboardFiltersProps {
    filtros: DashboardFiltros;
    servicios: Array<{ id: number; nombre: string }>;
    showServicioFilter?: boolean;
    onFiltrosChange: (patch: Partial<DashboardFiltros>) => void;
}

export function DashboardFilters({
    filtros,
    servicios,
    showServicioFilter = true,
    onFiltrosChange,
}: DashboardFiltersProps) {
    const dateRange: DateRange | undefined =
        filtros.desde || filtros.hasta
            ? {
                  from: filtros.desde
                      ? new Date(filtros.desde + 'T00:00:00')
                      : undefined,
                  to: filtros.hasta
                      ? new Date(filtros.hasta + 'T00:00:00')
                      : undefined,
              }
            : undefined;

    function handleDateRange(range: DateRange | undefined) {
        onFiltrosChange({
            desde: range?.from ? toDateString(range.from) : null,
            hasta: range?.to ? toDateString(range.to) : null,
        });
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <DateRangePicker
                value={dateRange}
                onValueChange={handleDateRange}
                placeholder="Rango de fechas"
                numberOfMonths={1}
            />

            {showServicioFilter && (
                <Select
                    value={
                        filtros.servicioId
                            ? String(filtros.servicioId)
                            : 'todos'
                    }
                    onValueChange={(v) =>
                        onFiltrosChange({
                            servicioId: v === 'todos' ? null : Number(v),
                        })
                    }
                >
                    <SelectTrigger className="h-8 w-44">
                        <SelectValue placeholder="Todos los servicios" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">
                            Todos los servicios
                        </SelectItem>
                        {servicios.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                                {s.nombre}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    );
}
