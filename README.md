# AppSalon - Sistema de Gestión de Citas para Salón de Belleza

Aplicación web para gestionar citas, servicios y clientes de un salón de belleza. Permite a clientes reservar citas y a administradores gestionar todo el negocio.

---

## Tecnologías utilizadas

| Tecnología | Para qué sirve |
|------------|---------------|
| **Laravel 13+** | Framework PHP — lógica del servidor, rutas, base de datos |
| **MySQL (Docker)** | Base de datos — guarda usuarios, citas, servicios |
| **React + Inertia.js** | Interfaz de usuario interactiva sin recargar la página |
| **Tailwind CSS 4** | Estilos y diseño visual |
| **Pest** | Pruebas automatizadas |
| **Laravel Herd** | Servidor local de desarrollo |
| **Docker** | Contenedor para la base de datos MySQL |

---

## Requisitos previos

Antes de empezar necesitas tener instalado:

- [PHP 8.2+](https://www.php.net/) (verificar con `php -v`)
- [Composer](https://getcomposer.org/) — gestor de paquetes PHP
- [Node.js 20+](https://nodejs.org/) — para el frontend (verificar con `node -v`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — para la base de datos
- [Laravel Herd](https://herd.laravel.com/) — servidor local

---

## Instalación paso a paso

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/app-salon.git
cd app-salon
```

### Paso 2 — Instalar dependencias de PHP

```bash
composer install
```

> Esto descarga todas las librerías de Laravel necesarias. Puede tardar unos minutos.

### Paso 3 — Instalar dependencias de JavaScript

```bash
npm install
```

> Esto descarga React, Tailwind y demás librerías del frontend.

### Paso 4 — Configurar variables de entorno

```bash
cp .env.example .env
php artisan key:generate
```

Abre el archivo `.env` y verifica que la configuración de base de datos sea:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=appsalon
DB_USERNAME=root
DB_PASSWORD=
```

> El archivo `.env` contiene las credenciales y configuración del proyecto. **Nunca subas este archivo a GitHub.**

### Paso 5 — Iniciar la base de datos con Docker

```bash
docker compose up -d
```

> Esto inicia MySQL en un contenedor Docker. La bandera `-d` lo ejecuta en segundo plano. Espera unos segundos antes de continuar.

Puedes verificar que está corriendo con:

```bash
docker compose ps
```

### Paso 6 — Crear las tablas y datos de prueba

```bash
php artisan migrate --seed
```

> `migrate` crea todas las tablas en la base de datos. `--seed` inserta datos de prueba (usuarios y servicios).

### Paso 7 — Compilar el frontend

Para desarrollo (se recarga automáticamente al guardar cambios):

```bash
npm run dev
```

Para producción (compilación optimizada):

```bash
npm run build
```

### Paso 8 — Abrir la aplicación

Si usas Laravel Herd, la aplicación estará disponible en:

```
http://app-salon.test
```

Para ver y gestionar la base de datos visualmente:

```
http://localhost:8080  (phpMyAdmin)
```

---

## Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@appsalon.com | password |
| Cliente | cliente@appsalon.com | password |

---

## Estructura del proyecto

```
app-salon/
├── app/
│   ├── Http/
│   │   ├── Controllers/       # Lógica de cada sección (Auth, Servicios, Citas, Admin)
│   │   └── Middleware/        # Filtros de acceso (ej: solo admins)
│   ├── Models/
│   │   ├── User.php           # Modelo de usuario (tabla: usuarios)
│   │   ├── Servicio.php       # Modelo de servicio (tabla: servicios)
│   │   ├── Cita.php           # Modelo de cita (tabla: citas)
│   │   └── CitaServicio.php   # Relación cita-servicio (tabla: citasServicios)
│   └── Actions/Fortify/
│       └── CreateNewUser.php  # Lógica de registro de usuarios
├── resources/
│   └── js/
│       └── pages/
│           ├── welcome.tsx    # Página principal pública
│           ├── dashboard.tsx  # Panel del cliente
│           ├── auth/          # Login, registro, recuperar contraseña
│           └── settings/      # Configuración de perfil
├── routes/
│   ├── web.php                # Rutas de la aplicación web
│   └── api.php                # Rutas de la API REST
├── database/
│   ├── migrations/            # Definición de tablas
│   └── seeders/               # Datos de prueba
└── docker-compose.yml         # Configuración de Docker (MySQL + phpMyAdmin)
```

---

## Base de datos

El sistema usa 4 tablas principales:

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Clientes y administradores del sistema |
| `servicios` | Catálogo de servicios con precio y duración |
| `citas` | Reservas por fecha y hora |
| `citasServicios` | Qué servicios incluye cada cita |

---

## Funcionalidades

### Para clientes
- Registro y login con confirmación por email
- Ver catálogo de servicios disponibles
- Reservar citas eligiendo fecha, hora y servicios
- Ver y cancelar sus propias citas

### Para administradores
- Gestionar servicios (crear, editar, eliminar)
- Ver todas las citas del día
- Gestionar usuarios y roles
- Dashboard con estadísticas
- Reportes y exportación de datos (semana 16)

---

## Rutas principales

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Página de inicio con servicios |
| `/register` | Público | Registro de nuevo cliente |
| `/login` | Público | Inicio de sesión |
| `/dashboard` | Cliente autenticado | Panel personal |
| `/admin/*` | Solo administradores | Panel de administración |
| `/api/*` | Token Sanctum | API REST |

---

## Comandos útiles

```bash
# Ver logs de la aplicación
php artisan pail

# Limpiar caché
php artisan cache:clear
php artisan config:clear

# Ejecutar pruebas
php artisan test

# Ejecutar una prueba específica
php artisan test --filter=NombreDeLaPrueba

# Detener Docker
docker compose down

# Ver estado de migraciones
php artisan migrate:status
```

---

## Solución de problemas comunes

**Error: "No application encryption key"**
```bash
php artisan key:generate
```

**Error de conexión a base de datos**
- Verifica que Docker esté corriendo: `docker compose ps`
- Verifica las credenciales en `.env`

**La página no carga en app-salon.test**
- Asegúrate de que Laravel Herd esté corriendo y el sitio esté registrado

**Cambios en el frontend no se ven**
- Asegúrate de tener `npm run dev` corriendo en otra terminal

---

## Cronograma del proyecto

| Semana | Meta |
|--------|------|
| 7-8 | Base de datos y conexión PHP-MySQL |
| 9-10 | Sistema de usuarios, login/register, roles |
| **11** | **Entrega intermedia** — Auth + CRUD servicios + UI básica |
| 12-14 | Sistema de citas completo + API + reportes |
| 15 | Revisión, optimización y documentación |
| **16** | **Entrega final** — Sistema completo + presentación |
