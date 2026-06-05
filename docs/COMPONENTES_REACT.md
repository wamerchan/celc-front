# 📋 Informe Completo de Componentes React - CELC
**Sistema para el Control de Equipos y Líneas de Comunicación**

---

## 📁 Estructura General del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── ProtectedRoute.tsx
│   ├── shared/          # Componentes compartidos complejos
│   └── ui/              # Componentes UI base
├── views/               # Vistas/Pages principales
├── layouts/             # Layouts (AppLayout con Sidebar y Header)
├── context/             # Context API para estado global
├── hooks/               # Custom hooks para lógica reutilizable
├── services/            # Servicios API
└── assets/              # Imágenes y recursos estáticos
```

---

## 🔐 Componentes de Enrutamiento y Protección

### **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
**Propósito**: Proteger rutas que requieren autenticación y roles específicos.

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `children` | `ReactNode` | Componente hijo a renderizar si está autorizado |
| `requiredRole?` | `string` | Rol requerido para acceder a la ruta |

**Comportamiento**:
- Valida si el usuario está autenticado
- Redirige a `/login` si no está autenticado
- Redirige a `/dashboard` si falta el rol requerido
- Muestra "Cargando..." mientras se inicializa la autenticación

---

## 🎨 Componentes de UI (Base)

Ubicación: `src/components/ui/`

### **Button** (`Button.tsx`)
**Componente reutilizable de botón con múltiples variantes**.

| Prop | Tipo | Descripción |
|------|------|-------------|
| `children` | `ReactNode` | Contenido del botón |
| `variant?` | `'primary'` \| `'secondary'` \| `'danger'` | Estilo del botón (default: `primary`) |
| `isLoading?` | `boolean` | Muestra spinner y deshabilita el botón |
| `disabled?` | `boolean` | Deshabilita el botón |

**Variantes de estilos**:
- `primary`: Azul marino (navy) con hover
- `secondary`: Gris oscuro
- `danger`: Coral rojo

---

### **Input** (`Input.tsx`)
**Campo de entrada de texto con etiqueta opcional**.

| Prop | Tipo | Descripción |
|------|------|-------------|
| `label?` | `string` | Etiqueta del campo |
| `...props` | `InputHTMLAttributes` | Todas las propiedades de `<input>` HTML |

**Características**:
- Soporte para modo oscuro
- Estilos focus con anillo azul
- Placeholder con color gris

---

### **Select** (`Select.tsx`)
**Dropdown con opciones predefinidas y etiqueta**.

| Prop | Tipo | Descripción |
|------|------|-------------|
| `label?` | `string` | Etiqueta del select |
| `options` | `Array<{value, label}>` | Opciones disponibles |
| `...props` | `SelectHTMLAttributes` | Propiedades de `<select>` HTML |

**Uso típico**:
```tsx
<Select
  label="Rol"
  options={[
    { value: 'admin', label: 'Administrador' },
    { value: 'user', label: 'Usuario' }
  ]}
/>
```

---

## 📦 Componentes Compartidos (Complejos)

Ubicación: `src/components/shared/`

### **Modal** (`Modal.tsx`)
**Ventana modal genérica con overlay y contenido personalizable**.

| Prop | Tipo | Descripción |
|------|------|-------------|
| `isOpen` | `boolean` | Controla si el modal es visible |
| `onClose` | `() => void` | Callback al cerrar el modal |
| `title` | `string` | Título del modal |
| `children` | `ReactNode` | Contenido del modal |

**Características**:
- Overlay oscuro con opacity 50%
- Botón de cierre (X) en la esquina superior derecha
- Soporte para modo oscuro
- Máximo ancho de 448px (md)

---

### **DataTable** (`DataTable.tsx`)
**Tabla genérica con paginación y búsqueda*.

| Prop | Tipo | Descripción |
|------|------|-------------|
| `headers` | `string[]` | Encabezados de columnas |
| `data` | `any[]` | Datos a mostrar |
| `renderRow` | `(item) => ReactNode` | Función que renderiza cada fila |
| `searchable?` | `boolean` | Habilitar búsqueda |
| `searchPlaceholder?` | `string` | Placeholder del campo de búsqueda |

**Características**:
- Paginación de 10 items por página
- Búsqueda en tiempo real (busca en todos los campos)
- Navegación Anterior/Siguiente
- Muestra contador de resultados
- Soporte para modo oscuro

---

## 📄 Vistas Principales

Ubicación: `src/views/`

### **LoginView** (`LoginView.tsx`)
**Pantalla de inicio de sesión**.

**Características**:
- Logo y branding de CELC
- Campos de email y contraseña
- Validación básica
- Spinner de carga
- Fondo dinámico con overlay
- Credenciales de prueba mostradas
- Modo responsive

**Credenciales de prueba**:
```
Email: carlos.gomez0@example.com
Contraseña: 123456
```

---

### **DashboardView** (`DashboardView.tsx`)
**Panel de inicio con estadísticas principales**.

**Tarjetas de Estadísticas**:
1. **Total Líneas** (icono teléfono)
2. **Líneas Activas** (icono check)
3. **Equipos en Reparación** (icono herramientas)
4. **Revisiones Próximas** (icono reloj)

**Características**:
- Fetching de datos desde API
- Fallback a datos mock si hay error
- Animación de carga
- Secciones para Actividad Reciente y Alertas
- Usa iconos de `react-icons/hi2`

---

### **UsersView** (`UsersView.tsx`)
**Gestión de usuarios (solo para administradores)**.

**Funcionalidades**:
- ✅ Crear usuario
- ✏️ Editar usuario
- 🗑️ Eliminar usuario
- 🔍 Buscar usuarios

**Modal de Formulario**:
- Nombres
- Apellidos
- Email
- Rol

---

### **LinesView** (`LinesView.tsx`)
**Gestión de líneas de comunicación**.

**Funcionalidades**:
- ✅ Crear línea
- ✏️ Editar línea
- 🗑️ Eliminar línea
- 🔄 Cambiar estado (Activa/Suspendida)
- 🔍 Buscar líneas

**Campos**:
- Número de línea
- Estado (Activa/Inactiva)
- Plan (tipo de servicio)

---

### **EquipmentsView** (`EquipmentsView.tsx`)
**Gestión de equipos disponibles**.

**Funcionalidades**:
- ✅ Crear equipo
- ✏️ Editar equipo
- 🗑️ Eliminar equipo
- 🔧 Registrar reparación
- 🔍 Buscar equipos

**Campos**:
- Modelo
- Marca
- Estado (In Use, In Stock, En Reparación)

**Estados de equipo**:
- Verde: In Use (En uso)
- Azul: In Stock (En inventario)
- Amarillo: En reparación

---

### **AssignmentsView** (`AssignmentsView.tsx`)
**Asignación de equipos y líneas a usuarios**.

**Funcionalidades**:
- ✅ Crear asignación (Usuario + Línea + Equipo)
- ✏️ Editar asignación
- 🗑️ Eliminar asignación
- 🔍 Buscar asignaciones

**Selectores dinámicos**:
- Usuarios: Cargados desde hook `useUsers()`
- Líneas: Cargadas desde hook `useLines()`
- Equipos: Cargados desde hook `useEquipments()`

---

### **ReviewsView** (`ReviewsView.tsx`)
**Gestión de revisiones/inspecciones de equipos**.

**Funcionalidades**:
- ✅ Crear revisión
- ✏️ Editar revisión
- 🗑️ Eliminar revisión
- 🔍 Buscar revisiones

**Campos**:
- Equipo (selector dinámico)
- Fecha de revisión
- Resultado (Passed, Failed, etc.)

---

### **ReportsView** (`ReportsView.tsx`)
**Generación de reportes con filtros**.

**Tipos de Reportes**:
1. **Líneas**: Número, Estado, Plan, Usuario
2. **Equipos**: Modelo, Marca, Estado, Fecha Reparación
3. **Asignaciones**: Usuario, Línea, Equipo, Fecha Asignación

**Filtros Disponibles**:
- Tipo de reporte
- Fecha de inicio
- Fecha de fin

---

## 🎭 Layout Principal

### **AppLayout** (`src/layouts/AppLayout.tsx`)

**Componentes incluidos**:
1. **Sidebar** (barra lateral de navegación)
2. **Header** (barra superior con opciones de usuario)
3. **Main** (contenedor del contenido)

#### **Sidebar**
- Logo CELC dinámico (cambia según modo claro/oscuro)
- Menú de navegación:
  - 📊 Dashboard
  - 👥 Usuarios (solo admin)
  - 📞 Líneas
  - 🔧 Equipos
  - 📋 Asignaciones
  - 🔍 Revisiones
  - 📈 Reportes
- Responsive (oculto en mobile, togglable)
- Animación slide-in

#### **Header**
- Botón hamburguesa (mobile)
- Toggle de tema claro/oscuro (☀️/🌙)
- Información del usuario actual
- Botón de cerrar sesión

**Características**:
- Sidebar fixed a la izquierda en desktop
- Margen izquierdo automático en desktop (md:ml-64)
- Overlay oscuro en mobile
- Transiciones suaves

---

## 🪝 Custom Hooks

Ubicación: `src/hooks/`

| Hook | Descripción | Retorna |
|------|-------------|---------|
| `useUsers()` | Gestión de usuarios (CRUD) | `users, error, addUser, editUser, removeUser` |
| `useLines()` | Gestión de líneas (CRUD + toggle estado) | `lines, error, addLine, editLine, removeLine, toggleStatus` |
| `useEquipments()` | Gestión de equipos (CRUD + reparación) | `equipments, error, addEquipment, editEquipment, removeEquipment, repairEquipment` |
| `useAssignments()` | Gestión de asignaciones (CRUD) | `assignments, error, addAssignment, editAssignment, removeAssignment` |
| `useReviews()` | Gestión de revisiones (CRUD) | `reviews, error, addReview, editReview, removeReview` |
| `useMetrics()` | Métricas del dashboard | Métodos para obtener estadísticas |

---

## 🌐 Context API (Estado Global)

Ubicación: `src/context/`

### **AuthContext** (`AuthContext.tsx`)
**Manejo de autenticación y usuario actual**.

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
```

---

### **NavigationContext** (`NavigationContext.tsx`)
**Manejo de navegación global y estado de rutas**.

---

### **NotificationContext** (`NotificationContext.tsx`)
**Sistema de notificaciones globales (toasts/alerts)**.

---

## 🔄 Flujo de Rutas

```
/ → redirect a /login
/login → LoginView (pública)
/dashboard → DashboardView (protegida)
/usuarios → UsersView (protegida, solo admin)
/lineas → LinesView (protegida)
/equipos → EquipmentsView (protegida)
/asignaciones → AssignmentsView (protegida)
/revisiones → ReviewsView (protegida)
/reportes → ReportsView (protegida)
/* → redirect a /login (rutas no encontradas)
```

---

## 🎨 Sistema de Diseño

### **Colores Principales**
- `navy`: Color primario (azul marino)
- `coral`: Color de peligro (rojo/coral)
- `success`: Verde para estados positivos
- `warning`: Amarillo para advertencias
- `accent`: Color de acento adicional

### **Componentes de Estilo**
- **Tailwind CSS** para utilidades
- **Dark mode** soportado (clase `dark`)
- **Animaciones**: fade-in, scale-in, slide-in, spin

---

## 📦 Uso Típico de Componentes

### Ejemplo: Crear una nueva vista con DataTable
```tsx
import DataTable from '../components/shared/DataTable';
import Modal from '../components/shared/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useCustomHook } from '../hooks/useCustomHook';

const MyView = () => {
  const { items, addItem, editItem, removeItem } = useCustomHook();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderRow = (item) => (
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>
        <Button onClick={() => handleEdit(item)}>Editar</Button>
        <Button onClick={() => handleDelete(item.id)} variant="danger">Eliminar</Button>
      </td>
    </tr>
  );

  return (
    <div>
      <h1>Mi Vista</h1>
      <Button onClick={() => setIsModalOpen(true)}>Crear</Button>
      <DataTable
        headers={['Nombre', 'Acciones']}
        data={items}
        renderRow={renderRow}
        searchable
      />
      {isModalOpen && <Modal isOpen onClose={() => setIsModalOpen(false)} title="Crear Item">
        {/* Formulario */}
      </Modal>}
    </div>
  );
};
```

---

## ✨ Características Generales

✅ **Responsivo**: Diseño mobile-first que se adapta a todos los tamaños  
✅ **Modo Oscuro**: Soporte completo para tema claro/oscuro  
✅ **Accesible**: Semántica HTML adecuada y navegación con teclado  
✅ **Paginación**: Tablas con soporte para grandes volúmenes de datos  
✅ **Validación**: Formularios con confirmaciones antes de acciones destructivas  
✅ **Loading States**: Spinners y estados de carga en botones y vistas  
✅ **Error Handling**: Manejo de errores con mensajes al usuario  
✅ **Comentarios en Español**: Código documentado para facilitar mantenimiento

---

Este informe cubre **todos los componentes React** del frontend de CELC. Cada componente sigue patrones consistentes de diseño y está integrado con hooks y context API para un flujo de datos coherente.

**Última actualización**: 4 de marzo de 2026
