# AppSalon

English · [Español](./README.md)

Booking system for a beauty salon, built with Laravel and Inertia (React). Customers and guests without an account book appointments; staff manage the agenda; the admin controls services, schedules, users and metrics, and any staff member can request PDF reports that are generated in the background.

University project at Universidad Santiago de Cali (USC), built by Nicolas Arbelaez. The user manual with screenshots is in [manual_usuario.md](./manual_usuario.md) (Spanish).

## Features

- Three roles (`cliente`, `funcionario`, `admin`) enforced with middleware per route group.
- Public booking without an account, with appointment status tracking through a token (`/reservar/estado/{token}`).
- Customer dashboard: create and cancel their own appointments.
- Staff agenda: list, create and edit appointments, export to Excel and import from Excel with preview, revalidation and row-by-row import.
- Service catalog for the admin: CRUD, bulk actions (delete and enable or disable), Excel import and export with a template, and MySQL FULLTEXT search.
- User and role management, and opening hours.
- Dashboard with metrics filterable by service and date range (Recharts).
- Asynchronous PDF reports: a queued job builds the file, the UI polls its status and the download uses an expiring signed URL. A scheduled command removes expired reports every day.
- Authentication with Laravel Fortify: registration, email verification, password reset, two-factor authentication with recovery codes and forced password change.
- Profile, security and appearance settings (light and dark).

## Stack

| Layer | Technology |
| --- | --- |
| Backend | PHP ^8.4, Laravel ^13.0, Laravel Fortify ^1.34, Laravel Wayfinder ^0.1.14 |
| Frontend | Inertia.js ^3.0 (Laravel and `@inertiajs/react`), React ^19.2.0, TypeScript ^5.7.2, Vite ^8.0.0 |
| Styling and UI | Tailwind CSS ^4.0.0, Radix UI, lucide-react ^0.475.0, Recharts ^3.8.0 |
| Data | MySQL 8.0 (Docker Compose, with phpMyAdmin); SQLite in tests |
| Documents | barryvdh/laravel-dompdf ^3.1, maatwebsite/excel ^3.1 |
| Quality | Pest ^4.6, Laravel Pint ^1.27, ESLint, Prettier, GitHub Actions |

## Requirements

- PHP 8.4 and Composer.
- Node.js 22 and npm (CI uses Node 22).
- Docker, for MySQL and phpMyAdmin.
- Optional: Laravel Herd to serve the app at `http://app-salon.test`.

## Getting started

```bash
git clone https://github.com/nicoarbelaez/appsalon.git
cd appsalon
composer install
npm install
cp .env.example .env
php artisan key:generate
docker compose up -d
```

`.env.example` ships configured for SQLite. To use the Docker MySQL, change these variables in `.env`; the password is the `MYSQL_ROOT_PASSWORD` value from `docker-compose.yml`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=appsalon
DB_USERNAME=root
DB_PASSWORD=<MYSQL_ROOT_PASSWORD from docker-compose.yml>
```

Create the tables and demo data:

```bash
php artisan migrate --seed
```

The seeder creates demo users (admin, staff and customer), services and schedules. See `database/seeders/DatabaseSeeder.php` for the data, and use it for development only.

Start the server, the queue and Vite in one terminal:

```bash
composer run dev
```

PDF reports need the queue worker (`queue:listen`), which `composer run dev` already includes. phpMyAdmin runs at <http://localhost:8080>.

## Scripts

| Command | What it does |
| --- | --- |
| `composer run dev` | `php artisan serve`, `queue:listen` and Vite in parallel |
| `composer run setup` | Installs dependencies, creates `.env`, generates the key, migrates and builds |
| `composer test` | Clears config, runs Pint in check mode, then Pest |
| `composer lint` | Formats PHP with Pint |
| `composer ci:check` | ESLint, Prettier, `tsc --noEmit` and the tests |
| `npm run dev` / `npm run build` | Vite in development or production build |
| `npm run lint` / `npm run format` | ESLint and Prettier on the frontend |
| `npm run types:check` | TypeScript type check |
| `php artisan pail` | Live logs |

## Structure

```text
app/
  Http/Controllers/        CitaController, ReservaPublicaController, Admin/, Funcionario/, Settings/
  Http/Middleware/         AdminMiddleware, FuncionarioMiddleware, CheckPasswordChange
  Reportes/                Actions and DTOs for PDF reports
  Jobs/                    GenerarReportePdfJob
  Imports/ Exports/        Excel for appointments and services
  Models/                  User, Servicio, Cita, CitaServicio, Horario, ReportePdf
resources/js/
  pages/                   admin, agenda, auth, citas, reportes, reservar, settings
  components/ hooks/ layouts/
routes/                    web.php, settings.php, console.php (daily report cleanup)
database/                  migrations, seeders
tests/Feature/             Auth, Dashboard, Reportes, Settings
```

Architecture with diagrams: [docs/architecture.en.md](./docs/architecture.en.md).

## Main routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Home with services |
| `/reservar`, `/reservar/estado/{token}` | Public | Guest booking and tracking |
| `/register`, `/login` | Public | Sign up and sign in |
| `/dashboard`, `/citas` | Authenticated | Dashboard and own appointments |
| `/funcionario/*` | Staff and admin | Agenda and reports |
| `/admin/*` | Admin | Services, users and schedules |

## Tests and CI

Pest feature tests cover authentication (including two-factor), dashboard, PDF reports and settings. The `tests.yml` (PHP 8.4, Node 22) and `lint.yml` workflows run on GitHub Actions. Tests use in-memory SQLite.

```bash
php artisan test
php artisan test --filter=TestName
```

## Troubleshooting

- **"No application encryption key"**: run `php artisan key:generate`.
- **Database connection error**: check that Docker is running (`docker compose ps`) and the credentials in `.env`.
- **`app-salon.test` does not load**: confirm Laravel Herd is running and the site is registered.
- **Frontend changes do not show**: keep `npm run dev` running (or use `composer run dev`).
- **A PDF report stays on "procesando"**: the queue worker is missing; start `php artisan queue:listen`.

Useful commands: `php artisan cache:clear`, `php artisan config:clear`, `php artisan migrate:status`, `docker compose down`.
