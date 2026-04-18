@extends('reportes.layout')

@section('contenido')

    {{-- Summary cards: 5 items → each ~19% width --}}
    <div class="summary-grid">
        <div class="summary-card" style="width:18%;">
            <span class="card-value">{{ $resumen['total_citas'] }}</span>
            <span class="card-label">Total citas</span>
        </div>
        <div class="summary-card" style="width:18%;">
            <span class="card-value">{{ $resumen['completadas'] }}</span>
            <span class="card-label">Completadas</span>
        </div>
        <div class="summary-card" style="width:18%;">
            <span class="card-value">{{ $resumen['pendientes'] }}</span>
            <span class="card-label">Pendientes</span>
        </div>
        <div class="summary-card" style="width:18%;">
            <span class="card-value">{{ $resumen['canceladas'] }}</span>
            <span class="card-label">Canceladas</span>
        </div>
        <div class="summary-card" style="width:22%;">
            <span class="card-value" style="font-size:13px;">{{ $resumen['ingresos_total'] }}</span>
            <span class="card-label">Ingresos</span>
        </div>
    </div>

    @if($citas->isNotEmpty())
        <div class="section-title">Detalle de citas</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Cliente</th>
                    <th>Servicios</th>
                    <th>Estado</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($citas as $cita)
                    <tr class="{{ $loop->even ? 'alt' : '' }}">
                        <td>{{ $cita->id }}</td>
                        <td>{{ $cita->fecha }}</td>
                        <td>{{ $cita->hora }}</td>
                        <td>{{ $cita->clienteNombre }}</td>
                        <td>{{ $cita->servicios }}</td>
                        <td>
                            <span class="badge badge-{{ $cita->estado }}">
                                {{ ucfirst($cita->estado) }}
                            </span>
                        </td>
                        <td class="text-right">{{ $cita->total }}</td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="6" class="text-right">Total ingresos:</td>
                    <td class="text-right">{{ $resumen['ingresos_total'] }}</td>
                </tr>
            </tfoot>
        </table>
    @else
        <p class="empty-state">No se encontraron citas con los filtros seleccionados.</p>
    @endif

@endsection
