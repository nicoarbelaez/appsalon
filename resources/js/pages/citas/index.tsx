import * as React from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CitasTable } from '@/components/citas/citas-table';
import { DetailSheet } from '@/components/citas/detail-sheet';
import { NuevaCitaSheet } from '@/components/citas/nueva-cita-sheet';
import { dashboard } from '@/routes';
import type { BusySlot, Cita, Servicio } from '@/types/citas';
import type { Horario } from '@/types/horarios';

interface Props {
    citas: Cita[];
    servicios: Servicio[];
    ocupados: BusySlot[];
    horarios: Horario[];
}

export default function CitasIndex({ citas, servicios, ocupados, horarios }: Props) {
    const [selectedCita, setSelectedCita] = React.useState<Cita | null>(null);
    const [detailOpen, setDetailOpen] = React.useState(false);
    const [nuevaOpen, setNuevaOpen] = React.useState(false);

    function openDetail(cita: Cita) {
        setSelectedCita(cita);
        setDetailOpen(true);
    }

    function cancelar(id: number) {
        router.delete(`/citas/${id}`, {
            onSuccess: () => toast.success('Cita cancelada'),
            onError: () => toast.error('No se pudo cancelar la cita'),
        });
    }

    return (
        <>
            <Head title="Mis citas" />

            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Mis citas</h1>
                    <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => setNuevaOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Reservar cita
                    </Button>
                </div>

                <CitasTable citas={citas} mode="mis-citas" onRowClick={openDetail} />
            </div>

            <DetailSheet
                cita={selectedCita}
                serviciosDisponibles={servicios}
                mode="mis-citas"
                open={detailOpen}
                onOpenChange={setDetailOpen}
                onCancelar={cancelar}
            />

            <NuevaCitaSheet
                open={nuevaOpen}
                onOpenChange={setNuevaOpen}
                mode="mis-citas"
                servicios={servicios}
                ocupados={ocupados}
                horarios={horarios}
            />
        </>
    );
}

CitasIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Mis citas', href: '/citas' },
    ],
};
