import * as React from 'react';
import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

export default function AgendaCitas({ citas, servicios, ocupados, usuarios }: Props) {
    const [selectedCita, setSelectedCita] = React.useState<Cita | null>(null);
    const [detailOpen, setDetailOpen] = React.useState(false);
    const [nuevaOpen, setNuevaOpen] = React.useState(false);

    function openDetail(cita: Cita) {
        setSelectedCita(cita);
        setDetailOpen(true);
    }

    return (
        <>
            <Head title="Agenda de citas" />

            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Agenda de citas</h1>
                    <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => setNuevaOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva cita
                    </Button>
                </div>

                <CitasTable citas={citas} mode="agenda" onRowClick={openDetail} />
            </div>

            <DetailSheet
                cita={selectedCita}
                serviciosDisponibles={servicios}
                mode="agenda"
                open={detailOpen}
                onOpenChange={setDetailOpen}
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
