import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    MessageCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { EstadoBadge, estadoConfig } from '@/components/citas/estado-badge';
import { formatFecha, formatHora } from '@/lib/date';
import { compartirCitaWhatsApp } from '@/lib/whatsapp';
import type { Cita, EstadoCita } from '@/types/citas';

export function getNombreCliente(cita: Cita) {
    if (cita.usuario) return `${cita.usuario.nombre} ${cita.usuario.apellido}`;
    if (cita.nombre_invitado) return `${cita.nombre_invitado} (invitado)`;
    return 'Sin datos';
}

interface CitasTableProps {
    citas: Cita[];
    mode: 'agenda' | 'mis-citas';
    onRowClick: (cita: Cita) => void;
}

function buildColumns(mode: 'agenda' | 'mis-citas'): ColumnDef<Cita>[] {
    const cols: ColumnDef<Cita>[] = [
        {
            accessorKey: 'fecha',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Fecha
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="capitalize">
                    {formatFecha(row.original.fecha)}
                </span>
            ),
        },
        {
            accessorKey: 'hora',
            header: 'Hora',
            cell: ({ row }) => formatHora(row.original.hora),
        },
    ];

    if (mode === 'agenda') {
        cols.push({
            id: 'nombre',
            header: 'Cliente',
            accessorFn: (row) => getNombreCliente(row),
            cell: ({ getValue }) => (
                <span className="font-medium">{getValue() as string}</span>
            ),
            filterFn: 'includesString',
        });
    }

    cols.push(
        {
            id: 'servicios',
            header: 'Servicios',
            cell: ({ row }) => (
                <ScrollArea className="w-44">
                    <div className="flex flex-wrap gap-1 pb-1">
                        {row.original.servicios.map((s) => (
                            <Badge
                                key={s.id}
                                variant="secondary"
                                className="text-xs"
                            >
                                {s.nombre}
                            </Badge>
                        ))}
                    </div>
                </ScrollArea>
            ),
        },
        {
            accessorKey: 'total',
            header: 'Total',
            cell: ({ row }) => (
                <span className="font-semibold text-rose-600">
                    $
                    {parseFloat(row.original.total).toLocaleString('es-CO', {
                        minimumFractionDigits: 2,
                    })}
                </span>
            ),
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            cell: ({ row }) => <EstadoBadge estado={row.original.estado} />,
            filterFn: (row, _, filterValue) =>
                !filterValue ||
                filterValue === 'todos' ||
                row.original.estado === filterValue,
        },
        {
            id: 'whatsapp',
            header: '',
            cell: ({ row }) => {
                const cita = row.original;
                if (!['pendiente', 'confirmada'].includes(cita.estado))
                    return null;
                return (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                        title="Compartir por WhatsApp"
                        onClick={(e) => {
                            e.stopPropagation();
                            compartirCitaWhatsApp(cita);
                        }}
                    >
                        <MessageCircle className="h-4 w-4" />
                        <span className="sr-only">Compartir por WhatsApp</span>
                    </Button>
                );
            },
        },
    );

    return cols;
}

export function CitasTable({ citas, mode, onRowClick }: CitasTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'fecha', desc: false },
    ]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);

    const columns = React.useMemo(() => buildColumns(mode), [mode]);

    const table = useReactTable({
        data: citas,
        columns,
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 15 } },
    });

    const estadoFiltro =
        (table.getColumn('estado')?.getFilterValue() as string) ?? 'todos';

    return (
        <div className="flex flex-col gap-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {mode === 'agenda' && (
                    <Input
                        placeholder="Buscar por cliente…"
                        value={
                            (table
                                .getColumn('nombre')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={(e) =>
                            table
                                .getColumn('nombre')
                                ?.setFilterValue(e.target.value)
                        }
                        className="h-8 w-56"
                    />
                )}

                <Select
                    value={estadoFiltro}
                    onValueChange={(v) =>
                        table
                            .getColumn('estado')
                            ?.setFilterValue(v === 'todos' ? undefined : v)
                    }
                >
                    <SelectTrigger className="h-8 w-40">
                        <SelectValue placeholder="Todos los estados" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        {(Object.keys(estadoConfig) as EstadoCita[]).map(
                            (e) => (
                                <SelectItem key={e} value={e}>
                                    {estadoConfig[e].label}
                                </SelectItem>
                            ),
                        )}
                    </SelectContent>
                </Select>

                <span className="ml-auto text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} cita(s)
                </span>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="cursor-pointer"
                                    onClick={() => onRowClick(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    No hay citas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    Página {table.getState().pagination.pageIndex + 1} de{' '}
                    {Math.max(table.getPageCount(), 1)}
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
