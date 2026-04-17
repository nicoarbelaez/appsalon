<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Servicio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServicioController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/servicios/index', [
            'servicios' => Servicio::orderBy('nombre')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/servicios/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:60',
            'precio' => 'required|numeric|min:0|max:999.99',
            'descripcion' => 'nullable|string|max:500',
            'duracion' => 'required|integer|min:15|max:480',
            'activo' => 'boolean',
        ]);

        Servicio::create($validated);

        return redirect()->route('admin.servicios.index')
            ->with('success', 'Servicio creado correctamente.');
    }

    public function edit(Servicio $servicio)
    {
        return Inertia::render('admin/servicios/edit', [
            'servicio' => $servicio,
        ]);
    }

    public function update(Request $request, Servicio $servicio)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:60',
            'precio' => 'required|numeric|min:0|max:999.99',
            'descripcion' => 'nullable|string|max:500',
            'duracion' => 'required|integer|min:15|max:480',
            'activo' => 'boolean',
        ]);

        $servicio->update($validated);

        return redirect()->route('admin.servicios.index')
            ->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy(Servicio $servicio)
    {
        $servicio->delete();

        return redirect()->route('admin.servicios.index')
            ->with('success', 'Servicio eliminado correctamente.');
    }
}
