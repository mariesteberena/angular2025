# Sistema de Gestión Penitenciaria

Una aplicación web desarrollada en Angular para la gestión básica de internas y visitantes en Unidades penitenciarios, con un sistema de autenticación.

## 🚀 Características Implementadas

### 📊 Dashboard Principal
- **Estadísticas en tiempo real** de internas y visitantes
- **Tarjetas interactivas** con navegación directa a secciones
- **Métricas clave**: Total de internas, internas activas, total de visitantes, visitantes activos
- **Diseño responsivo** con interfaz moderna y intuitiva

### 👥 Gestión de Internas
- **Registro básico** de internas con datos personales
- **Información**: Nombre, apellido, FCN, DNI, fecha de nacimiento, domicilio
- **Ubicación**: Pabellón y celda asignados
- **Estado de internación**: Activa, trasladada, liberada
- **Gestión de visitantes autorizados** para cada interna
- **Relaciones familiares** entre internas
- **Fotografía** de identificación
- **Búsqueda y filtros** por nombre, apellido, FCN, DNI, pabellón y estado
- **Operaciones CRUD**: Crear, editar, eliminar internas

### 👤 Gestión de Visitantes
- **Registro** de visitantes con validaciones básicas
- **Datos**: Nombre, apellido, DNI, domicilio, teléfono
- **Información de relación**: Parentesco (A-O) y vínculo
- **Control de edad**: Validación automática de mayoría de edad
- **Fotografía requerida** para mayores de edad
- **Autorizaciones**: Internas que puede visitar cada visitante
- **Estados**: Activo, suspendido, inhabilitado
- **Búsqueda** por nombre, apellido, FCN
- **Filtros** por pabellón
- **Asociación** de visitantes a internas

### 🔐 Sistema de Autenticación
- **Login** con validación de credenciales
- **Protección de rutas** con AuthGuard
- **Persistencia de sesión** usando localStorage
- **Interceptor HTTP** para autorización
- **Logout** con limpieza de datos

### 🏗️ Gestión de Visitas
- **Página en construcción** - Solo muestra mensaje de desarrollo

## 🛠️ Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **Angular Forms** - Formularios reactivos
- **Angular Router** - Enrutamiento
- **LocalStorage** - Persistencia de datos
- **CSS** - Estilos

## 📋 Estructura del Proyecto

```
src/app/
├── components/           # Componentes reutilizables
│   ├── header/          # Navegación principal
│   ├── login/           # Formulario de autenticación
│   ├── interna-form/    # Formulario de internas
│   └── visitante-form/  # Formulario de visitantes
├── pages/               # Páginas principales
│   ├── home/            # Dashboard
│   ├── internas/        # Gestión de internas
│   ├── visitantes/      # Gestión de visitantes
│   └── visitas/         # Página en construcción
├── services/            # Lógica de negocio
│   ├── auth.service.ts      # Autenticación
│   ├── interna.service.ts   # Gestión de internas
│   └── visitante.service.ts # Gestión de visitantes
├── interfaces/          # Definiciones de tipos
├── guards/              # Protección de rutas
└── interceptors/        # Interceptores HTTP
```

## 🚀 Instalación y Uso

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **npm** o **yarn**

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Navegar al directorio del proyecto
cd project

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Credenciales de Prueba
Para acceder al sistema, utiliza las siguientes credenciales:

**Email:** `admin@test.com`  
**Contraseña:** `123456`

> **Nota:** Estas credenciales son simuladas para propósitos de demostración.

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

### Cambiar Credenciales de Prueba
Edita el método `login` en `src/app/services/auth.service.ts`:

```typescript
// Cambiar la validación de contraseña
if (credentials.password !== 'tu-nueva-contraseña') {
  throw new Error('Contraseña incorrecta');
}
```

### Agregar Nuevas Rutas Protegidas
Para proteger una nueva ruta, agrega el guard en `src/app/app.routes.ts`:

```typescript
{ path: 'nueva-ruta', component: NuevoComponente, canActivate: [AuthGuard] }
```

## 🔒 Seguridad

### Características Implementadas
- **Validación de formularios** básica
- **Protección de rutas** con guards
- **Interceptores HTTP** para autorización
- **Persistencia** de tokens en localStorage

### Consideraciones para Producción
- **Backend real**: Reemplazar simulaciones con APIs reales
- **HTTPS**: Usar conexiones seguras
- **Validación del servidor**: Validar datos en el backend
- **Tokens JWT**: Implementar tokens reales

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

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaFuncionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/NuevaFuncionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado para mejorar la gestión penitenciaria** 
