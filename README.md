# CELC Frontend — Sistema de Gestión de Telecomunicaciones

Frontend moderno y responsivo para el **Sistema de Control de Equipos y Líneas de Comunicación (CELC)**, construido con **React 19**, **TypeScript** y **Vite 7**.

---

## 📋 Descripción

SPA administrativa que permite la gestión integral de líneas celulares, equipos terminales, asignaciones a usuarios, revisiones técnicas, reportes exportables y un dashboard con métricas en tiempo real.

### Funcionalidades principales

- 👤 Gestión de usuarios con roles (Administrador, Técnico, Empleado)
- 📱 CRUD de líneas telefónicas con cambio de estado
- 🔧 CRUD de equipos terminales
- 📋 Asignación de equipos/líneas a usuarios
- 🔍 Revisiones y mantenimiento de equipos
- 📊 Dashboard con métricas en tiempo real (ECharts)
- 📈 Reportes exportables a PDF y Excel
- 🔐 Autenticación JWT con persistencia de sesión
- 🌓 Modo oscuro/claro

---

## 🛠️ Stack Tecnológico

### Core

| Tecnología       | Versión | Propósito                        |
| ---------------- | ------- | -------------------------------- |
| **React**        | ^19.1   | Librería UI                      |
| **TypeScript**   | ~5.9    | Tipado estático                  |
| **Vite**         | ^7.1    | Bundler + dev server con HMR     |
| **Tailwind CSS** | ^4.3    | Framework de estilos utility-first |

### Estado y Datos

| Tecnología | Versión | Propósito                             |
| ---------- | ------- | ------------------------------------- |
| **Zustand** | ^5.0   | State management global (stores)      |
| **Axios**   | ^1.12  | Cliente HTTP con interceptores JWT    |

### Routing y UI

| Tecnología          | Versión | Propósito                    |
| ------------------- | ------- | ---------------------------- |
| **React Router**    | ^7.9    | Navegación SPA               |
| **React Icons**     | ^5.5    | Set de iconos                |
| **ECharts**         | ^6.1    | Gráficos del dashboard       |
| **echarts-for-react** | ^3.0  | Wrapper React para ECharts   |

### Exportación de Reportes

| Tecnología          | Versión | Propósito                    |
| ------------------- | ------- | ---------------------------- |
| **jsPDF**           | ^4.2    | Generación de PDFs           |
| **jspdf-autotable** | ^5.0    | Tablas en PDF                |
| **SheetJS (xlsx)**  | ^0.18   | Exportación a Excel          |
| **xlsx-js-style**   | ^1.2    | Estilos en Excel             |

### Testing

| Tecnología              | Versión | Propósito                     |
| ----------------------- | ------- | ----------------------------- |
| **Vitest**              | ^4.1    | Test runner (Vite-native)     |
| **@testing-library/react** | ^16.3 | Testing de componentes React  |
| **jsdom**               | ^29.1   | Entorno DOM para tests        |

### Desarrollo

| Tecnología            | Versión | Propósito                      |
| --------------------- | ------- | ------------------------------ |
| **ESLint**            | ^9.36   | Linting                        |
| **PostCSS**           | ^8.5    | Procesamiento CSS              |
| **pnpm**              | —       | Gestor de paquetes (workspace) |

---

## 📁 Estructura del Proyecto

```
celc-frontend/
├── src/
│   ├── features/                     # Módulos por funcionalidad
│   │   ├── auth/                     # Autenticación (store + lógica)
│   │   │   └── store/authStore.ts    #   Zustand store de auth
│   │   ├── dashboard/                # Dashboard (hooks)
│   │   ├── asignaciones/             # Asignaciones (hooks)
│   │   ├── equipos/                  # Equipos (hooks)
│   │   ├── lineas/                   # Líneas (hooks)
│   │   ├── reportes/                 # Reportes (hooks)
│   │   ├── revisiones/               # Revisiones (hooks)
│   │   └── usuarios/                 # Usuarios (hooks)
│   │
│   ├── shared/                       # Recursos compartidos
│   │   ├── api/                      # Cliente HTTP y endpoints
│   │   │   ├── client.ts             #   Axios instance + interceptores
│   │   │   └── endpoints/index.ts    #   Todos los endpoints tipados
│   │   ├── components/
│   │   │   ├── ui/                   # Componentes UI base
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── DataTable.tsx     #   Tabla genérica con búsqueda
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx         #   Modal reutilizable
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   └── Spinner.tsx
│   │   │   └── layout/               # Componentes de layout
│   │   │       ├── Header.tsx        #   Header con controles de tema/usuario
│   │   │       └── Sidebar.tsx       #   Sidebar de navegación
│   │   ├── hooks/                    # Custom hooks compartidos
│   │   └── types/
│   │       └── api.types.ts          # Tipos TypeScript sincronizados con backend
│   │
│   ├── hooks/                        # Custom hooks específicos
│   │   ├── useUsers.ts
│   │   ├── useLines.ts
│   │   ├── useEquipments.ts
│   │   ├── useAssignments.ts
│   │   ├── useReviews.ts
│   │   └── useMetrics.ts
│   │
│   ├── store/                        # Zustand stores globales
│   │   ├── useDataStore.ts           #   Cache de datos con refresh
│   │   └── useUIStore.ts             #   Sidebar, tema, notificaciones
│   │
│   ├── views/                        # Páginas principales
│   │   ├── LoginView.tsx
│   │   ├── DashboardView.tsx
│   │   ├── UsersView.tsx
│   │   ├── LinesView.tsx
│   │   ├── EquipmentsView.tsx
│   │   ├── AssignmentsView.tsx
│   │   ├── ReviewsView.tsx
│   │   └── ReportsView.tsx
│   │
│   ├── layouts/
│   │   └── AppLayout.tsx             # Layout principal con sidebar + header
│   │
│   ├── assets/                       # Imágenes y recursos
│   │   ├── bg-celc.jpg               #   Fondo para login
│   │   ├── celc-logo.png             #   Logo modo oscuro
│   │   ├── celc-logo1.png            #   Logo modo claro
│   │   └── react.svg
│   │
│   ├── App.tsx                       # Componente raíz con routing
│   ├── App.css                       # Estilos globales
│   ├── index.css                     # Configuración Tailwind
│   ├── main.tsx                      # Punto de entrada
│   └── setupTests.ts                 # Setup de testing
│
├── public/
├── package.json
├── pnpm-workspace.yaml
├── vite.config.ts
├── postcss.config.js
├── eslint.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── README.md
```

---

## 🎨 Características Principales

### Autenticación
- Sistema JWT con store en **Zustand** (`features/auth/store/authStore.ts`)
- Token persistido en `localStorage` con restauración automática
- Interceptor de Axios que inyecta el token en cada request
- Logout automático al recibir 401
- Protección de rutas con `ProtectedRoute` (por rol opcional)

### Interfaz de Usuario
- **Diseño moderno minimalista** con variables CSS personalizadas
- **Modo oscuro/claro** con cambio dinámico (persistido en localStorage)
- **Logo adaptativo** que cambia según el modo seleccionado
- **Responsive design** con sidebar colapsable en móvil
- **Animaciones suaves** con Tailwind CSS
- **Notificaciones toast** vía UIStore
- **Logo adaptativo** que cambia según el modo seleccionado
- **Responsive design** para móvil, tablet y escritorio
- **Animaciones suaves** con Tailwind CSS

### Gestión de Datos
- **DataTable** genérica con búsqueda en vivo y ordenamiento
- **Operaciones CRUD** completas para todos los módulos
- **Cache inteligente** con timestamps de última actualización (vía `useDataStore`)
- **Feedback visual** con modales, toasts y skeletons

### API Integration
- **Cliente Axios centralizado** en `shared/api/client.ts` con interceptores
- **Inyección automática de token JWT** en cada request
- **Logout automático** ante respuestas 401
- **Endpoints tipados** en `shared/api/endpoints/`

---

## 🚀 Instalación y Uso

### Requisitos
- Node.js 18+
- pnpm 8+

### Instalación

```bash
cd celc-frontend
pnpm install
```

### Desarrollo

```bash
pnpm dev
```

La app estará disponible en `http://localhost:5173`

### Build Producción

```bash
pnpm build
```

### Preview del Build

```bash
pnpm preview
```

### Linting

```bash
pnpm lint
```

### Testing

```bash
pnpm test
```

---

## 🔐 Autenticación

### Flujo de Login

1. Usuario ingresa credenciales en `LoginView.tsx`
2. Se envía `POST /api/auth/login` al backend
3. El backend retorna `{ token, user }`
4. `authStore` (Zustand) persiste token y user en `localStorage`
5. Usuario es redirigido al dashboard

### Verificación de Sesión

1. Al cargar la app, `App.tsx` ejecuta `checkSession()` del authStore
2. Si el token existe, se llama a `GET /api/auth/verify`
3. Si es válido, se restaura la sesión
4. Si expiró, se ejecuta `logout()` automático

### Protección de Rutas

```tsx
<ProtectedRoute requiredRole="Administrador">
  <UsersView />
</ProtectedRoute>
```

---

## 🧩 Gestión de Estado con Zustand

| Store           | Archivo                        | Propósito                              |
| --------------- | ------------------------------ | -------------------------------------- |
| `useAuthStore`  | `features/auth/store/authStore.ts` | Token, usuario, login/logout/verify  |
| `useDataStore`  | `store/useDataStore.ts`        | Cache de datos CRUD con refresh        |
| `useUIStore`    | `store/useUIStore.ts`          | Sidebar, tema, notificaciones toast    |

---

## 📡 Endpoints de API

### Autenticación

| Método | Ruta              | Descripción         |
| ------ | ----------------- | ------------------- |
| POST   | `/api/auth/login`  | Iniciar sesión      |
| GET    | `/api/auth/verify` | Verificar token JWT |

### Usuarios

| Método | Ruta                    | Descripción        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/usuarios`         | Listar usuarios    |
| GET    | `/api/usuarios/:id`     | Obtener usuario    |
| POST   | `/api/usuarios`         | Crear usuario      |
| PUT    | `/api/usuarios/:id`     | Actualizar usuario |
| DELETE | `/api/usuarios/:id`     | Eliminar usuario   |

### Líneas

| Método | Ruta                       | Descripción                       |
| ------ | -------------------------- | --------------------------------- |
| GET    | `/api/lineas`              | Listar líneas                     |
| GET    | `/api/lineas/:id`          | Obtener línea                     |
| POST   | `/api/lineas`              | Crear línea                       |
| PUT    | `/api/lineas/:id`          | Actualizar línea                  |
| DELETE | `/api/lineas/:id`          | Eliminar línea                    |
| PUT    | `/api/lineas/:id/toggle`   | Cambiar estado (Activa/Inactiva)  |

### Equipos

| Método | Ruta                    | Descripción        |
| ------ | ----------------------- | ------------------ |
| GET    | `/api/equipos`          | Listar equipos     |
| GET    | `/api/equipos/:id`      | Obtener equipo     |
| POST   | `/api/equipos`          | Crear equipo       |
| PUT    | `/api/equipos/:id`      | Actualizar equipo  |
| DELETE | `/api/equipos/:id`      | Eliminar equipo    |

### Asignaciones

| Método | Ruta                         | Descripción             |
| ------ | ---------------------------- | ----------------------- |
| GET    | `/api/asignaciones`          | Listar asignaciones     |
| GET    | `/api/asignaciones/:id`      | Obtener asignación      |
| POST   | `/api/asignaciones`          | Crear asignación        |
| PUT    | `/api/asignaciones/:id`      | Actualizar asignación   |
| DELETE | `/api/asignaciones/:id`      | Eliminar asignación     |

### Revisiones

| Método | Ruta                     | Descripción         |
| ------ | ------------------------ | ------------------- |
| GET    | `/api/revisiones`        | Listar revisiones   |
| GET    | `/api/revisiones/:id`    | Obtener revisión    |
| POST   | `/api/revisiones`        | Crear revisión      |
| PUT    | `/api/revisiones/:id`    | Actualizar revisión |

### Reportes

| Método | Ruta                           | Descripción                    |
| ------ | ------------------------------ | ------------------------------ |
| GET    | `/api/reportes/lineas`         | Reporte de líneas (con filtro) |
| GET    | `/api/reportes/equipos`        | Reporte de equipos             |
| GET    | `/api/reportes/asignaciones`   | Reporte de asignaciones        |

### Métricas (Dashboard)

| Método | Ruta                                 | Descripción                        |
| ------ | ------------------------------------ | ---------------------------------- |
| GET    | `/api/metricas/dashboard`            | Todas las métricas del dashboard   |
| GET    | `/api/metricas/lineas-activas`       | Cantidad de líneas activas         |
| GET    | `/api/metricas/equipos-reparacion`   | Equipos en reparación              |
| GET    | `/api/metricas/revisiones-proximas`  | Revisiones próximas a vencer       |

---

## 🎭 Temas y Estilos

### Variables CSS

El diseño utiliza variables CSS personalizadas definidas en `index.css`:

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

### Modo Oscuro

Activable desde el botón en el Header. La preferencia se persiste en `localStorage` con la clave `celc-theme`. Los logos se adaptan automáticamente al modo activo.

---

## 📱 Componentes Principales

### LoginView
- Diseño minimalista con imagen de fondo `bg-celc.jpg`
- Campos con validación y estados de carga
- Manejo de errores con feedback visual

### AppLayout
- Sidebar con navegación y links activos
- Header con selector de tema, notificaciones y menú de usuario
- Logo adaptativo (cambia según modo oscuro/claro)
- Responsive: sidebar colapsable en móviles

### DataTable
- Búsqueda en vivo con filtrado
- Ordenamiento por columnas
- Skeletons durante carga
- Estilos consistentes con Tailwind CSS

### Modal
- Componente reutilizable con slots header/body/footer
- Cierre al hacer clic fuera (click outside)
- Animaciones suaves de entrada/salida

---

## 🔧 Hooks Personalizados

| Hook               | Archivo                    | Métodos                                     |
| ------------------ | -------------------------- | ------------------------------------------- |
| `useUsers`         | `hooks/useUsers.ts`        | `getUsers`, `addUser`, `editUser`, `removeUser` |
| `useLines`         | `hooks/useLines.ts`        | `getLines`, `addLine`, `editLine`, `removeLine`, `toggleStatus` |
| `useEquipments`    | `hooks/useEquipments.ts`   | `getEquipos`, `addEquipo`, `editEquipo`, `removeEquipo` |
| `useAssignments`   | `hooks/useAssignments.ts`  | `getAsignaciones`, `addAsignacion`, `editAsignacion`, `removeAsignacion` |
| `useReviews`       | `hooks/useReviews.ts`      | `getRevisiones`, `addRevision`, `editRevision` |
| `useMetrics`       | `hooks/useMetrics.ts`      | `getDashboardMetrics`                         |

---

## 📊 Variables de Entorno

Crear archivo `.env` o `.env.local` en la raíz:

```env
VITE_API_URL=http://localhost:3001/api
```

---

## 🧪 Testing

```bash
# Ejecutar tests (Vitest)
pnpm test

# Modo watch
pnpm test -- --watch
```

Los tests usan `jsdom` como entorno y `@testing-library/react` para los componentes. Configuración en `vite.config.ts`.

---

## 📄 Licencia

Proyecto privado — Sistema CELC.

---

**Última actualización**: 4 de junio de 2026
