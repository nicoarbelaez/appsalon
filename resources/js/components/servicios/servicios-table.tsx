import * as React from 'react';
import {
    ColumnDef,
    RowSelectionState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
} from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { Servicio, ServiciosFilters } from '@/types/servicios';

type DeleteTarget = { type: 'single'; servicio: Servicio } | { type: 'bulk' };

interface ServiciosTableProps {
    servicios: Servicio[];
    filters: ServiciosFilters;
    onEdit: (servicio: Servicio) => void;
}

export function ServiciosTable({
    servicios,
    filters,
    onEdit,
}: ServiciosTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: 'nombre', desc: false },
    ]);
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
        {},
    );
    const [allSelected, setAllSelected] = React.useState(false);
    const [deleteTarget, setDeleteTarget] = React.useState<DeleteTarget | null>(
        null,
    );
    const [bulkToggleTarget, setBulkToggleTarget] = React.useState<
        boolean | null
    >(null);

    React.useEffect(() => {
        setRowSelection({});
        setAllSelected(false);
    }, [filters.search, filters.activo]);

    const columns: ColumnDef<Servicio>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(v) => {
                        table.toggleAllPageRowsSelected(!!v);
                        if (!v) setAllSelected(false);
                    }}
                    aria-label="Seleccionar todo"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(v) => row.toggleSelected(!!v)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Seleccionar fila"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'nombre',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Nombre
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-medium">{row.original.nombre}</span>
            ),
        },
        {
            accessorKey: 'descripcion',
            header: 'Descripción',
            cell: ({ row }) => (
                <span className="line-clamp-1 max-w-xs text-muted-foreground">
                    {row.original.descripcion ?? '—'}
                </span>
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'duracion',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Duración
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => `${row.original.duracion} min`,
        },
        {
            accessorKey: 'precio',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Precio
                    <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-semibold text-rose-600">
                    $
                    {parseFloat(row.original.precio).toLocaleString('es-CO', {
                        minimumFractionDigits: 2,
                    })}
                </span>
            ),
            sortingFn: (a, b) =>
                parseFloat(a.original.precio) - parseFloat(b.original.precio),
        },
        {
            accessorKey: 'activo',
            header: 'Estado',
            cell: ({ row }) =>
                row.original.activo ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Activo
                    </Badge>
                ) : (
                    <Badge variant="secondary">Inactivo</Badge>
                ),
            enableSorting: false,
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => {
                const s = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Acciones</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(s);
                                }}
                            >
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.post(
                                        '/admin/servicios/bulk-toggle',
                                        { ids: [s.id], activo: !s.activo },
                                        {
                                            preserveScroll: true,
                                            onSuccess: () => toast.success(s.activo ? `"${s.nombre}" deshabilitado` : `"${s.nombre}" habilitado`),
                                            onError: () => toast.error('Error al cambiar el estado del servicio'),
                                        },
                                    );
                                }}
                            >
                                {s.activo ? 'Deshabilitar' : 'Habilitar'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteTarget({
                                        type: 'single',
                                        servicio: s,
                                    });
                                }}
                            >
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            enableSorting: false,
        },
    ];

    const table = useReactTable({
        data: servicios,
        columns,
        getRowId: (row) => String(row.id),
        enableRowSelection: true,
        state: { sorting, rowSelection },
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 20 } },
    });

    const selectedIds = Object.keys(rowSelection).map(Number);
    const hasSelection = selectedIds.length > 0 || allSelected;
    const showSelectAll =
        table.getIsAllPageRowsSelected() &&
        servicios.length > table.getRowModel().rows.length &&
        !allSelected;

    function handleBulkToggle(activo: boolean) {
        setBulkToggleTarget(activo);
    }

    function confirmBulkToggle() {
        if (bulkToggleTarget === null) return;
        const count = allSelected ? servicios.length : selectedIds.length;
        const activo = bulkToggleTarget;
        const body = allSelected
            ? {
                  selectAll: true,
                  activo,
                  search: filters.search,
                  activo_filter: filters.activo,
              }
            : { ids: selectedIds, activo };
        router.post('/admin/servicios/bulk-toggle', body, {
            preserveScroll: true,
            onSuccess: () => {
                setRowSelection({});
                setAllSelected(false);
                toast.success(`${count} servicio(s) ${activo ? 'habilitados' : 'deshabilitados'}`);
            },
            onError: () => toast.error('Error al cambiar el estado de los servicios'),
        });
        setBulkToggleTarget(null);
    }

    function handleBulkDelete() {
        setDeleteTarget({ type: 'bulk' });
    }

    function confirmDelete() {
        if (!deleteTarget) return;
        if (deleteTarget.type === 'single') {
            const nombre = deleteTarget.servicio.nombre;
            router.delete(`/admin/servicios/${deleteTarget.servicio.id}`, {
                preserveScroll: true,
                onSuccess: () => toast.success(`"${nombre}" eliminado`),
                onError: () => toast.error('No se pudo eliminar el servicio'),
            });
        } else {
            const count = allSelected ? servicios.length : selectedIds.length;
            const body = allSelected
                ? {
                      selectAll: true,
                      search: filters.search,
                      activo: filters.activo,
                  }
                : { ids: selectedIds };
            router.post('/admin/servicios/bulk-destroy', body, {
                preserveScroll: true,
                onSuccess: () => {
                    setRowSelection({});
                    setAllSelected(false);
                    toast.success(`${count} servicio(s) eliminados`);
                },
                onError: () => toast.error('No se pudieron eliminar los servicios'),
            });
        }
        setDeleteTarget(null);
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Bulk toolbar */}
            {hasSelection && (
                <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 px-4 py-2 text-sm">
                    <span className="text-muted-foreground">
                        {allSelected ? servicios.length : selectedIds.length}{' '}
                        seleccionado(s)
                    </span>
                    {showSelectAll && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setAllSelected(true)}
                        >
                            Seleccionar todos ({servicios.length})
                        </Button>
                    )}
                    <div className="ml-auto flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleBulkToggle(true)}
                        >
                            Habilitar
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleBulkToggle(false)}
                        >
                            Deshabilitar
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={handleBulkDelete}
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
            )}

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
                                    data-state={
                                        row.getIsSelected()
                                            ? 'selected'
                                            : undefined
                                    }
                                    onClick={() => onEdit(row.original)}
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
                                    No hay servicios.
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

            {/* Bulk toggle confirmation */}
            <AlertDialog
                open={bulkToggleTarget !== null}
                onOpenChange={(v) => {
                    if (!v) setBulkToggleTarget(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿{bulkToggleTarget ? 'Habilitar' : 'Deshabilitar'}{' '}
                            servicios?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Se{' '}
                            {bulkToggleTarget
                                ? 'habilitarán'
                                : 'deshabilitarán'}{' '}
                            {allSelected
                                ? servicios.length
                                : selectedIds.length}{' '}
                            servicio(s) seleccionado(s).
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmBulkToggle}>
                            {bulkToggleTarget ? 'Habilitar' : 'Deshabilitar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete confirmation */}
            <AlertDialog
                open={deleteTarget !== null}
                onOpenChange={(v) => {
                    if (!v) setDeleteTarget(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Eliminar servicio(s)?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteTarget?.type === 'single'
                                ? `Se eliminará "${deleteTarget.servicio.nombre}". Esta acción no se puede deshacer.`
                                : `Se eliminarán ${allSelected ? servicios.length : selectedIds.length} servicio(s) seleccionado(s). Esta acción no se puede deshacer.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
