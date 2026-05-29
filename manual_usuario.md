# Manual de Usuario — Sistema de Gestión AppSalon

Bienvenido al **Manual de Usuario de AppSalon**, la plataforma integral de gestión de citas y servicios para tu salón de belleza. 

Este manual te guiará paso a paso por toda la interfaz y flujo de navegación del sistema, tanto para **Clientes** (que reservan de forma pública o registrada) como para el **Personal y Administradores** (que gestionan la agenda diaria, servicios, usuarios y reportes).

---

## 📖 Índice de Navegación
1. [Navegación Pública (Clientes e Invitados)](#1-navegación-pública-clientes-e-invitados)
2. [Autenticación (Acceso y Registro)](#2-autenticación-acceso-y-registro)
3. [Panel de Citas Públicas (Invitados)](#3-panel-de-citas-públicas-invitados)
4. [Panel de Administración (General y Métricas)](#4-panel-de-administración-general-y-métricas)
5. [Agenda de Citas (Gestión, Creación y Edición)](#5-agenda-de-citas-gestión-creación-y-edición)
6. [Gestión de Horarios de Atención](#6-gestión-de-horarios-de-atención)
7. [Gestión de Catálogo de Servicios](#7-gestión-de-catálogo-de-servicios)
8. [Gestión de Usuarios y Roles](#8-gestión-de-usuarios-y-roles)
9. [Módulo de Reportes PDF](#9-módulo-de-reportes-pdf)
10. [Configuración de Perfil, Seguridad y Apariencia](#10-configuración-de-perfil-seguridad-y-apariencia)

---

## 1. Navegación Pública (Clientes e Invitados)

La página de inicio es la carta de presentación de AppSalon. Cualquier usuario que ingrese al sitio web podrá ver la información general, explorar los servicios y su disponibilidad antes de agendar.

### 1.1 Encabezado y Sección Principal (Hero)
El encabezado cuenta con el logotipo, menús rápidos de servicios/contacto, y botones de acceso. La sección principal invita al usuario a reservar su cita.

![Página de Inicio — Cabecera y Hero](./fotos/image.png)

### 1.2 Características y Carta de Servicios
Al hacer scroll, el cliente podrá ver los pilares de servicio del salón y la lista detallada de tratamientos capilares, manicure, pedicure, tinte y cortes de cabello disponibles con sus respectivos precios y duraciones exactas.

![Exploración de Características y Servicios](./fotos/image%20copy.png)

### 1.3 Sección de Registro Rápido y Pie de Página (Footer)
En la parte inferior se encuentra el llamado a la acción para registrarse gratuitamente, junto con los datos de contacto del salón (teléfono, ubicación y horarios de atención al público) y enlaces a redes sociales.

![Llamado a la Acción y Datos de Contacto](./fotos/image%20copy%202.png)

---

## 2. Autenticación (Acceso y Registro)

Para guardar el historial de citas y tener un perfil recurrente, los clientes pueden autenticarse en la plataforma de forma segura.

### 2.1 Registro de Cuenta Nueva
El formulario solicita el Nombre, Apellido, Correo electrónico, Teléfono y contraseña. Cuenta con validación en tiempo real de longitud mínima de caracteres.

![Formulario de Registro de Usuario](./fotos/image%20copy%203.png)

### 2.2 Inicio de Sesión (Login)
Permite a los usuarios registrados (Clientes, Estilistas y Administradores) ingresar al sistema ingresando sus credenciales y recordar su sesión activa.

![Formulario de Inicio de Sesión](./fotos/image%20copy%204.png)

---

## 3. Panel de Citas Públicas (Invitados)

Si un cliente no desea registrar una cuenta permanente, puede reservar una cita como **Invitado** a través del flujo de reserva rápida.

### 3.1 Datos del Invitado y Selección de Servicios
El sistema solicita nombre, teléfono y correo (donde recibirá el código de seguimiento). Luego, permite marcar uno o múltiples servicios de belleza mediante tarjetas interactivas.

![Paso 1 y 2 del Formulario de Reserva Pública](./fotos/image%20copy%205.png)

### 3.2 Selección de Fecha y Hora de la Cita
El usuario elige el día en el calendario interactivo. Las horas disponibles se cargan de forma dinámica en tiempo real respetando la disponibilidad y evitando la sobreposición de citas. Al finalizar, hace clic en "Confirmar reserva gratuita".

![Paso 3 — Calendario e Horarios del Invitado](./fotos/image%20copy%206.png)

---

## 4. Panel de Administración (General y Métricas)

Los administradores y el personal cuentan con un panel centralizado para controlar el negocio en tiempo real.

### 4.1 Métricas y Gráficos del Negocio
Muestra de forma rápida estadísticas clave:
* **Citas del día:** Citas programadas para hoy.
* **Citas totales:** Acumulado histórico.
* **Total clientes:** Usuarios con perfil de cliente registrados.
* **Servicios activos:** Servicios ofertados en catálogo.
* **Ingresos del período:** Dinero total recaudado en las fechas seleccionadas.

![Dashboard Administrativo de AppSalon](./fotos/image%20copy%207.png)

### 4.2 Filtro por Catálogo de Servicios
Permite acotar los ingresos y métricas visualizadas según un tratamiento específico seleccionado en el menú desplegable.

![Desplegable de Filtro de Servicios en el Dashboard](./fotos/image%20copy%208.png)

### 4.3 Filtro de Rango de Fechas
Permite seleccionar dinámicamente un período en el calendario flotante para calcular ingresos y citas agendadas de forma retroactiva o futura.

![Selector de Rango de Fechas](./fotos/image%20copy%209.png)

### 4.4 Menú de Navegación Lateral (Sidebar)
Es el eje central de navegación del administrador y permite acceder a los módulos de Agenda, Horarios, Servicios, Usuarios y Reportes.

![Menú de Navegación Lateral Detallado](./fotos/image%20copy%2015.png)

---

## 5. Agenda de Citas (Gestión, Creación y Edición)

Es la herramienta diaria de los estilistas y recepcionistas para el control de la agenda.

### 5.1 Listado General de la Agenda
Presenta todas las citas del salón ordenadas por fecha y hora, mostrando los servicios incluidos, el total de dinero y el estado actual de la cita (**Completada**, **Pendiente**, **Confirmada**). Cuenta con filtros avanzados de búsqueda y un botón directo para enviar notificaciones de confirmación por **WhatsApp**.

![Módulo General de la Agenda de Citas](./fotos/image%20copy%2010.png)

### 5.2 Opciones de Exportación
El administrador puede descargar la lista de citas filtrada directamente a formatos **Excel (.xlsx)** y **CSV (.csv)** con un solo clic.

![Desplegable de Exportación de Datos](./fotos/image%20copy%2011.png)

### 5.3 Creación de Nueva Cita Interna (Sidebar Sheet)
Permite a los administradores agendar citas directamente desde el panel para clientes existentes (usando el buscador interactivo) o registrando un nombre de invitado temporal, eligiendo fecha, hora y seleccionando los servicios requeridos.

![Formulario Deslizable de Nueva Cita](./fotos/image%20copy%2012.png)

### 5.4 Detalle y Edición de Citas
Al seleccionar una cita de la agenda, se despliega una barra lateral para ver su información al detalle. El personal puede:
* Cambiar el estado de la cita (Ej: marcar como **Completada** o **Cancelada**).
* Agregar o remover servicios contratados en tiempo real.
* El sistema recalcula automáticamente el valor **Total** a pagar antes de hacer clic en "Guardar cambios".

![Visualización y Edición de Detalle de Cita](./fotos/image%20copy%2013.png)

---

## 6. Gestión de Horarios de Atención

Permite controlar la disponibilidad del salón por día de la semana.

### 6.1 Configuración de Jornadas y Tramos de Trabajo
El administrador puede definir qué días abre el salón, activar/desactivar días completos de forma sencilla y establecer múltiples tramos de horarios de atención (por ejemplo: agregar descansos de almuerzo o turnos rotativos). Al terminar, presiona "Guardar cambios".

![Módulo de Configuración de Horarios de Atención](./fotos/image%20copy%2014.png)

---

## 7. Gestión de Catálogo de Servicios

Módulo exclusivo para administradores encargado del mantenimiento de los servicios ofrecidos públicamente.

### 7.1 Catálogo General de Servicios
Presenta el listado completo de tratamientos. Desde esta vista se puede auditar la duración en minutos, precios y el estado de catálogo (Activo/Inactivo) de cada servicio.

![Listado de Servicios Ofertados](./fotos/image%20copy%2016.png)

### 7.2 Creación de un Nuevo Servicio (Drawer Form)
Para agregar una nueva propuesta al catálogo, se despliega un formulario que solicita Nombre, Precio, Duración en minutos, una Descripción opcional y la casilla para marcarlo inmediatamente como activo.

![Formulario de Creación de Servicio](./fotos/image%20copy%2017.png)

---

## 8. Gestión de Usuarios y Roles

Permite auditar a las personas registradas en el sistema y administrar el personal de trabajo.

### 8.1 Listado General de Usuarios
Muestra los nombres, correos, números de teléfono, estado de cuenta y el **Rol** de cada persona en el sistema.

![Módulo de Gestión de Usuarios y Personal](./fotos/image%20copy%2018.png)

### 8.2 Edición de Roles y Permisos
Permite modificar el nivel de privilegios de cualquier usuario:
* **Cliente:** Puede reservar citas y auditar su historial personal.
* **Funcionario:** Estilista o staff con acceso a la agenda del salón, reportes y edición de citas.
* **Administrador:** Acceso y control total del sistema.
* **Casilla "Cuenta confirmada/activa":** Permite suspender o reactivar cuentas de forma inmediata.

![Edición de Rol y Estado de Usuario](./fotos/image%20copy%2019.png)

---

## 9. Módulo de Reportes PDF

Para auditorías y cierres de mes, AppSalon incluye un potente generador de reportes.

### 9.1 Configuración e Historial de Reportes PDF
Permite al administrador configurar un reporte seleccionando el tipo (Ej: Citas), el rango de fechas a auditar, y filtrar opcionalmente por un estado de cita o servicio en específico. Al hacer clic en "Generar reporte", el sistema produce un documento PDF descargable en tiempo real y mantiene un registro de reportes recientes.

![Formulario Generador de Reportes PDF](./fotos/image%20copy%2020.png)

---

## 10. Configuración de Perfil, Seguridad y Apariencia

Cualquier usuario autenticado puede acceder a su menú personal de configuración en la esquina inferior izquierda.

### 10.1 Menú de Configuración Rápida
Despliega un menú emergente para acceder directamente a la configuración de la cuenta o para cerrar sesión de forma segura.

![Menú Emergente de Perfil](./fotos/image%20copy%2021.png)

### 10.2 Configuración del Perfil Personal
Permite al usuario actualizar sus datos básicos como Nombre, Apellido y Correo electrónico. Además, incluye la sección de zona de peligro para la auto-eliminación de la cuenta.

![Pestaña de Información del Perfil](./fotos/image%20copy%2022.png)

### 10.3 Configuración de Seguridad y Doble Factor (2FA)
Permite realizar actualizaciones seguras de contraseña. Adicionalmente, cuenta con el interruptor para habilitar la **Autenticación de Dos Factores (2FA)** mediante aplicaciones TOTP en el móvil (como Google Authenticator) para máxima seguridad.

![Pestaña de Configuración de Seguridad y 2FA](./fotos/image%20copy%2023.png)

### 10.4 Configuración de Apariencia (Modo Claro / Oscuro)
Permite al usuario conmutar el tema visual de su panel eligiendo entre:
* **Claro:** Colores suaves crema y arena.
* **Oscuro:** Colores obsidiana con acentos dorados.
* **Sistema:** Sincronización automática con la preferencia de su sistema operativo Windows o móvil.

![Pestaña de Configuración de Apariencia](./fotos/image%20copy%2024.png)
