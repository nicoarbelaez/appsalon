<?php

use App\Jobs\GenerarReportePdfJob;
use App\Models\ReportePdf;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

// ── Autorización ──────────────────────────────────────────────────────────────

test('cliente no puede acceder a reportes', function () {
    $cliente = User::factory()->create(['rol' => 'cliente']);

    $this->actingAs($cliente)
        ->get('/funcionario/reportes')
        ->assertForbidden();
});

test('funcionario puede ver la página de reportes', function () {
    $funcionario = User::factory()->create(['rol' => 'funcionario']);

    $this->actingAs($funcionario)
        ->get('/funcionario/reportes')
        ->assertOk();
});

// ── Solicitud de generación ───────────────────────────────────────────────────

test('funcionario puede solicitar un reporte de citas', function () {
    Queue::fake();

    $funcionario = User::factory()->create(['rol' => 'funcionario']);

    $response = $this->actingAs($funcionario)
        ->postJson('/funcionario/reportes/solicitar', [
            'tipo'        => 'citas',
            'fecha_desde' => '2026-01-01',
            'fecha_hasta' => '2026-12-31',
        ]);

    $response->assertStatus(202)
             ->assertJsonStructure(['reporte_id', 'estado', 'cached']);

    Queue::assertPushed(GenerarReportePdfJob::class);

    $this->assertDatabaseHas('reportes_pdf', [
        'usuarioId' => $funcionario->id,
        'tipo'      => 'citas',
        'estado'    => 'pendiente',
    ]);
});

test('solicitud con tipo inválido es rechazada', function () {
    $funcionario = User::factory()->create(['rol' => 'funcionario']);

    $this->actingAs($funcionario)
        ->postJson('/funcionario/reportes/solicitar', ['tipo' => 'invalido'])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['tipo']);
});

// ── Polling de estado ─────────────────────────────────────────────────────────

test('funcionario puede consultar el estado de su reporte', function () {
    $funcionario = User::factory()->create(['rol' => 'funcionario']);

    $reporte = ReportePdf::factory()->create([
        'usuarioId' => $funcionario->id,
        'estado'    => 'procesando',
    ]);

    $this->actingAs($funcionario)
        ->getJson("/funcionario/reportes/{$reporte->id}/estado")
        ->assertOk()
        ->assertJsonFragment(['estado' => 'procesando']);
});

test('funcionario no puede consultar estado de reporte ajeno', function () {
    $funcionario = User::factory()->create(['rol' => 'funcionario']);
    $otro        = User::factory()->create(['rol' => 'funcionario']);

    $reporte = ReportePdf::factory()->create(['usuarioId' => $otro->id]);

    $this->actingAs($funcionario)
        ->getJson("/funcionario/reportes/{$reporte->id}/estado")
        ->assertForbidden();
});

// ── Descarga ──────────────────────────────────────────────────────────────────

test('descarga sin URL firmada es rechazada', function () {
    $funcionario = User::factory()->create(['rol' => 'funcionario']);

    $reporte = ReportePdf::factory()->listo()->create([
        'usuarioId' => $funcionario->id,
    ]);

    $this->actingAs($funcionario)
        ->get("/funcionario/reportes/{$reporte->id}/descargar")
        ->assertForbidden();
});

// ── Generación del PDF (mock dompdf) ──────────────────────────────────────────

test('la action genera el PDF y actualiza el registro a listo', function () {
    Storage::fake('local');

    $mockPdf = Mockery::mock();
    $mockPdf->shouldReceive('setPaper')->once()->withArgs(['a4', 'portrait'])->andReturnSelf();
    $mockPdf->shouldReceive('save')->once()->andReturn(null);

    Pdf::shouldReceive('loadView')
        ->once()
        ->withArgs(fn($view) => $view === 'reportes.citas')
        ->andReturn($mockPdf);

    $funcionario = User::factory()->create(['rol' => 'funcionario']);

    $reporte = ReportePdf::factory()->create([
        'usuarioId' => $funcionario->id,
        'tipo'      => 'citas',
        'estado'    => 'pendiente',
        'filtros'   => ['tipo' => 'citas'],
    ]);

    $action = app(\App\Reportes\Actions\GenerarPdfAction::class);
    $action->execute($reporte);

    $reporte->refresh();

    expect($reporte->estado)->toBe('listo')
        ->and($reporte->ruta_archivo)->not->toBeNull()
        ->and($reporte->nombre_archivo)->not->toBeNull()
        ->and($reporte->expira_en)->not->toBeNull();
});
