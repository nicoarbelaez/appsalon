@extends('reportes.layout')

@section('contenido')

    <div class="summary-grid">
        <div class="summary-card" style="width:220px;">
            <span class="card-value">{{ $total_clientes }}</span>
            <span class="card-label">Clientes registrados</span>
        </div>
    </div>

    <div class="section-title">Listado de clientes</div>

    @if($clientes->isNotEmpty())
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Tel&eacute;fono</th>
                    <th class="text-right">Citas totales</th>
                    <th class="text-right">Total gastado</th>
                </tr>
            </thead>
            <tbody>
                @foreach($clientes as $cliente)
                    <tr class="{{ $loop->even ? 'alt' : '' }}">
                        <td>{{ $cliente['nombre'] }}</td>
                        <td>{{ $cliente['email'] }}</td>
                        <td>{{ $cliente['telefono'] }}</td>
                        <td class="text-right">{{ $cliente['total_citas'] }}</td>
                        <td class="text-right">{{ $cliente['total_gastado'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p class="empty-state">No hay clientes registrados.</p>
    @endif

@endsection
