<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ServicioController extends Controller
{
    public function index(Request $request)
    {
        $search = trim($request->query('search', ''));
        $activo = $request->query('activo', '');

        $query = Servicio::query();

        if ($activo === '1') {
            $query->where('activo', true);
        } elseif ($activo === '0') {
            $query->where('activo', false);
        }

        if (strlen($search) >= 3) {
            $query->whereRaw(
                'MATCH(nombre, descripcion) AGAINST (? IN NATURAL LANGUAGE MODE)
                 OR nombre LIKE ? OR descripcion LIKE ?',
                [$search, "%{$search}%", "%{$search}%"]
            )->orderByRaw(
                'MATCH(nombre, descripcion) AGAINST (? IN NATURAL LANGUAGE MODE) DESC',
                [$search]
            );
        } else {
            $query->orderBy('nombre');
        }

        return Inertia::render('admin/servicios/index', [
            'servicios' => $query->get(),
            'filters'   => ['search' => $search, 'activo' => $activo],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:60',
            'precio'      => 'required|numeric|min:0|max:999.99',
            'descripcion' => 'nullable|string|max:500',
            'duracion'    => 'required|integer|min:15|max:480',
            'activo'      => 'boolean',
        ]);

        Servicio::create($validated);

        return back()->with('success', 'Servicio creado correctamente.');
    }

    public function update(Request $request, Servicio $servicio)
    {
        $validated = $request->validate([
            'nombre'      => 'required|string|max:60',
            'precio'      => 'required|numeric|min:0|max:999.99',
            'descripcion' => 'nullable|string|max:500',
            'duracion'    => 'required|integer|min:15|max:480',
            'activo'      => 'boolean',
        ]);

        $servicio->update($validated);

        return back()->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy(Servicio $servicio)
    {
        try {
            $servicio->delete();
        } catch (\Illuminate\Database\QueryException $e) {
            return back()->withErrors(['ids' => 'El servicio está en uso y no puede eliminarse.']);
        }

        return back()->with('success', 'Servicio eliminado correctamente.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids'       => 'required_without:selectAll|array',
            'ids.*'     => ['integer', Rule::exists('servicios', 'id')],
            'selectAll' => 'boolean',
            'search'    => 'nullable|string',
            'activo'    => 'nullable|string|in:0,1,',
        ]);

        try {
            if ($request->boolean('selectAll')) {
                $this->buildFilteredQuery($request)->delete();
            } else {
                Servicio::whereIn('id', $request->ids)->delete();
            }
        } catch (\Illuminate\Database\QueryException $e) {
            return back()->withErrors(['ids' => 'Algunos servicios están en uso y no pueden eliminarse.']);
        }

        return back()->with('success', 'Servicios eliminados.');
    }

    public function bulkToggle(Request $request)
    {
        $request->validate([
            'ids'           => 'required_without:selectAll|array',
            'ids.*'         => ['integer', Rule::exists('servicios', 'id')],
            'activo'        => 'required|boolean',
            'selectAll'     => 'boolean',
            'search'        => 'nullable|string',
            'activo_filter' => 'nullable|string|in:0,1,',
        ]);

        $query = $request->boolean('selectAll')
            ? $this->buildFilteredQuery($request, filterKey: 'activo_filter')
            : Servicio::whereIn('id', $request->ids);

        $query->update(['activo' => $request->boolean('activo')]);

        return back()->with('success', 'Servicios actualizados.');
    }

    private function buildFilteredQuery(Request $request, string $filterKey = 'activo'): Builder
    {
        $search = trim($request->input('search', ''));
        $activo = $request->input($filterKey, '');
        $query = Servicio::query();

        if ($activo === '1') {
            $query->where('activo', true);
        } elseif ($activo === '0') {
            $query->where('activo', false);
        }

        if (strlen($search) >= 3) {
            $query->whereRaw(
                'MATCH(nombre, descripcion) AGAINST (? IN NATURAL LANGUAGE MODE)
                 OR nombre LIKE ? OR descripcion LIKE ?',
                [$search, "%{$search}%", "%{$search}%"]
            );
        }

        return $query;
    }
}
