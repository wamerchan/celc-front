# CELC Frontend - Sistema de Gestión de Telecomunicaciones

Frontend moderno y responsivo para el Sistema de Control de Equipos y Líneas de Comunicación (CELC), construido con React, TypeScript y Vite.

## 📋 Descripción del Proyecto

CELC Frontend es una aplicación web administrativa que permite:
- 👤 Gestión de usuarios y roles
- 📱 Control de líneas telefónicas
- 🔧 Administración de equipos
- 📋 Asignaciones de equipos y líneas
- 🔍 Revisiones y mantenimiento
- 📊 Dashboard con métricas en tiempo real
- 📈 Reportes y análisis

## 🛠️ Stack Tecnológico

### Framework & Build
- **React 18+** - Librería UI moderna
- **TypeScript** - Tipado estático para JavaScript
- **Vite 7+** - Build tool ultrarrápido con HMR (Hot Module Replacement)
- **Tailwind CSS** - Framework de estilos utilitarios

### State Management & HTTP
- **React Context API** - Gestión de estado de autenticación
- **Axios** - Cliente HTTP con interceptores para JWT

### Routing & UI
- **React Router v6** - Navegación SPA
- **React Icons** - Librería de iconos
- **PostCSS** - Procesamiento de CSS

### Desarrollo
- **ESLint** - Linting de código
- **TypeScript Strict Mode** - Validación de tipos rigurosa

## 📁 Estructura del Proyecto

```
celc-frontend/
├── src/
│   ├── components/
│   │   ├── shared/           # Componentes reutilizables
│   │   │   ├── DataTable.tsx # Tabla genérica con búsqueda
│   │   │   └── Modal.tsx     # Modal reutilizable
│   │   └── ui/               # Componentes UI básicos
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   ├── context/
│   │   ├── AuthContext.tsx   # Context de autenticación con JWT
│   │   └── NavigationContext.tsx
│   ├── hooks/                # Custom hooks
│   │   ├── useUsers.ts
│   │   ├── useLines.ts
│   │   ├── useEquipments.ts
│   │   ├── useAssignments.ts
│   │   ├── useReviews.ts
│   │   └── useMetrics.ts
│   ├── layouts/
│   │   └── AppLayout.tsx     # Layout principal con sidebar y header
│   ├── services/
│   │   └── api.ts            # Configuración de Axios y endpoints
│   ├── views/                # Páginas principales
│   │   ├── LoginView.tsx     # Página de login con diseño moderno
│   │   ├── DashboardView.tsx # Dashboard con métricas
│   │   ├── UsersView.tsx     # CRUD de usuarios
│   │   ├── LinesView.tsx     # CRUD de líneas
│   │   ├── EquipmentsView.tsx # CRUD de equipos
│   │   ├── AssignmentsView.tsx # Gestión de asignaciones
│   │   ├── ReviewsView.tsx   # Gestión de revisiones
│   │   └── ReportsView.tsx   # Reportes
│   ├── assets/               # Imágenes y logos
│   │   ├── bg-celc.jpg       # Imagen de fondo para login
│   │   ├── celc-logo.png     # Logo modo oscuro
│   │   └── celc-logo1.png    # Logo modo claro
│   ├── App.tsx               # Componente raíz
│   ├── App.css               # Estilos globales
│   ├── index.css             # Configuración Tailwind
│   └── main.tsx              # Punto de entrada
├── public/
│   └── vite.svg
├── package.json
├── vite.config.ts            # Configuración Vite
├── tailwind.config.js        # Configuración Tailwind CSS
├── postcss.config.js         # Configuración PostCSS
├── eslint.config.js          # Configuración ESLint
└── README.md
```

## 🎨 Características Principales

### Autenticación
- Sistema JWT con token almacenado en `localStorage`
- Verificación automática de token al cargar la aplicación
- Protección de rutas con `ProtectedRoute`
- Restauración de sesión al refrescar la página

### Interfaz de Usuario
- **Diseño moderno minimalista** con gradientes y efectos
- **Modo oscuro/claro** con cambio dinámico de temas
- **Logo adaptativo** que cambia según el modo seleccionado
- **Responsive design** para móvil, tablet y escritorio
- **Animaciones suaves** con Tailwind CSS

### Gestión de Datos
- **DataTable** genérica con búsqueda en vivo
- **Operaciones CRUD** completas para todos los módulos
- **Validación de formularios** con inputs controlados
- **Feedback visual** con modales de confirmación

### API Integration
- **Configuración centralizada** de endpoints en `api.ts`
- **Interceptores de Axios** para agregar token JWT automáticamente
- **Manejo de errores** consistente
- **Llamadas paralelas** con `Promise.all` en hooks

## 🚀 Instalación y Uso

### Requisitos
- Node.js 16+ 
- npm 7+

### Instalación
```bash
cd celc-frontend
npm install
```

### Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173` (o el siguiente puerto disponible)

### Build Producción
```bash
npm run build
```

### Preview de Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 🔐 Autenticación

### Flujo de Login
1. Usuario ingresa credenciales en `LoginView.tsx`
2. Se envía POST a `/api/auth/login`
3. Backend retorna `{ token, user }`
4. Token se almacena en `localStorage`
5. Usuario es redirigido al dashboard

### Verificación de Token
1. Al cargar la app, `AuthContext` llama a `GET /api/auth/verify`
2. Si el token es válido, restaura la sesión
3. Si el token es inválido, hace logout automático

### Protección de Rutas
```typescript
<ProtectedRoute>
  <DashboardView />
</ProtectedRoute>
```

## 📡 Endpoints de API

### Autenticación
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Líneas
- `GET /api/lineas` - Listar líneas
- `POST /api/lineas` - Crear línea
- `PUT /api/lineas/:id` - Actualizar línea
- `DELETE /api/lineas/:id` - Eliminar línea
- `PUT /api/lineas/:id/toggle` - Cambiar estado (Activa/Inactiva)

### Equipos
- `GET /api/equipos` - Listar equipos
- `POST /api/equipos` - Crear equipo
- `PUT /api/equipos/:id` - Actualizar equipo
- `DELETE /api/equipos/:id` - Eliminar equipo

### Métricas
- `GET /api/metricas/lineas-activas` - Cantidad de líneas activas
- `GET /api/metricas/equipos-reparacion` - Equipos en reparación
- `GET /api/metricas/revisiones-proximas` - Revisiones próximas
- `GET /api/metricas/dashboard` - Todas las métricas

## 🎭 Temas y Estilos

### Variables CSS Definidas
```css
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring
```

### Tema Oscuro
Activable mediante botón en el header. Los colores se invierten automáticamente.

## 📱 Componentes Principales

### LoginView
- Diseño minimalista con imagen de fondo
- Campos con validación
- Indicador de carga durante autenticación
- Credenciales de prueba mostradas

### AppLayout
- Sidebar con navegación
- Header con controles de tema y usuario
- Logo adaptativo (cambia según modo)
- Responsive: sidebar se oculta en móviles

### DataTable
- Búsqueda en vivo
- Ordenamiento (opcional)
- Renderización personalizable de filas
- Estilos adaptados a Tailwind

### Modal
- Componente reutilizable
- Cierre al hacer clic fuera
- Animaciones suaves

## 🔧 Hooks Personalizados

### useUsers
- `getUsers()` - Obtener lista de usuarios
- `addUser(user)` - Crear usuario
- `editUser(id, user)` - Editar usuario
- `removeUser(id)` - Eliminar usuario

### useLines
- `getLines()` - Obtener lista de líneas
- `addLine(line)` - Crear línea
- `editLine(id, line)` - Editar línea
- `removeLine(id)` - Eliminar línea
- `toggleStatus(id)` - Cambiar estado

## 📊 Variables de Entorno

Crear archivo `.env.local`:
```
VITE_API_URL=http://localhost:3001/api
```

## 📝 Comentarios en Código

Todos los archivos siguen el estándar de comentarios en español:
```typescript
// Descripción breve de la funcionalidad - 23 de octubre de 2025 - WM Developer
```

## 🤝 Contribución

Los cambios de código deben incluir:
1. Comentarios en español explicando la lógica
2. Fecha del cambio
3. Identificación del desarrollador (WM Developer)

## 📄 Licencia

Proyecto privado - Sistema CELC

---

**Última actualización**: 23 de octubre de 2025
**Desarrollador**: WM Developer
