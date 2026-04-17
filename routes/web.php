<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
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
    Route::get('/citas', [FuncionarioCitaController::class, 'index'])->name('citas');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('/servicios', AdminServicioController::class);
    Route::resource('/usuarios', AdminUsuarioController::class)->only(['index', 'store', 'edit', 'update', 'destroy']);
});

require __DIR__ . '/settings.php';
