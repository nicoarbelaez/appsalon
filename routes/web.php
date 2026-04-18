<?php

use App\Http\Controllers\Admin\HorarioController as AdminHorarioController;
use App\Http\Controllers\Admin\ServicioController as AdminServicioController;
use App\Http\Controllers\Admin\UsuarioController as AdminUsuarioController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Funcionario\CitaController as FuncionarioCitaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ReservaPublicaController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/reservar', [ReservaPublicaController::class, 'create'])->name('reservar.create');
Route::post('/reservar', [ReservaPublicaController::class, 'store'])->name('reservar.store');
Route::get('/reservar/estado/{token}', [ReservaPublicaController::class, 'estado'])->name('reservar.estado');

// Authenticated client routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('/citas', CitaController::class)->only(['index', 'create', 'store', 'destroy']);
});

// Funcionario routes (staff + admin)
Route::middleware(['auth', 'funcionario'])->prefix('funcionario')->name('funcionario.')->group(function () {
    Route::post('/citas/preview', [FuncionarioCitaController::class, 'preview'])->name('citas.preview');
    Route::post('/citas/revalidate', [FuncionarioCitaController::class, 'revalidate'])->name('citas.revalidate');
    Route::post('/citas/import-rows', [FuncionarioCitaController::class, 'importRows'])->name('citas.import-rows');
    Route::get('/citas/export', [FuncionarioCitaController::class, 'export'])->name('citas.export');
    Route::get('/citas/import/template', [FuncionarioCitaController::class, 'importTemplate'])->name('citas.import.template');
    Route::post('/citas/import', [FuncionarioCitaController::class, 'import'])->name('citas.import');
    Route::get('/citas', [FuncionarioCitaController::class, 'index'])->name('citas');
    Route::post('/citas', [FuncionarioCitaController::class, 'store'])->name('citas.store');
    Route::patch('/citas/{cita}', [FuncionarioCitaController::class, 'update'])->name('citas.update');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', fn () => redirect()->route('dashboard'))->name('dashboard');
    Route::post('/servicios/preview', [AdminServicioController::class, 'preview'])->name('servicios.preview');
    Route::post('/servicios/revalidate', [AdminServicioController::class, 'revalidate'])->name('servicios.revalidate');
    Route::post('/servicios/import-rows', [AdminServicioController::class, 'importRows'])->name('servicios.import-rows');
    Route::get('/servicios/export', [AdminServicioController::class, 'export'])->name('servicios.export');
    Route::get('/servicios/import/template', [AdminServicioController::class, 'importTemplate'])->name('servicios.import.template');
    Route::post('/servicios/import', [AdminServicioController::class, 'import'])->name('servicios.import');
    Route::post('/servicios/bulk-destroy', [AdminServicioController::class, 'bulkDestroy'])->name('servicios.bulk-destroy');
    Route::post('/servicios/bulk-toggle', [AdminServicioController::class, 'bulkToggle'])->name('servicios.bulk-toggle');
    Route::resource('/servicios', AdminServicioController::class)->except(['show', 'create', 'edit']);
    Route::resource('/usuarios', AdminUsuarioController::class)->only(['index', 'store', 'edit', 'update', 'destroy']);
    Route::get('/horarios', [AdminHorarioController::class, 'index'])->name('horarios.index');
    Route::put('/horarios', [AdminHorarioController::class, 'update'])->name('horarios.update');
});

require __DIR__ . '/settings.php';
