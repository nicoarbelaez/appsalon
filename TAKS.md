**Proyecto Final: Sistema de Citas AppSalon**

**Especificaciones Técnicas y Criterios de Evaluación**

**Información General del Proyecto**

**Nombre**: AppSalon - Sistema de Gestión de Citas para Salón de Belleza  
**Tipo**: Aplicación Web Full-Stack  
**Duración**: Semanas 7-16 (10 semanas)  
**Evaluaciones**: Semana 11 (Entrega Intermedia) y Semana 16 (Entrega Final)

**Opciones de Tecnología**:

- **Opción A**: Laravel + MySQL + Blade (Recomendado - será explicado en clase)
- **Opción A**: Laravel + MySQL(docker) + Blade + Tailwindcss

**DESCRIPCIÓN DEL PROYECTO**

**Contexto del Negocio**

AppSalon es un sistema web para la gestión integral de un salón de belleza que permite:

- **Clientes**: Registrarse, autenticarse, reservar citas y gestionar sus servicios
- **Administradores**: Gestionar servicios, citas, clientes y generar reportes
- **Sistema**: Manejar la lógica de negocio, seguridad y persistencia de datos

**Funcionalidades Core del Sistema**

**Módulo de Autenticación**

- Registro de usuarios con validación de email
- Login/Logout seguro
- Recuperación de contraseña por email
- Confirmación de cuenta por token
- Gestión de sesiones

**Módulo de Servicios**

- Catálogo de servicios con precios
- CRUD de servicios (solo administradores)
- Visualización pública de servicios

**Módulo de Citas**

- Reserva de citas por fecha y hora
- Selección múltiple de servicios
- Gestión de disponibilidad
- CRUD de citas

**Módulo de Administración**

- Dashboard con estadísticas
- Gestión de usuarios
- Gestión de citas del día
- Reportes básicos

**ENTREGA INTERMEDIA - SEMANA 11**

**Objetivo**

Prototipo funcional que demuestre el dominio de los conceptos vistos hasta la semana 10: formularios, capa de datos, capa servidor, roles de usuario y seguridad básica.

**Requerimientos Mínimos Obligatorios**

**1\. Base de Datos (20 puntos)**

- **Estructura de tablas** correctamente implementada:

usuarios (id, nombre, apellido, email, password, telefono, admin, confirmado, token)

servicios (id, nombre, precio)

citas (id, fecha, hora, usuarioId)

citasServicios (id, citaId, servicioId)

- **Relaciones** entre tablas con claves foráneas
- **Datos de prueba** insertados (mínimo 5 servicios, 2 usuarios)
- **Integridad referencial** configurada

**2\. Autenticación y Seguridad (25 puntos)**

- **Registro de usuarios** con validación de campos
- **Login/Logout** funcional
- **Hash de contraseñas** (password_hash en PHP o bcrypt en Laravel)
- **Validación de formularios** del lado servidor
- **Protección contra XSS** básica (htmlspecialchars o escape en Laravel)
- **Sesiones** implementadas correctamente

**3\. Gestión de Servicios (20 puntos)**

- **Visualización pública** de servicios disponibles
- **CRUD de servicios** para administradores
- **Validación de datos** al crear/editar servicios
- **Interfaz responsiva** para mostrar servicios

**4\. Arquitectura y Código (20 puntos)**

- **Separación de responsabilidades** (Modelo-Vista-Controlador)
- **Conexión a base de datos** bien implementada
- **Manejo de errores** básico
- **Código limpio** y comentado
- **Estructura de carpetas** organizada

**5\. Interfaz de Usuario (15 puntos)**

- **Diseño responsive** básico
- **Navegación intuitiva**
- **Formularios funcionales** con validación visual
- **Mensajes de estado** (éxito, error)

**Entregables Semana 11**

**Documentación Requerida**

- **README.md** con:
  - Instrucciones de instalación
  - Credenciales de usuarios de prueba
  - Descripción de funcionalidades implementadas
  - Tecnologías utilizadas
- **Script SQL** de la base de datos completo
- **Manual de usuario básico** (PDF, máximo 5 páginas)

**Código Fuente**

- Repositorio completo (GitHub recomendado)
- Código documentado y limpio
- Archivo de configuración de ejemplo

**Criterios de Evaluación Semana 11**

**Excelente (4.5-5.0)**

- Todos los requerimientos implementados correctamente
- Código bien estructurado y documentado
- Interfaz atractiva y funcional
- Manejo robusto de errores
- Funcionalidades adicionales implementadas

**Bueno (4.0-4.4)**

- Requerimientos principales implementados
- Código funcional con estructura clara
- Interfaz básica pero completa
- Manejo básico de errores

**Satisfactorio (3.5-3.9)**

- Funcionalidades core implementadas
- Código funcional con algunos problemas menores
- Interfaz básica
- Validaciones mínimas implementadas

**Insuficiente (<3.5)**

- Funcionalidades incompletas o no funcionan
- Código con errores significativos
- Problemas de seguridad evidentes
- Documentación insuficiente

**ENTREGA FINAL - SEMANA 16**

**Objetivo**

Sistema completo y funcional que incluya todas las funcionalidades avanzadas: APIs, reportes, exportación de datos.

**Requerimientos Adicionales Obligatorios**

**6\. Sistema de Citas Completo (40 puntos)**

- **Reserva de citas** con calendario interactivo
- **Selección múltiple** de servicios por cita
- **Validación de disponibilidad** (no permitir sobreposición)
- **Gestión de horarios** del salón
- **Cancelación y modificación** de citas
- **Notificaciones** de confirmación (email básico)

**7\. Panel de Administración Avanzado (20 puntos)**

- **Dashboard** con estadísticas (citas del día, ingresos, clientes)
- **Gestión completa de usuarios** (activar/desactivar, roles)
- **Vista de agenda** del día/semana
- **Búsqueda y filtros** en citas y usuarios
- **Gestión de disponibilidad** horaria

**8\. API y Funcionalidades Modernas (20 puntos)**

- **API REST** básica para consultar servicios y citas
- **Respuestas JSON** estructuradas
- **Autenticación API** (token básico o Laravel Sanctum)
- **Endpoints documentados**:
  - GET /api/servicios
  - GET /api/citas/usuario/{id}
  - POST /api/citas
  - PUT /api/citas/{id}

**9\. Reportes y Exportación (20 puntos)**

- **Reporte de citas** por período
- **Reporte de ingresos** por servicio/período
- **Exportación a PDF** de al menos un reporte
- **Exportación a Excel/CSV** de datos
- **Gráficas básicas** (Chart.js o similar)

**Entregables Finales Semana 16**

**Documentación Completa**

- **Manual técnico**:
  - Arquitectura del sistema
  - Diagrama de base de datos
  - Documentación de API
- **Manual de usuario básico** (PDF, máximo 5 páginas)

**Código y Sistema**

- Sistema desplegado y funcionando (hosting o servidor local)
- Código fuente completo y documentado
- Base de datos con datos de prueba realistas

**Criterios de Evaluación Final**

**Componentes de Evaluación**

- **Sistema funcionando (40%)**: Todas las funcionalidades operativas
- **Código y arquitectura (25%)**: Calidad, estructura, documentación
- **Documentación (20%)**: Completitud y claridad
- **Presentación oral (15%)**: Demostración y explicación técnica

**Escala de Calificación**

**Excelente (4.6-5.0)**

- Sistema completo con funcionalidades extras
- Código profesional y bien documentado
- Documentación completa y detallada
- Presentación clara y técnicamente sólida
- Demostración fluida sin errores

**Sobresaliente (4.1-4.5)**

- Todos los requerimientos implementados
- Código bien estructurado
- Documentación adecuada
- Buena presentación técnica

**Bueno (3.6-4.0)**

- Funcionalidades principales completas
- Código funcional con estructura clara
- Documentación básica pero completa
- Presentación satisfactoria

**Satisfactorio (3.0-3.5)**

- Funcionalidades core implementadas
- Código funcional con algunos issues
- Documentación mínima
- Presentación básica

**Insuficiente (<3.0)**

- Sistema incompleto o no funcional
- Código con errores significativos
- Documentación insuficiente
- Presentación inadecuada

**ESPECIFICACIONES TÉCNICAS**

**Arquitectura Requerida**

**Opción A: Laravel (Recomendado)**

app/

├── Http/Controllers/

│ ├── AuthController.php

│ ├── ServiceController.php

│ ├── AppointmentController.php

│ └── AdminController.php

├── Models/

│ ├── User.php

│ ├── Service.php

│ ├── Appointment.php

│ └── AppointmentService.php

├── Middleware/

│ └── AdminMiddleware.php

└── Requests/

├── LoginRequest.php

├── RegisterRequest.php

└── AppointmentRequest.php

resources/views/

├── auth/

├── services/

├── appointments/

└── admin/

routes/

├── web.php

└── api.php

database/

├── migrations/

└── seeders/

**Base de Datos Requerida**

CREATE DATABASE appsalon_mvc_php;

_\-- Tabla usuarios_

CREATE TABLE usuarios (

id INT PRIMARY KEY AUTO_INCREMENT,

nombre VARCHAR(60) NOT NULL,

apellido VARCHAR(60) NOT NULL,

email VARCHAR(30) UNIQUE NOT NULL,

password VARCHAR(60) NOT NULL,

telefono VARCHAR(10),

admin TINYINT(1) DEFAULT 0,

confirmado TINYINT(1) DEFAULT 0,

token VARCHAR(15),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

);

_\-- Tabla servicios_

CREATE TABLE servicios (

id INT PRIMARY KEY AUTO_INCREMENT,

nombre VARCHAR(60) NOT NULL,

precio DECIMAL(5,2) NOT NULL,

descripcion TEXT,

duracion INT DEFAULT 60,

activo TINYINT(1) DEFAULT 1,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

_\-- Tabla citas_

CREATE TABLE citas (

id INT PRIMARY KEY AUTO_INCREMENT,

fecha DATE NOT NULL,

hora TIME NOT NULL,

usuarioId INT,

total DECIMAL(6,2),

estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (usuarioId) REFERENCES usuarios(id) ON DELETE SET NULL

);

_\-- Tabla intermedia citas-servicios_

CREATE TABLE citasServicios (

id INT PRIMARY KEY AUTO_INCREMENT,

citaId INT,

servicioId INT,

FOREIGN KEY (citaId) REFERENCES citas(id) ON DELETE CASCADE,

FOREIGN KEY (servicioId) REFERENCES servicios(id) ON DELETE CASCADE

);

**Seguridad Mínima Requerida**

**Validaciones**

- Email único y formato válido
- Contraseña mínimo 6 caracteres
- Sanitización de inputs (htmlspecialchars)
- Validación de fechas y horas de citas
- CSRF protection (Laravel automático, PHP manual)

**Autenticación**

- Passwords hasheadas (bcrypt/password_hash)
- Sesiones seguras
- Logout completo
- Verificación de permisos admin

**Base de Datos**

- Prepared statements obligatorio
- Validación de tipos de datos
- Llaves foráneas con integridad referencial

**CRONOGRAMA DE DESARROLLO**

**Semanas 7-8: Fundamentos**

- **Semana 7**: Diseño e implementación de base de datos
- **Semana 8**: Conexión PHP-MySQL, modelos básicos

**Semanas 9-10: Autenticación y Roles**

- **Semana 9**: Sistema de usuarios, login/register
- **Semana 10**: Roles, permisos, seguridad básica.

**Semana 11: ENTREGA INTERMEDIA**

**Semanas 12-14: Funcionalidades Avanzadas**

- **Semana 12**: Sistema de citas completo
- **Semana 13**: APIs y integración con frontend moderno
- **Semana 14**: Reportes y exportación de datos

**Semana 15: Revisión y Pulimiento**

- Debugging y optimización
- Documentación técnica
- Preparación de presentación

**Semana 16: ENTREGA FINAL Y PRESENTACIONES**

**RECURSOS Y HERRAMIENTAS**

**Herramientas Obligatorias**

- **XAMPP**: Servidor de desarrollo local
- **Git**: Control de versiones
- **GitHub**: Repositorio del proyecto
- **Visual Studio Code**: Editor recomendado
- **phpMyAdmin**: Gestión de base de datos

**Librerías/Frameworks Permitidos**

**Laravel (Opción A)**

- Laravel Framework 10+
- Laravel Blade templates
- Laravel Eloquent ORM
- Laravel Validation
- Laravel Authentication

**Recursos de Apoyo**

- [Documentación Laravel](https://laravel.com/docs)
- [PHP Manual](https://www.php.net/manual/es/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)

**POLÍTICAS DE EVALUACIÓN**

**Fechas de Entrega**

- **Entrega Intermedia**: Viernes de la Semana 11
- **Entrega Final**: Viernes de la Semana 16
- **Presentaciones**: Durante la clase de la Semana 16

**Penalizaciones**

- **Retraso 2-7 días**: -1.0 puntos
- **No entrega**: 0.0 puntos

**Originalidad**

- **Plagio detectado**: 0.0 puntos y reporte académico
- **Código colaborativo**: Permitido con atribución clara
- **Templates/frameworks**: Permitidos con documentación

**Sustentación Oral**

- **Obligatoria** para entrega final
- **15 minutos** por estudiante/grupo
- **Preguntas técnicas** sobre implementación
- **Demostración en vivo** requerida

**CRITERIOS DE ÉXITO**

**Para el Estudiante**

- Dominio de conceptos MVC
- Implementación correcta de autenticación
- Manejo seguro de base de datos
- Creación de APIs básicas
- Interfaz de usuario funcional
- Documentación técnica clara

**¡Este proyecto será la culminación de todo lo aprendido en el curso y una demostración real de tus habilidades en desarrollo web full-stack!**