<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/usuarios/index', [
            'usuarios' => User::orderBy('nombre')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:usuarios',
            'rol' => 'required|in:cliente,funcionario,admin',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            ...$validated,
            'password' => $validated['password'],
            'admin' => $validated['rol'] === 'admin',
            'confirmado' => true,
            'requiere_cambio_password' => true,
        ]);

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    public function edit(User $usuario)
    {
        return Inertia::render('admin/usuarios/edit', [
            'usuario' => $usuario,
        ]);
    }

    public function update(Request $request, User $usuario)
    {
        $validated = $request->validate([
            'rol' => 'required|in:cliente,funcionario,admin',
            'confirmado' => 'boolean',
            'admin' => 'boolean',
        ]);

        $validated['admin'] = $validated['rol'] === 'admin';
        $usuario->update($validated);

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $usuario)
    {
        abort_if($usuario->id === auth()->id(), 403, 'No puedes eliminarte a ti mismo.');
        $usuario->delete();

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }
}
