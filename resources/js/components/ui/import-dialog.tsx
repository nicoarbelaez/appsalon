import * as React from 'react';
import { Download, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ImportPreviewDrawer,
    type ImportPreviewData,
} from '@/components/ui/import-preview-drawer';

export interface ImportDialogConfig {
    title: string;
    description: string;
    templateUrl: string;
    templateLabel?: string;
    columnsHint: React.ReactNode;
    inputId: string;
    previewUrl: string;
    revalidateUrl: string;
    importRowsUrl: string;
    // kept for backward-compat (fallback file upload, not used in preview flow)
    importUrl?: string;
}

interface ImportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    config: ImportDialogConfig;
}

function getCsrfToken(): string {
    const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

export function ImportDialog({ open, onOpenChange, config }: ImportDialogProps) {
    const fileRef = React.useRef<HTMLInputElement>(null);
    const [previewing, setPreviewing] = React.useState(false);
    const [previewError, setPreviewError] = React.useState<string | null>(null);
    const [previewData, setPreviewData] = React.useState<ImportPreviewData | null>(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    function handleClose(v: boolean) {
        if (!v) {
            setPreviewData(null);
            setPreviewError(null);
            if (fileRef.current) fileRef.current.value = '';
        }
        onOpenChange(v);
    }

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreviewError(null);
        setPreviewing(true);

        try {
            const fd = new FormData();
            fd.append('file', file);

            const res = await fetch(config.previewUrl, {
                method: 'POST',
                body: fd,
                headers: {
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
            });

            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json?.message ?? 'Error del servidor');
            }

            const json: ImportPreviewData = await res.json();

            if (json.columns.length === 0) {
                throw new Error('El archivo está vacío o no tiene encabezados reconocibles.');
            }

            setPreviewData(json);
            setDrawerOpen(true);
        } catch (err: unknown) {
            setPreviewError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo analizar el archivo. Verifica que sea válido.',
            );
        } finally {
            setPreviewing(false);
        }
    }

    function handleImportSuccess() {
        handleClose(false);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{config.title}</DialogTitle>
                        <DialogDescription>{config.description}</DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <a
                                href={config.templateUrl}
                                className="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:underline"
                            >
                                <Download className="h-3.5 w-3.5" />
                                {config.templateLabel ?? 'Descargar plantilla'}
                            </a>
                            <div className="text-xs text-muted-foreground">
                                {config.columnsHint}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor={config.inputId}>
                                Archivo (.xlsx, .xls, .csv)
                            </Label>
                            <Input
                                id={config.inputId}
                                ref={fileRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="cursor-pointer"
                                disabled={previewing}
                                onChange={handleFileChange}
                            />
                            {previewing && (
                                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Analizando archivo…
                                </p>
                            )}
                            {previewError && (
                                <p className="text-xs text-destructive">{previewError}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleClose(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            disabled={!previewData || previewing}
                            variant="outline"
                            onClick={() => previewData && setDrawerOpen(true)}
                        >
                            <Upload className="mr-1.5 h-4 w-4" />
                            Ver vista previa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {previewData && (
                <ImportPreviewDrawer
                    open={drawerOpen}
                    onOpenChange={setDrawerOpen}
                    initialData={previewData}
                    revalidateUrl={config.revalidateUrl}
                    importRowsUrl={config.importRowsUrl}
                    onSuccess={handleImportSuccess}
                />
            )}
        </>
    );
}
