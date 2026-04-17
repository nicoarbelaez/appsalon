import * as React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Servicio {
    id: number;
    nombre: string;
    precio: string;
    duracion: number;
    descripcion: string | null;
}

interface ServiceSelectorProps {
    servicios: Servicio[];
    selectedIds: number[];
    onToggle: (id: number) => void;
    error?: string;
}

export function ServiceSelector({ servicios, selectedIds, onToggle, error }: ServiceSelectorProps) {
    const serviciosSeleccionados = servicios.filter((s) => selectedIds.includes(s.id));
    const total = serviciosSeleccionados.reduce((acc, s) => acc + parseFloat(s.precio), 0);
    const duracion = serviciosSeleccionados.reduce((acc, s) => acc + s.duracion, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">2. Selecciona servicios</CardTitle>
                <CardDescription>Puedes elegir uno o más servicios.</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <p className="mb-3 text-xs text-red-500">
                        {error}
                    </p>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                    {servicios.map((s) => {
                        const selected = selectedIds.includes(s.id);
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => onToggle(s.id)}
                                className={`rounded-lg border p-3 text-left transition-all ${
                                    selected
                                        ? 'border-rose-500 bg-rose-600/5 dark:bg-rose-900/20 shadow-sm'
                                        : 'border-gray-100 hover:border-gray-300 dark:border-gray-800'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <p className="text-sm font-medium">
                                        {s.nombre}
                                    </p>
                                    {selected && (
                                        <span className="text-rose-600">
                                            ✓
                                        </span>
                                    )}
                                </div>
                                {s.descripcion && (
                                    <p className="mt-0.5 text-xs text-gray-400">
                                        {s.descripcion}
                                    </p>
                                )}
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-sm font-bold text-rose-600">
                                        ${s.precio}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        • {s.duracion} min
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {selectedIds.length > 0 && (
                    <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            Duración: {duracion} min
                        </div>
                        <p className="font-bold text-rose-600">
                            Total: ${total.toFixed(2)}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
