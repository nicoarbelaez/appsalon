<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $titulo ?? 'Reporte AppSalon' }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #111827;
            background: #ffffff;
            line-height: 1.5;
        }

        /* ── Page ─────────────────────────────────────────── */
        @page {
            size: A4;
            margin: 20mm 15mm 22mm 15mm;
        }

        /* ── Footer (fixed, repeats on every page) ────────── */
        .page-footer {
            position: fixed;
            bottom: -15mm;
            left: -15mm;
            right: -15mm;
            padding: 4mm 15mm 2mm;
            border-top: 1px solid #e5e7eb;
            font-size: 8px;
            color: #9ca3af;
            background: #ffffff;
        }
        .page-footer table { width: 100%; border-collapse: collapse; }
        .page-footer td { padding: 0; }
        .page-footer .footer-right { text-align: right; }

        /* ── Header ───────────────────────────────────────── */
        .page-header {
            width: 100%;
            border-collapse: collapse;
            border-bottom: 2px solid #e11d48;
            margin-bottom: 20px;
            padding-bottom: 12px;
        }
        .page-header td { vertical-align: top; padding-bottom: 12px; }
        .brand-name {
            font-size: 18px;
            font-weight: 700;
            color: #e11d48;
            letter-spacing: -0.3px;
        }
        .brand-sub { font-size: 10px; color: #4b5563; margin-top: 2px; }
        .report-meta { text-align: right; }
        .report-title { font-size: 14px; font-weight: 600; color: #111827; }
        .report-subtitle { font-size: 10px; color: #4b5563; margin-top: 3px; }
        .report-date { font-size: 9px; color: #9ca3af; margin-top: 4px; }

        /* ── Summary cards (float-based, dompdf-safe) ──────── */
        .summary-grid { overflow: hidden; margin-bottom: 22px; }
        .summary-grid::after { content: ''; display: table; clear: both; }
        .summary-card {
            float: left;
            margin: 0 1% 10px 0;
            background: #f3f4f6;
            border-radius: 6px;
            padding: 10px 12px;
            text-align: center;
        }
        .summary-card .card-value {
            font-size: 18px;
            font-weight: 700;
            color: #e11d48;
            display: block;
        }
        .summary-card .card-label {
            font-size: 9px;
            color: #4b5563;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin-top: 2px;
        }

        /* ── Data table ───────────────────────────────────── */
        .data-table { width: 100%; border-collapse: collapse; font-size: 10px; }
        .data-table thead tr { background: #e11d48; color: #ffffff; }
        .data-table thead th {
            padding: 8px 10px;
            text-align: left;
            font-weight: 600;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .data-table thead th.text-right { text-align: right; }
        .data-table tbody tr.alt { background: #f3f4f6; }
        .data-table tbody td {
            padding: 7px 10px;
            border-bottom: 1px solid #e5e7eb;
            color: #111827;
        }
        .data-table tbody td.text-right {
            text-align: right;
            font-variant-numeric: tabular-nums;
        }
        .data-table tfoot td {
            padding: 8px 10px;
            font-weight: 600;
            border-top: 2px solid #e11d48;
            background: #fff1f2;
        }
        .data-table tfoot td.text-right { text-align: right; }

        /* ── Badges ───────────────────────────────────────── */
        .badge {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .badge-pendiente  { background: #fef9c3; color: #854d0e; }
        .badge-confirmada { background: #dbeafe; color: #1d4ed8; }
        .badge-completada { background: #dcfce7; color: #166534; }
        .badge-cancelada  { background: #fee2e2; color: #991b1b; }

        /* ── Section title ────────────────────────────────── */
        .section-title {
            font-size: 11px;
            font-weight: 600;
            color: #e11d48;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 20px 0 10px;
            padding-bottom: 4px;
            border-bottom: 1px solid #e5e7eb;
        }

        .empty-state { text-align: center; padding: 30px 0; color: #9ca3af; }

        @media print {
            .no-break { page-break-inside: avoid; }
            .page-break { page-break-after: always; }
        }
    </style>
</head>
<body>

    <div class="page-footer">
        <table>
            <tr>
                <td>AppSalon &copy; {{ date('Y') }} &mdash; Documento confidencial</td>
                <td class="footer-right">Generado el {{ $generado_en }}</td>
            </tr>
        </table>
    </div>

    <table class="page-header">
        <tr>
            <td>
                <div class="brand-name">AppSalon</div>
                <div class="brand-sub">Gesti&oacute;n de citas &middot; Beauty Salon</div>
            </td>
            <td class="report-meta">
                <div class="report-title">{{ $titulo ?? 'Reporte' }}</div>
                @isset($subtitulo)
                    <div class="report-subtitle">{{ $subtitulo }}</div>
                @endisset
            </td>
        </tr>
    </table>

    @yield('contenido')

</body>
</html>
