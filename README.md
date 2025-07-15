# Sistema de Gestión Penitenciaria

Aplicación web Angular para gestionar internas y visitantes en unidades penitenciarias, con autenticación básica.

## Funcionalidades principales
- Registro, edición y eliminación de internas (guardadas en MockAPI)
- Registro, edición y eliminación de visitantes (guardados en localStorage)
- Asociación de visitantes a internas
- Autenticación y protección de rutas

## Instalación rápida

**Requisitos:**
- Node.js 18+
- npm o yarn
```bash
npm install
npm start
```

La app estará disponible en [http://localhost:4200]

## Acceso al sistema

**Email:** `admin@demo.com`  
**Contraseña:** `123456`

> **Nota:** Estas credenciales son simuladas para la demostración.

## 📱 Funcionalidades Detalladas

### Dashboard
- **Vista general** del estado del sistema
- **Estadísticas básicas** de internas y visitantes
- **Navegación** a las secciones principales

### Gestión de Internas
- **Formulario** con validaciones básicas
- **Búsqueda** por nombre, apellido, FCN, DNI
- **Filtros** por estado y pabellón
- **Estados** de internación (activa, trasladada, liberada)
- **Notificaciones** de éxito/error

### Gestión de Visitantes
- **Registro** con validaciones básicas
- **Control de edad** automático
- **Sistema de parentescos** (A-O)
- **Estados** de visitante (activo, suspendido, inhabilitado)
- **Búsqueda** y filtros básicos
- **Notificaciones** de éxito/error

### Sistema de Autenticación
- **Login** con validación de credenciales
- **Protección de rutas** automática
- **Persistencia de sesión** en el navegador
- **Logout** con limpieza de datos

## 🔧 Configuración


## 🔒 Seguridad

### Características Implementadas
- **Validación de formularios** básica
- **Protección de rutas** con guards
- **Persistencia** de sesión en localStorage



## 🚧 Funcionalidades Futuras

### Gestión de Visitas
- [ ] Programación de visitas
- [ ] Gestión de horarios
- [ ] Control de acceso
- [ ] Registro de visitas

### Mejoras de Seguridad
- [ ] Autenticación de dos factores (2FA)
- [ ] Roles y permisos
- [ ] Auditoría de sesiones

### Funcionalidades Adicionales
- [ ] Reportes y estadísticas avanzadas
- [ ] Exportación de datos
- [ ] Integración con sistemas externos



**Nota:**
Este sistema es una demo. Las internas se guardan en MockAPI y los visitantes en localStorage. Algunas secciones pueden estar en desarrollo o simular datos.