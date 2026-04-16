# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**AppSalon** — beauty salon appointment management system.  
Stack: Laravel 13+, MySQL (Docker), React + Inertia.js, Tailwind CSS 4, Pest.

## Dev Environment

MySQL runs in Docker. Laravel app served by **Laravel Herd** (no `php artisan serve` needed).

```bash
# Start DB
docker compose up -d

# Install deps (first time)
composer install && npm install

# Migrate + seed
php artisan migrate --seed

# Frontend watch
npm run dev

# Run tests
php artisan test
php artisan test --filter=TestClassName
```

App URL: http://app-salon.test (Herd)  
phpMyAdmin: http://localhost:8080

## Database Schema

Tables (Spanish names — match exactly):

| Table | Key columns |
|-------|-------------|
| `usuarios` | id, nombre(60), apellido(60), email(unique,30), password(60), telefono(10), admin(bool), confirmado(bool), token(15) |
| `servicios` | id, nombre(60), precio(decimal 5,2), descripcion(text), duracion(int,min), activo(bool) |
| `citas` | id, fecha(date), hora(time), usuarioId(FK→usuarios), total(decimal 6,2), estado(enum) |
| `citasServicios` | id, citaId(FK→citas), servicioId(FK→servicios) |

## Architecture

```
app/
├── Actions/Fortify/
│   └── CreateNewUser.php     # registration — uses nombre/apellido
├── Http/
│   ├── Controllers/
│   │   ├── HomeController.php
│   │   ├── Settings/ProfileController.php
│   │   └── (AuthController, ServiceController, AppointmentController, AdminController — to add)
│   └── Middleware/
│       └── (AdminMiddleware — to add)
├── Concerns/
│   └── ProfileValidationRules.php  # uses nombre/apellido rules
├── Models/
│   ├── User.php          (tabla: usuarios)
│   ├── Servicio.php      (tabla: servicios)
│   ├── Cita.php          (tabla: citas)
│   └── CitaServicio.php  (tabla: citasServicios)
resources/js/
├── pages/
│   ├── welcome.tsx        # public home — shows servicios from DB
│   ├── dashboard.tsx
│   ├── auth/              # login, register, etc.
│   └── settings/
routes/
├── web.php    # HomeController + auth + dashboard
└── api.php    # REST (Sanctum — Week 16)
```

## Route Groups

- `/` — public (HomeController → shows servicios)
- `/dashboard` — authenticated clients
- `/admin/*` — AdminMiddleware required (to add)
- `/api/*` — Sanctum token auth (to add Week 16)

## Key Constraints

- `usuarios` table — no `name` or `email_verified_at` columns (removed). Use `nombre`/`apellido`/`confirmado` instead.
- Appointments cannot overlap for same time slot — enforce in AppointmentController.
- Passwords: bcrypt via `Hash::make()`.
- Admin flag: `usuarios.admin = 1`.
- All DB queries via Eloquent (no raw queries unless reporting aggregates).

## Test Credentials (seeded)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@appsalon.com | password |
| Client | cliente@appsalon.com | password |

## Deliverables Timeline

- **Week 11**: Auth + Services CRUD + basic UI
- **Week 16**: Full appointments + admin dashboard + API + PDF/CSV reports
