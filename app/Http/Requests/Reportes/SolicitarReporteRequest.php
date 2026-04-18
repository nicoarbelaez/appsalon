<?php

namespace App\Http\Requests\Reportes;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SolicitarReporteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isFuncionario() ?? false;
    }

    public function rules(): array
    {
        return [
            'tipo'        => ['required', Rule::in(['citas', 'ingresos', 'clientes'])],
            'fecha_desde' => ['nullable', 'date', 'before_or_equal:fecha_hasta'],
            'fecha_hasta' => ['nullable', 'date', 'after_or_equal:fecha_desde'],
            'estado'      => ['nullable', Rule::in(['pendiente', 'confirmada', 'completada', 'cancelada'])],
            'servicio_id' => ['nullable', 'integer', 'exists:servicios,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'tipo.required' => 'Debes seleccionar el tipo de reporte.',
            'tipo.in'       => 'Tipo de reporte inválido.',
            'fecha_desde.before_or_equal' => 'La fecha de inicio no puede ser posterior a la fecha fin.',
            'fecha_hasta.after_or_equal'  => 'La fecha fin no puede ser anterior a la fecha de inicio.',
        ];
    }
}
