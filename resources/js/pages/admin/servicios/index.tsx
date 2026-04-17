import * as React from 'react';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ServiciosTable } from '@/components/servicios/servicios-table';
import { ServicioSheet } from '@/components/servicios/servicio-sheet';
import type { Servicio, ServiciosFilters } from '@/types/servicios';

interface Props {
    servicios: Servicio[];
    filters: ServiciosFilters;
}

export default function AdminServiciosIndex({ servicios, filters }: Props) {
    const [search, setSearch] = React.useState(filters.search);
    const [activo, setActivo] = React.useState<ServiciosFilters['activo']>(filters.activo);
    const [sheetOpen, setSheetOpen] = React.useState(false);
    const [sheetMode, setSheetMode] = React.useState<'create' | 'edit'>('create');
    const [editingServicio, setEditingServicio] = React.useState<Servicio | undefined>(undefined);

    React.useEffect(() => {
        const t = setTimeout(() => {
            router.get(
                '/admin/servicios',
                { search, activo },
                { preserveState: true, only: ['servicios'], replace: true },
            );
        }, 300);
        return () => clearTimeout(t);
    }, [search]);

    function handleActivoChange(v: string) {
        const val = v as ServiciosFilters['activo'];
        setActivo(val);
        router.get(
            '/admin/servicios',
            { search, activo: val },
            { preserveState: true, only: ['servicios'], replace: true },
        );
    }

    function openCreate() {
        setSheetMode('create');
        setEditingServicio(undefined);
        setSheetOpen(true);
    }

    function openEdit(servicio: Servicio) {
        setSheetMode('edit');
        setEditingServicio(servicio);
        setSheetOpen(true);
    }

    return (
        <>
            <Head title="Admin — Servicios" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Servicios</h1>
                        <p className="text-sm text-muted-foreground">
                            {servicios.length} servicio(s)
                        </p>
                    </div>
                    <Button className="bg-rose-600 hover:bg-rose-700" onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo servicio
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder="Buscar por nombre o descripción…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-8 w-64"
                    />
                    <Select value={activo || 'todos'} onValueChange={handleActivoChange}>
                        <SelectTrigger className="h-8 w-36">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="1">Activos</SelectItem>
                            <SelectItem value="0">Inactivos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <ServiciosTable
                    servicios={servicios}
                    filters={{ search, activo }}
                    onEdit={openEdit}
                />
            </div>

            <ServicioSheet
                mode={sheetMode}
                servicio={editingServicio}
                open={sheetOpen}
                onOpenChange={setSheetOpen}
            />
        </>
    );
}

AdminServiciosIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Servicios', href: '/admin/servicios' },
    ],
};
