@extends('reportes.layout')

@section('contenido')

    <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:28px;font-weight:700;color:#e11d48;">{{ $total_general }}</div>
        <div style="font-size:10px;color:#6b7280;margin-top:4px;">Ingresos totales del per&iacute;odo</div>
    </div>

    @if(count($por_servicio) > 0)
        <div class="section-title">Ingresos por servicio</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Servicio</th>
                    <th class="text-right">Veces realizado</th>
                    <th class="text-right">Total generado</th>
                    <th class="text-right">% del total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($por_servicio as $fila)
                    <tr class="{{ $loop->even ? 'alt' : '' }}">
                        <td>{{ $fila['servicio'] }}</td>
                        <td class="text-right">{{ $fila['veces'] }}</td>
                        <td class="text-right">{{ $fila['total'] }}</td>
                        <td class="text-right">{{ $fila['porcentaje'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    @if(count($por_dia) > 0)
        <div class="section-title" style="margin-top:24px;">Ingresos por d&iacute;a</div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Fecha</th>
                    <th class="text-right">Citas</th>
                    <th class="text-right">Ingresos</th>
                </tr>
            </thead>
            <tbody>
                @foreach($por_dia as $fila)
                    <tr class="{{ $loop->even ? 'alt' : '' }}">
                        <td>{{ $fila['dia'] }}</td>
                        <td class="text-right">{{ $fila['citas'] }}</td>
                        <td class="text-right">{{ $fila['ingresos'] }}</td>
                    </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="2" class="text-right">Total:</td>
                    <td class="text-right">{{ $total_general }}</td>
                </tr>
            </tfoot>
        </table>
    @endif

    @if(count($por_servicio) === 0 && count($por_dia) === 0)
        <p class="empty-state">No se encontraron ingresos con los filtros seleccionados.</p>
    @endif

@endsection
