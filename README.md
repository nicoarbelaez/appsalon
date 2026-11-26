# AppSalon

[English](./README.en.md) · Español

Sistema web de reservas para un salón de belleza, hecho con Laravel e Inertia (React). Clientes y visitantes sin cuenta reservan citas; el personal gestiona la agenda; el administrador controla servicios, horarios, usuarios y métricas, y cualquier funcionario puede pedir reportes en PDF que se generan en segundo plano.

Proyecto universitario de la Universidad Santiago de Cali (USC), construido por Nicolas Arbelaez. El manual de usuario con capturas está en [manual_usuario.md](./manual_usuario.md).

## Funcionalidades

- Tres roles (`cliente`, `funcionario`, `admin`) con middleware por grupo de rutas.
- Reserva pública sin cuenta, con seguimiento del estado de la cita mediante un token (`/reservar/estado/{token}`).
- Panel del cliente: crear y cancelar sus citas.
- Agenda del personal: listar, crear y editar citas, exportar a Excel e importar desde Excel con vista previa, revalidación e importación por filas.
- Catálogo de servicios para el administrador: CRUD, acciones masivas (eliminar y activar o desactivar), importación y exportación con plantilla Excel, y búsqueda MySQL FULLTEXT.
- Administración de usuarios y roles, y horarios de atención.
- Dashboard con métricas filtrables por servicio y rango de fechas (Recharts).
- Reportes PDF asíncronos: un job en cola genera el archivo, la interfaz consulta el estado y la descarga usa una URL firmada que expira. Un comando programado limpia los reportes vencidos cada día.
- Autenticación con Laravel Fortify: registro, verificación de email, recuperación de contraseña, autenticación en dos pasos con códigos de recuperación y cambio de contraseña obligatorio.
- Ajustes de perfil, seguridad y apariencia (claro y oscuro).

## Stack

| Capa | Tecnología |
| --- | --- |
| Backend | PHP ^8.4, Laravel ^13.0, Laravel Fortify ^1.34, Laravel Wayfinder ^0.1.14 |
| Frontend | Inertia.js ^3.0 (Laravel y `@inertiajs/react`), React ^19.2.0, TypeScript ^5.7.2, Vite ^8.0.0 |
| Estilos y UI | Tailwind CSS ^4.0.0, Radix UI, lucide-react ^0.475.0, Recharts ^3.8.0 |
| Datos | MySQL 8.0 (Docker Compose, con phpMyAdmin); SQLite en pruebas |
| Documentos | barryvdh/laravel-dompdf ^3.1, maatwebsite/excel ^3.1 |
| Calidad | Pest ^4.6, Laravel Pint ^1.27, ESLint, Prettier, GitHub Actions |

## Requisitos

- PHP 8.4 y Composer.
- Node.js 22 y npm (la integración continua usa Node 22).
- Docker, para MySQL y phpMyAdmin.
- Opcional: Laravel Herd para servir la app en `http://app-salon.test`.

## Puesta en marcha

```bash
git clone https://github.com/nicoarbelaez/appsalon.git
cd appsalon
composer install
npm install
cp .env.example .env
php artisan key:generate
docker compose up -d
```

`.env.example` viene configurado con SQLite. Para usar el MySQL de Docker, cambia estas variables en `.env`; la contraseña es el valor de `MYSQL_ROOT_PASSWORD` de `docker-compose.yml`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=appsalon
DB_USERNAME=root
DB_PASSWORD=<MYSQL_ROOT_PASSWORD de docker-compose.yml>
```

Crea las tablas y los datos de demostración:

```bash
php artisan migrate --seed
```

El seeder crea usuarios de demostración (administrador, funcionario y cliente), servicios y horarios. Revisa `database/seeders/DatabaseSeeder.php` para ver los datos y úsalos solo en desarrollo.

Levanta el servidor, la cola y Vite en una sola terminal:

```bash
composer run dev
```

Los reportes PDF necesitan el worker de la cola (`queue:listen`), que `composer run dev` ya incluye. phpMyAdmin queda en <http://localhost:8080>.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `composer run dev` | `php artisan serve`, `queue:listen` y Vite en paralelo |
| `composer run setup` | Instala dependencias, crea `.env`, genera la clave, migra y compila |
| `composer test` | Limpia la configuración, corre Pint en modo comprobación y luego Pest |
| `composer lint` | Formatea PHP con Pint |
| `composer ci:check` | ESLint, Prettier, `tsc --noEmit` y las pruebas |
| `npm run dev` / `npm run build` | Vite en desarrollo o compilación de producción |
| `npm run lint` / `npm run format` | ESLint y Prettier sobre el frontend |
| `npm run types:check` | Comprobación de tipos con TypeScript |
| `php artisan pail` | Logs en vivo |

## Estructura

```text
app/
  Http/Controllers/        CitaController, ReservaPublicaController, Admin/, Funcionario/, Settings/
  Http/Middleware/         AdminMiddleware, FuncionarioMiddleware, CheckPasswordChange
  Reportes/                Actions y DTOs de los reportes PDF
  Jobs/                    GenerarReportePdfJob
  Imports/ Exports/        Excel de citas y servicios
  Models/                  User, Servicio, Cita, CitaServicio, Horario, ReportePdf
resources/js/
  pages/                   admin, agenda, auth, citas, reportes, reservar, settings
  components/ hooks/ layouts/
routes/                    web.php, settings.php, console.php (limpieza diaria de reportes)
database/                  migraciones, seeders
tests/Feature/             Auth, Dashboard, Reportes, Settings
```

Arquitectura con diagramas: [docs/architecture.md](./docs/architecture.md).

## Rutas principales

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Inicio con servicios |
| `/reservar`, `/reservar/estado/{token}` | Público | Reserva sin cuenta y seguimiento |
| `/register`, `/login` | Público | Registro e inicio de sesión |
| `/dashboard`, `/citas` | Autenticado | Panel y citas propias |
| `/funcionario/*` | Funcionario y admin | Agenda y reportes |
| `/admin/*` | Admin | Servicios, usuarios y horarios |

## Pruebas y CI

Hay pruebas de funcionalidad con Pest para autenticación (incluida la autenticación en dos pasos), dashboard, reportes PDF y ajustes. Los workflows `tests.yml` (PHP 8.4, Node 22) y `lint.yml` corren en GitHub Actions. Las pruebas usan SQLite en memoria.

```bash
php artisan test
php artisan test --filter=NombreDeLaPrueba
```

## Solución de problemas

- **"No application encryption key"**: ejecuta `php artisan key:generate`.
- **Error de conexión a la base de datos**: comprueba que Docker esté corriendo (`docker compose ps`) y las credenciales en `.env`.
- **`app-salon.test` no carga**: confirma que Laravel Herd está corriendo y el sitio registrado.
- **El frontend no refleja los cambios**: mantén `npm run dev` corriendo (o usa `composer run dev`).
- **El reporte PDF se queda en "procesando"**: falta el worker de la cola; inicia `php artisan queue:listen`.

Comandos útiles: `php artisan cache:clear`, `php artisan config:clear`, `php artisan migrate:status`, `docker compose down`.
