import * as React from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { AlertCircle, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ImportPreviewData {
    columns: string[];
    rows: Record<string, string>[];
    errors: Record<number, string[]>;
}

interface ImportPreviewDrawerProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    initialData: ImportPreviewData;
    revalidateUrl: string;
    importRowsUrl: string;
    onSuccess: () => void;
}

const PAGE_SIZE = 20;

export function ImportPreviewDrawer({
    open,
    onOpenChange,
    initialData,
    revalidateUrl,
    importRowsUrl,
    onSuccess,
}: ImportPreviewDrawerProps) {
    const [rows, setRows] = React.useState<Record<string, string>[]>(initialData.rows);
    const [errors, setErrors] = React.useState<Record<number, string[]>>(initialData.errors);
    const [page, setPage] = React.useState(0);
    const [importing, setImporting] = React.useState(false);
    const debounceRef = React.useRef<ReturnType<typeof setTimeout>>();

    const columns = initialData.columns;
    const totalPages = Math.ceil(rows.length / PAGE_SIZE);
    const pagedRows = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    const hasErrors = Object.keys(errors).length > 0;
    const errorCount = Object.keys(errors).length;

    function getCsrfToken(): string {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
        return match ? decodeURIComponent(match[1]) : '';
    }

    function handleCellChange(pageRowIndex: number, col: string, value: string) {
        const absoluteIndex = page * PAGE_SIZE + pageRowIndex;
        const next = rows.map((r, i) =>
            i === absoluteIndex ? { ...r, [col]: value } : r,
        );
        setRows(next);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(revalidateUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': getCsrfToken(),
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({ rows: next }),
                });
                const json = await res.json();
                setErrors(json.errors ?? {});
            } catch {
                // silently ignore network errors during revalidation
            }
        }, 500);
    }

    async function handleImport() {
        const count = rows.length;
        setImporting(true);
        try {
            router.post(
                importRowsUrl,
                { rows },
                {
                    onSuccess: () => {
                        toast.success(`${count} registro(s) importados correctamente`);
                        onSuccess();
                        onOpenChange(false);
                    },
                    onError: () => toast.error('Ocurrió un error durante la importación'),
                    onFinish: () => setImporting(false),
                },
            );
        } catch {
            setImporting(false);
        }
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
            <DrawerContent className="max-h-[90vh]">
                <DrawerHeader className="border-b pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <DrawerTitle>Vista previa del archivo</DrawerTitle>
                            <DrawerDescription>
                                {rows.length} fila(s) · {errorCount > 0 ? (
                                    <span className="text-red-500 font-medium">{errorCount} con error(es)</span>
                                ) : (
                                    <span className="text-green-600 font-medium">Sin errores</span>
                                )}
                            </DrawerDescription>
                        </div>
                        <Button
                            onClick={handleImport}
                            disabled={hasErrors || importing}
                            className={cn(
                                'transition-colors',
                                !hasErrors
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : '',
                            )}
                        >
                            <Check className="mr-1.5 h-4 w-4" />
                            {importing ? 'Importando…' : 'Listo — Importar'}
                        </Button>
                    </div>
                </DrawerHeader>

                <TooltipProvider>
                    <div className="flex-1 overflow-auto p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-8" />
                                    {columns.map((col) => (
                                        <TableHead key={col} className="capitalize whitespace-nowrap">
                                            {col}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pagedRows.map((row, pageIdx) => {
                                    const absIdx = page * PAGE_SIZE + pageIdx;
                                    const rowErrors = errors[absIdx];
                                    const hasRowError = !!rowErrors?.length;

                                    return (
                                        <TableRow
                                            key={absIdx}
                                            className={cn(
                                                hasRowError
                                                    ? 'bg-red-50 dark:bg-red-950/20'
                                                    : '',
                                            )}
                                        >
                                            <TableCell className="w-8 pr-0">
                                                {hasRowError && (
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right" className="max-w-xs">
                                                            <ul className="space-y-0.5">
                                                                {rowErrors.map((e, i) => (
                                                                    <li key={i}>• {e}</li>
                                                                ))}
                                                            </ul>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                            {columns.map((col) => (
                                                <TableCell key={col} className="p-1.5">
                                                    <Input
                                                        value={row[col] ?? ''}
                                                        onChange={(e) =>
                                                            handleCellChange(
                                                                pageIdx,
                                                                col,
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={cn(
                                                            'h-7 text-xs min-w-[80px]',
                                                            hasRowError
                                                                ? 'border-red-300 focus-visible:ring-red-400'
                                                                : '',
                                                        )}
                                                    />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </TooltipProvider>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 border-t p-3 text-sm text-muted-foreground">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => p - 1)}
                            disabled={page === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span>
                            Pág. {page + 1} / {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page + 1 >= totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </DrawerContent>
        </Drawer>
    );
}
