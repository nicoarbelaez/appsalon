import * as React from 'react';
import { Head } from '@inertiajs/react';
import { Download, Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ImportDialog } from '@/components/ui/import-dialog';
import { CitasTable } from '@/components/citas/citas-table';
import { DetailSheet } from '@/components/citas/detail-sheet';
import { NuevaCitaSheet } from '@/components/citas/nueva-cita-sheet';
import { dashboard } from '@/routes';
import type { BusySlot, Cita, Servicio, Usuario } from '@/types/citas';

interface Props {
    citas: Cita[];
    servicios: Servicio[];
    ocupados: BusySlot[];
    usuarios: Usuario[];
}

export default function AgendaCitas({
    citas,
    servicios,
    ocupados,
    usuarios,
}: Props) {
    const [selectedCita, setSelectedCita] = React.useState<Cita | null>(null);
    const [detailOpen, setDetailOpen] = React.useState(false);
    const [nuevaOpen, setNuevaOpen] = React.useState(false);
    const [importOpen, setImportOpen] = React.useState(false);

    function openDetail(cita: Cita) {
        setSelectedCita(cita);
        setDetailOpen(true);
    }

    return (
        <>
            <Head title="Agenda de citas" />

            <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold">Agenda de citas</h1>
                    </div>

                    <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap sm:items-center sm:justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 justify-center sm:flex-none"
                                >
                                    <Download className="mr-1.5 h-4 w-4" />
                                    Exportar
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem asChild>
                                    <a href="/funcionario/citas/export?format=xlsx">
                                        Excel (.xlsx)
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <a href="/funcionario/citas/export?format=csv">
                                        CSV (.csv)
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setImportOpen(true)}
                            className="flex-1 justify-center sm:flex-none"
                        >
                            <Upload className="mr-1.5 h-4 w-4" />
                            Importar
                        </Button>

                        <Button
                            className="flex-1 justify-center bg-rose-600 hover:bg-rose-700 sm:flex-none"
                            onClick={() => setNuevaOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva cita
                        </Button>
                    </div>
                </div>

                <CitasTable
                    citas={citas}
                    mode="agenda"
                    onRowClick={openDetail}
                />
            </div>

            <DetailSheet
                cita={selectedCita}
                serviciosDisponibles={servicios}
                mode="agenda"
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />

            <ImportDialog
                open={importOpen}
                onOpenChange={setImportOpen}
                config={{
                    title: 'Importar citas',
                    description:
                        'Sube un archivo Excel o CSV para crear citas en masa.',
                    templateUrl: '/funcionario/citas/import/template',
                    inputId: 'citas-import-file',
                    columnsHint:
                        'Columnas: fecha (YYYY-MM-DD), hora (HH:MM), email_usuario, nombres_servicios, estado. Opcionales: nombre_invitado, email_invitado, telefono_invitado',
                    previewUrl: '/funcionario/citas/preview',
                    revalidateUrl: '/funcionario/citas/revalidate',
                    importRowsUrl: '/funcionario/citas/import-rows',
                }}
            />

            <NuevaCitaSheet
                open={nuevaOpen}
                onOpenChange={setNuevaOpen}
                mode="agenda"
                servicios={servicios}
                ocupados={ocupados}
                usuarios={usuarios}
            />
        </>
    );
}

AgendaCitas.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Agenda de citas', href: '/funcionario/citas' },
    ],
};
