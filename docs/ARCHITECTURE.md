# 🏗️ Arquitectura CELC — Stack, Configuración y Estructura

**Sistema para el Control de Equipos y Líneas de Comunicación**

Documento maestro de arquitectura del monorepo. Cubre stack tecnológico, configuración general, patrones arquitectónicos y estructura de directorios de los tres paquetes.

> **Última actualización**: 2 de junio de 2026
> **Alcance**: `celc-backend` (NestJS + Prisma) + `celc-frontend` (React + Vite) + `mcp-mariadb-server` (auxiliar)

---

## 📑 Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Configuración General](#3-configuración-general)
4. [Arquitectura](#4-arquitectura)
5. [Estructura de Directorios](#5-estructura-de-directorios)
6. [Estado de Calidad y Observaciones](#6-estado-de-calidad-y-observaciones)
7. [Próximos Pasos (SDD)](#7-próximos-pasos-sdd)

---

## 1. Visión General

CELC es un **sistema interno de gestión de telecomunicaciones** para control de líneas celulares, equipos terminales y asignaciones a usuarios. Maneja ciclo completo: alta de líneas/equipos, asignación a empleados, revisiones técnicas, reportes y métricas.

### 1.1 Tipo de Sistema

| Atributo | Valor |
|----------|-------|
| **Tipo** | SPA + API REST monolítica modular |
| **Backend** | NestJS (Node.js 20+ con ESM) |
| **Frontend** | SPA React 19 con Vite |
| **Base de datos** | MariaDB (compatible con MySQL) |
| **Autenticación** | JWT Bearer (8h expiry) |
| **Roles** | Administrador, Técnico, Empleado |
| **Package Manager** | pnpm con workspaces |
| **Idioma del código** | Comentarios y commits en español |

### 1.2 Paquetes del Monorepo

```
CELC/
├── celc-backend/        # API REST NestJS + Prisma
├── celc-frontend/       # SPA React 19
│   └── mcp-mariadb-server/   # Servidor MCP para DB (auxiliar)
└── openspec/            # Artefactos SDD (cambios propuestos)
```

---

## 2. Stack Tecnológico

### 2.1 Frontend (`celc-frontend/`)

**Runtime & Framework**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `react` | ^19.1.1 | Biblioteca UI |
| `react-dom` | ^19.1.1 | Render DOM |
| `react-router-dom` | ^7.9.4 | Routing SPA |

**Estado y Datos**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `zustand` | ^5.0.13 | State management global |
| `axios` | ^1.12.2 | Cliente HTTP con interceptores |

**UI y Visualización**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `tailwindcss` | ^4.3.0 | CSS utility-first |
| `@tailwindcss/postcss` | ^4.3.0 | PostCSS plugin v4 |
| `react-icons` | ^5.5.0 | Set de iconos |
| `echarts` | ^6.1.0 | Gráficos dashboard |
| `echarts-for-react` | ^3.0.6 | Wrapper React de ECharts |

**Exportación de Reportes**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `jspdf` | ^4.2.1 | Generación PDF |
| `jspdf-autotable` | ^5.0.8 | Tablas en PDF |
| `xlsx` | ^0.18.5 | Lectura/escritura Excel |
| `xlsx-js-style` | ^1.2.0 | Estilos en Excel |

**DevDependencies**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `vite` | ^7.1.7 | Bundler / dev server |
| `@vitejs/plugin-react` | ^5.0.4 | Fast Refresh + JSX |
| `typescript` | ~5.9.3 | Compilador TS |
| `vitest` | ^4.1.6 | Test runner (Vite-native) |
| `@testing-library/react` | ^16.3.2 | Testing utilities |
| `@testing-library/jest-dom` | ^6.9.1 | Matchers DOM |
| `jsdom` | ^29.1.1 | Simulador DOM para tests |
| `eslint` | ^9.36.0 | Linter |
| `typescript-eslint` | ^8.45.0 | Reglas TS |
| `eslint-plugin-react-hooks` | ^5.2.0 | Reglas hooks |
| `eslint-plugin-react-refresh` | ^0.4.22 | Reglas Fast Refresh |
| `postcss` | ^8.5.15 | Post-procesador CSS |
| `autoprefixer` | ^10.5.0 | Autoprefijos vendor |

> **Ver**: [celc-frontend/package.json](../../celc-frontend/package.json)

### 2.2 Backend (`celc-backend/`)

**Framework & Core**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@nestjs/core` | ^11.0.1 | Framework principal |
| `@nestjs/common` | ^11.0.1 | Decoradores/utilidades |
| `@nestjs/platform-express` | ^11.0.1 | HTTP adapter |
| `@nestjs/config` | ^4.0.2 | Config desde env vars |
| `rxjs` | ^7.8.1 | Reactive streams |
| `reflect-metadata` | ^0.2.2 | Runtime de decoradores |

**Autenticación & Seguridad**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@nestjs/jwt` | ^11.0.0 | Integración JWT |
| `@nestjs/passport` | ^11.0.5 | Estrategias Passport |
| `passport` | ^0.7.0 | Core Passport |
| `passport-jwt` | ^4.0.1 | Estrategia JWT |
| `jsonwebtoken` | ^9.0.2 | Firma manual |
| `bcrypt` | ^6.0.0 | Hash de contraseñas |

**ORM & Base de Datos**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@prisma/client` | ^7.8.0 | Cliente Prisma |
| `@prisma/adapter-mariadb` | ^7.8.0 | Adapter MariaDB |
| `prisma` | ^7.8.0 | CLI Prisma |
| `mariadb` | ^3.5.2 | Driver nativo |
| `mysql2` | ^3.15.2 | Driver MySQL alternativo |

**Validación & Documentación**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `class-validator` | ^0.14.2 | Decoradores de validación |
| `class-transformer` | ^0.5.1 | Transformación de DTOs |
| `express-validator` | ^7.2.1 | Validación middleware |
| `@nestjs/swagger` | ^11.2.0 | OpenAPI / Swagger |
| `cors` | ^2.8.5 | CORS middleware |
| `dotenv` | ^17.2.3 | Loader de .env |

**DevDependencies**

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `typescript` | ^5.7.3 | Compilador TS |
| `@nestjs/cli` | ^11.0.0 | CLI schematics |
| `jest` | ^30.0.0 | Test framework |
| `ts-jest` | ^29.2.5 | Transformador TS para Jest |
| `supertest` | ^7.0.0 | Aserciones HTTP |
| `eslint` | ^9.18.0 | Linter |
| `typescript-eslint` | ^8.20.0 | Reglas TS |
| `prettier` | ^3.4.2 | Formateador |

> **Ver**: [celc-backend/package.json](../../celc-backend/package.json)

### 2.3 MCP Server (`mcp-mariadb-server/`)

Servidor MCP (Model Context Protocol) standalone para asistencia de IA con acceso directo a MariaDB y poblado de datos mock para desarrollo.

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `@modelcontextprotocol/sdk` | ^0.5.0 | SDK MCP |
| `mysql2` | ^3.6.0 | Driver MySQL |
| `zod` | ^3.22.0 | Validación de schemas |
| `bcryptjs` | ^2.4.3 | Hash de passwords mock |

> **Ver**: [mcp-mariadb-server/package.json](../../celc-frontend/mcp-mariadb-server/package.json)

---

## 3. Configuración General

### 3.1 Estructura del Monorepo

**Workspace VS Code** — [CELC.code-workspace](../../CELC.code-workspace)

```json
{
  "folders": [
    { "path": "." },
    { "path": "." }
  ]
}
```

> ⚠️ **Observación**: La configuración actual duplica la carpeta raíz. No hay settings globales declarados.

**pnpm Workspaces**

Cada paquete declara sus propios `pnpm-workspace.yaml` para controlar builds explícitos de dependencias con binarios nativos:

- `celc-backend/pnpm-workspace.yaml`: permite builds para `@nestjs/core`, `@prisma/engines`, `bcrypt`, `prisma`, `unrs-resolver`
- `celc-frontend/pnpm-workspace.yaml`: permite builds para `core-js`, `esbuild`

### 3.2 Scripts Disponibles

**Frontend** ([celc-frontend/package.json](../../celc-frontend/package.json#L7-L12))

| Script | Comando | Propósito |
|--------|---------|-----------|
| `dev` | `vite` | Dev server (HMR) |
| `build` | `tsc -b && vite build` | Compilación producción |
| `lint` | `eslint .` | Análisis estático |
| `preview` | `vite preview` | Preview de build |
| `test` | `vitest` | Tests (sin scripts aún) |

**Backend** ([celc-backend/package.json](../../celc-backend/package.json#L8-L22))

| Script | Comando | Propósito |
|--------|---------|-----------|
| `build` | `nest build` | Compilación TS → JS |
| `start` | `nest start` | Arranque normal |
| `start:dev` | `nest start --watch` | Watch mode |
| `start:debug` | `nest start --debug --watch` | Watch + debug |
| `start:prod` | `node dist/main` | Producción |
| `lint` | `eslint ... --fix` | Lint con autofix |
| `format` | `prettier --write ...` | Formatear código |
| `test` | `jest` | Unit tests |
| `test:e2e` | `jest --config ./test/jest-e2e.json` | E2E tests |

**MCP Server** ([mcp-mariadb-server/package.json](../../celc-frontend/mcp-mariadb-server/package.json))

| Script | Comando | Propósito |
|--------|---------|-----------|
| `build` | `tsc && chmod 755 build/index.js` | Compilar server |
| `populate` | `node ./scripts/populate_mock.js` | Poblar DB con mocks |

### 3.3 Variables de Entorno

**Backend** ([celc-backend/.env](../../celc-backend/.env))

```ini
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_DATABASE=CELC
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

> ⚠️ **RIESGO DE SEGURIDAD**: Credenciales hardcodeadas en el repositorio. Migrar a variables de entorno por entorno y eliminar del control de versiones.

**Frontend** ([celc-frontend/.env.example](../../celc-frontend/.env.example))

```ini
VITE_API_URL=http://localhost:3001/api
```

### 3.4 Linting y Formatting

| Aspecto | Frontend | Backend |
|---------|----------|---------|
| **Linter** | ESLint 9.36.0 flat config | ESLint 9.18.0 flat config |
| **Formatter** | ❌ No configurado | Prettier 3.4.2 |
| **Reglas TS** | `typescript-eslint` recommended | `typescript-eslint` recommended + Prettier |
| **Reglas React** | `reactHooks` + `reactRefresh` | N/A |
| **Reglas custom** | — | `no-explicit-any: OFF`, `no-floating-promises: WARN` |
| **`.prettierrc`** | ❌ No existe | ✅ `{ singleQuote: true, trailingComma: "all" }` |
| **`.editorconfig`** | ❌ No existe | ❌ No existe |

### 3.5 TypeScript

**Frontend** ([celc-frontend/tsconfig.app.json](../../celc-frontend/tsconfig.app.json))

| Flag | Valor |
|------|-------|
| Target | ES2022 |
| Module | ESNext |
| JSX | react-jsx |
| Module Resolution | bundler |
| `strict` | `true` |
| `noUnusedLocals` | `true` |
| `noUnusedParameters` | `true` |
| `noFallthroughCasesInSwitch` | `true` |
| `noUncheckedSideEffectImports` | `true` |

**Backend** ([celc-backend/tsconfig.json](../../celc-backend/tsconfig.json))

| Flag | Valor |
|------|-------|
| Target | ES2023 |
| Module | nodenext |
| Module Resolution | nodenext |
| `strictNullChecks` | `true` |
| `experimentalDecorators` | `true` |
| `emitDecoratorMetadata` | `true` |
| `esModuleInterop` | `true` |
| `noImplicitAny` | `false` ⚠️ |
| `outDir` | `./dist` |

### 3.6 Testing

| Aspecto | Frontend | Backend |
|---------|----------|---------|
| **Framework** | Vitest 4.1.6 | Jest 30.0.0 |
| **Test Environment** | jsdom 29.1.1 | node |
| **HTTP assertions** | — | Supertest 7.0.0 |
| **Setup files** | `src/setupTests.ts` (jest-dom) | `ts-jest` transform |
| **Tests escritos** | **0** ⚠️ | **1 e2e** (root GET) ⚠️ |
| **Configuración** | Globals `true` (no requiere imports de `describe`/`it`) | `testRegex: .*\.spec\.ts$` |

---

## 4. Arquitectura

### 4.1 Patrón General

| Capa | Patrón | Evidencia |
|------|--------|-----------|
| **Frontend** | Feature-Based + Hybrid (Zustand + Custom Hooks) | [src/features/](../../celc-frontend/src/features), [src/store/](../../celc-frontend/src/store), [src/hooks/](../../celc-frontend/src/hooks) |
| **Backend** | NestJS Modular con DI | [src/app.module.ts](../../celc-backend/src/app.module.ts) |
| **Persistencia** | Repository via Prisma ORM | [src/database/](../../celc-backend/src/database) |
| **Auth** | JWT + Role-Based Guards | [src/auth/](../../celc-backend/src/auth) |
| **API Docs** | OpenAPI / Swagger | `/api/docs` |
| **Validación** | DTOs + class-validator + global ValidationPipe | [src/main.ts](../../celc-backend/src/main.ts#L14) |
| **Errores** | Filtro global Prisma-aware | [src/common/http-exception.filter.ts](../../celc-backend/src/common/http-exception.filter.ts) |

### 4.2 Frontend — Feature-Based

El frontend organiza el código por **dominios de negocio** (features), no por tipo de archivo técnico.

**Capas**

```
src/
├── features/          # Dominios (auth, usuarios, equipos, etc.)
│   └── {feature}/
│       └── store/     # Store Zustand específico del feature
├── hooks/             # Custom hooks CRUD compartidos
├── store/             # Stores globales (useDataStore, useUIStore)
├── shared/
│   ├── api/           # Cliente axios + endpoints
│   ├── components/    # UI reutilizable (Button, Modal, DataTable, etc.)
│   └── types/         # Tipos compartidos
├── views/             # Páginas (Login, Dashboard, Users, etc.)
├── layouts/           # AppLayout con Sidebar + Header
└── App.tsx            # Router + Auth guard
```

**Gestión de Estado**

| Store | Tipo | Responsabilidad |
|-------|------|-----------------|
| `useAuthStore` | Zustand (en `features/auth/store/`) | Token, user, login, logout, checkSession |
| `useDataStore` | Zustand (raíz) | Cache 5min de users, equipos, líneas, asignaciones, revisiones |
| `useUIStore` | Zustand (raíz) | Sidebar toggle, theme dark/light, toast notifications |

**Custom Hooks CRUD** (en `src/hooks/`)

- `useUsers()`, `useLines()`, `useEquipments()`, `useAssignments()`, `useReviews()`, `useMetrics()`
- Cada uno: fetch inicial + `add*` / `edit*` / `remove*`
- Consumen endpoints de [shared/api/endpoints/](../../celc-frontend/src/shared/api/endpoints)

**Interceptor HTTP** ([src/shared/api/client.ts](../../celc-frontend/src/shared/api/client.ts))

- Request: inyecta `Authorization: Bearer {token}` desde `useAuthStore`
- Response: en 401 → `logout()` automático

**Routing y Protección** ([src/App.tsx](../../celc-frontend/src/App.tsx))

- React Router v7 con rutas declaradas
- `ProtectedRoute` valida autenticación y roles (`Administrador`, `Técnico`, `Empleado`)
- 8 vistas: Login, Dashboard, Users, Equipments, Lines, Assignments, Reviews, Reports

**Mapa de Features**

| Feature | Store | Hook CRUD | Vista | Estado |
|---------|-------|-----------|-------|--------|
| auth | `features/auth/store/authStore.ts` | — | `LoginView` | ✅ |
| dashboard | — | `useMetrics` (vacío) | `DashboardView` (ECharts) | ✅ |
| usuarios | — | `useUsers` | `UsersView` | ✅ |
| equipos | — | `useEquipments` | `EquipmentsView` | ✅ |
| lineas | — | `useLines` | `LinesView` | ✅ |
| asignaciones | — | `useAssignments` | `AssignmentsView` | ✅ |
| revisiones | — | `useReviews` | `ReviewsView` | ✅ |
| reportes | — | — | `ReportsView` (PDF + Excel) | ✅ |

### 4.3 Backend — NestJS Modular

**Módulos de Negocio** ([src/app.module.ts](../../celc-backend/src/app.module.ts))

| Módulo | Responsabilidad | Endpoints Base | Guards |
|--------|-----------------|----------------|--------|
| `auth` | Login, register, verify JWT | `POST /api/auth/login` `/register`, `GET /verify` | `JwtGuard`, `RoleGuard` |
| `usuarios` | CRUD de usuarios y perfiles | `GET/POST/PUT/DELETE /api/usuarios` | `JwtGuard` + `RoleGuard([1])` (admin) |
| `lineas` | CRUD de líneas telefónicas | `GET/POST/PUT/DELETE /api/lineas` | `JwtGuard` + `RoleGuard([1,2])` |
| `equipos` | CRUD de equipos | `GET/POST/PUT/DELETE /api/equipos` | `JwtGuard` |
| `asignaciones` | Asignar equipo+línea a usuario | `GET/POST/PUT/DELETE /api/asignaciones` | `JwtGuard` |
| `revisiones` | Revisiones técnicas de equipos | `GET/POST/PUT/DELETE /api/revisiones` | `JwtGuard` |
| `reportes` | Reportes filtrados | `GET /api/reportes/{lineas|equipos|asignaciones}` | `JwtGuard` |
| `metricas` | Estadísticas del sistema | `GET /api/metricas/*` | `JwtGuard` |
| `database` | Conexión Prisma + MariaDB | — | Provider global |
| `common` | Filtro global de excepciones | — | Filter global |

**Autenticación** ([src/auth/](../../celc-backend/src/auth))

```typescript
// jwt.guard.ts
@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Lee Authorization: Bearer <token>
    // Verifica con ConfigService.get('JWT_SECRET')
    // Inyecta request.user con payload decodificado
    // Lanza UnauthorizedException si inválido
  }
}

// role.guard.ts
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private requiredRoles: number[]) {}
  // Compara request.user.id_rol contra requiredRoles
  // Lanza ForbiddenException si no coincide
}
```

**JWT Payload** ([src/auth/user.interface.ts](../../celc-backend/src/auth/user.interface.ts))

```typescript
interface User {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  fecha_nacimiento?: Date;
  correo_electronico: string;
  contrasena_hash: string;
  id_rol: number;          // 1=Admin, 2=Técnico, 3=Empleado
  fecha_creacion: Date;
  ultimo_login?: Date;
  activo?: boolean;
}
```

**Validación con DTOs**

- `class-validator` + `class-transformer` con decoradores (`@IsEmail`, `@MinLength(6`, etc.)
- `ValidationPipe` global configurado en [main.ts](../../celc-backend/src/main.ts#L14)
- ✅ Auth DTOs completos
- ✅ Usuarios y Líneas DTOs presentes
- ⚠️ **Equipos, Asignaciones, Revisiones sin DTOs** (usan `@Body() body: any`)

**Manejo de Excepciones** ([src/common/http-exception.filter.ts](../../celc-backend/src/common/http-exception.filter.ts))

Filtro global con manejo contextual de errores Prisma:

| Código Prisma | Significado | HTTP | Mensaje contextual |
|---------------|-------------|------|-------------------|
| `P2002` | Unique constraint violation | 409 | Identifica campo (teléfono, serie, IMEI, correo, cédula) |
| `P2003` | Foreign key violation | 409 | Indica dependencias activas |
| Otros | Genérico | 500 | "Internal server error" |

Response shape: `{ statusCode, message, timestamp }`

**CORS** ([src/main.ts](../../celc-backend/src/main.ts#L17-L23))

```typescript
app.enableCors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

> ⚠️ **Observación**: Orígenes hardcodeados. Migrar a env vars (`CORS_ORIGINS`).

**Swagger/OpenAPI** ([src/main.ts](../../celc-backend/src/main.ts#L25-L48))

- Disponible en `/api/docs`
- Decoradores: `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiParam`
- ⚠️ Coverage desigual: solo Auth, Usuarios, Líneas documentados

### 4.4 Modelo de Datos (Prisma)

**Provider**: `mysql` con adapter `@prisma/adapter-mariadb` ([prisma/schema.prisma](../../celc-backend/prisma/schema.prisma))

**Modelos principales**

| Modelo | Tabla | Campos clave | Relaciones |
|--------|-------|--------------|------------|
| `Usuario` | `Usuarios` | id, nombres, apellidos, cedula (unique), correo_electronico (unique), contrasena_hash, rolId, fecha_creacion, ultimo_login, activo | `rol` (many-to-one), `asignaciones`, `revisiones`, `registroErrores` |
| `Rol` | `Roles` | id_rol, nombreRol (unique), descripcion | `usuarios` (one-to-many) |
| `Linea` | `Lineas` | id_linea, numeroTelefono (unique), operador, planDatos, estado (`Activa`\|`Inactiva`\|`Suspendida`), fechaActivacion, fechaVencimientoPlan | `asignaciones` |
| `Equipo` | `Equipos` | id_equipo, marca, modelo, numeroSerie (unique), imei (unique), estado (`Disponible`\|`Asignado`\|`En_Mantenimiento`\|`Baja`), fechaAdquisicion | `asignaciones`, `revisiones` |
| `Asignacion` | `Asignaciones` | id_asignacion, usuarioId (FK), equipoId (FK, nullable), lineaId (FK, nullable), fechaAsignacion, fechaDesasignacion, observaciones | `usuario`, `equipo` (opt), `linea` (opt) |
| `Revision` | `Revisiones` | id_revision, equipoId (FK), fechaProgramada, fechaRealizada (nullable), resultado (`Aprobada`\|`Reparacion_Necesaria`\|`Rechazada`), observaciones, realizadaPorUsuario (FK) | `equipo`, `usuario` |
| `RegistroError` | `RegistroErrores` | id_registro_error, tipoError, descripcion_error, fechaHora, usuarioId (FK), ipOrigen, moduloAfectado | `usuario` |

**Índices** definidos en campos de búsqueda frecuente: `numeroTelefono`, `numeroSerie`, `correo`, `cedula`, `equipoId`, `lineaId`, `usuarioId`, `fechaHora`.

**Tipos de dominio en frontend** ([src/shared/types/api.types.ts](../../celc-frontend/src/shared/types/api.types.ts))

```typescript
type EquipoEstado = 'Disponible' | 'Asignado' | 'En_Mantenimiento' | 'Baja'
type LineaEstado = 'Activa' | 'Inactiva' | 'Suspendida'
type RevisionResultado = 'Aprobada' | 'Reparacion_Necesaria' | 'Rechazada'
```

> ⚠️ **Inconsistencia**: Los enums del schema Prisma (`En_Mantenimiento`) no están normalizados con el frontend (`En Mantenimiento`). Hay un mapeo manual de strings entre capas.

### 4.5 Seguridad

| Aspecto | Implementación | Estado |
|---------|----------------|--------|
| Autenticación | JWT Bearer con secret en `JWT_SECRET` | ✅ |
| Hash de passwords | bcrypt | ✅ |
| Expiración de tokens | 8 horas | ✅ |
| Autorización por rol | `RoleGuard` con array de roles permitidos | ✅ |
| CORS | Whitelist de orígenes | ⚠️ Hardcodeado |
| Variables de entorno | `.env` versionado | ⚠️ Riesgo crítico |
| SQL Injection | ORM Prisma (queries parametrizadas) | ✅ |
| Rate Limiting | ❌ No implementado | ❌ |
| Helmet (HTTP headers) | ❌ No implementado | ❌ |
| DTOs validación | Parcial (3 de 8 módulos) | ⚠️ |

---

## 5. Estructura de Directorios

### 5.1 Raíz del Monorepo

```
CELC/
├── CELC.code-workspace          # Workspace VS Code
├── celc-backend/                # API REST NestJS
├── celc-frontend/               # SPA React 19
│   └── mcp-mariadb-server/      # MCP server (subdirectorio)
└── openspec/                    # Artefactos SDD
    └── changes/
        └── celc-refactor/       # Change en fase tasks
            ├── explore.md
            ├── proposal.md
            ├── spec.md
            ├── design.md
            ├── tasks.md
            └── state.yaml
```

### 5.2 Frontend (`celc-frontend/src/`)

```
src/
├── App.tsx                              # Router principal + Auth guard
├── main.tsx                             # Entry point React
├── index.css                            # Tailwind v4 + theme tokens
├── setupTests.ts                        # Testing setup (jest-dom)
│
├── features/                            # Feature-based modules
│   ├── auth/
│   │   └── store/
│   │       └── authStore.ts             # Zustand auth state
│   ├── asignaciones/                    # (vacío, solo store planificado)
│   ├── equipos/                         # (vacío)
│   ├── lineas/                          # (vacío)
│   ├── reportes/                        # (vacío)
│   ├── revisiones/                      # (vacío)
│   ├── usuarios/                        # (vacío)
│   └── dashboard/hooks/                 # (vacío)
│
├── hooks/                               # Custom hooks CRUD (nivel raíz)
│   ├── useAssignments.ts
│   ├── useEquipments.ts
│   ├── useLines.ts
│   ├── useMetrics.ts
│   ├── useReviews.ts
│   └── useUsers.ts
│
├── store/                               # Zustand stores globales
│   ├── useDataStore.ts                  # Data cache (5min)
│   └── useUIStore.ts                    # UI state + theme + toasts
│
├── shared/
│   ├── api/
│   │   ├── client.ts                    # Axios + interceptores
│   │   └── endpoints/
│   │       └── index.ts                 # Endpoints por dominio
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/                          # Componentes reutilizables
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── DataTable.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Select.tsx
│   │       ├── Skeleton.tsx
│   │       └── Spinner.tsx
│   ├── hooks/                           # (vacío)
│   ├── services/                        # (vacío)
│   └── types/
│       └── api.types.ts                 # Tipos del dominio
│
├── layouts/
│   └── AppLayout.tsx                    # Layout (Header + Sidebar)
│
├── views/                               # Páginas
│   ├── LoginView.tsx
│   ├── DashboardView.tsx
│   ├── UsersView.tsx
│   ├── EquipmentsView.tsx
│   ├── LinesView.tsx
│   ├── AssignmentsView.tsx
│   ├── ReviewsView.tsx
│   └── ReportsView.tsx
│
├── context/                             # (vacío — preferencia por Zustand)
├── config/                              # (vacío)
├── assets/                              # Recursos estáticos
└── docs/
    ├── ARCHITECTURE.md                  # ← este documento
    └── COMPONENTES_REACT.md             # Inventario de componentes UI
```

**Directorios paralelos al `src/`**

```
celc-frontend/
├── docs/
│   ├── ARCHITECTURE.md
│   └── COMPONENTES_REACT.md
├── plans/
│   └── refactorizacion-frontend.md      # Plan de migración Tailwind v3→v4
├── mcp-mariadb-server/                  # MCP server (ver §5.4)
├── public/                              # Assets públicos
├── index.html                           # Entry HTML
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
└── README.md
```

### 5.3 Backend (`celc-backend/src/`)

```
src/
├── main.ts                              # Bootstrap (CORS, ValidationPipe, Swagger)
├── app.module.ts                        # Root module
├── app.controller.ts                    # Controller root
├── app.controller.spec.ts               # Unit test
├── app.service.ts                       # Service root
│
├── auth/                                # Módulo autenticación
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.dto.ts                      # LoginDto, RegisterDto
│   ├── auth.module.ts
│   ├── jwt.guard.ts
│   ├── jwt.middleware.ts
│   ├── role.guard.ts
│   ├── role.middleware.ts
│   └── user.interface.ts
│
├── common/
│   └── http-exception.filter.ts         # Filtro global Prisma-aware
│
├── database/
│   ├── database.module.ts
│   └── database.service.ts              # PrismaClient extendido
│
├── usuarios/                            # Módulo gestión usuarios
│   ├── usuarios.controller.ts
│   ├── usuarios.service.ts
│   ├── usuarios.dto.ts
│   └── usuarios.module.ts
│
├── lineas/                              # Módulo líneas
│   ├── lineas.controller.ts
│   ├── lineas.service.ts
│   ├── lineas.dto.ts
│   └── lineas.module.ts
│
├── equipos/                             # Módulo equipos
│   ├── equipos.controller.ts
│   ├── equipos.service.ts
│   └── equipos.module.ts                # ⚠️ Sin DTOs
│
├── asignaciones/                        # Módulo asignaciones
│   ├── asignaciones.controller.ts
│   ├── asignaciones.service.ts
│   └── asignaciones.module.ts           # ⚠️ Sin DTOs
│
├── revisiones/                          # Módulo revisiones
│   ├── revisiones.controller.ts
│   ├── revisiones.service.ts
│   └── revisiones.module.ts             # ⚠️ Sin DTOs
│
├── reportes/                            # Módulo reportes
│   ├── reportes.controller.ts
│   ├── reportes.service.ts
│   ├── reportes.dto.ts
│   └── reportes.module.ts
│
└── metricas/                            # Módulo métricas
    ├── metricas.controller.ts
    ├── metricas.service.ts
    └── metricas.module.ts
```

**Raíz del paquete**

```
celc-backend/
├── prisma/
│   └── schema.prisma                    # Schema Prisma
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── src/                                 # (ver arriba)
├── prisma.config.js
├── nest-cli.json
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.json
├── tsconfig.build.json
├── eslint.config.mjs
├── .prettierrc
├── .gitignore
├── .env
└── README.md
```

### 5.4 MCP Server (`celc-frontend/mcp-mariadb-server/`)

```
mcp-mariadb-server/
├── package.json
├── tsconfig.json
├── README.md
├── scripts/
│   ├── inspect_schema.js
│   └── populate_mock.js                 # Poblador de datos mock
└── src/
    └── index.ts                         # Server MCP principal
```

**Datos mock generados** por `populate_mock.js` (con TRUNCATE previo):

| Entidad | Cantidad |
|---------|----------|
| Roles | 5 |
| Usuarios | 20 |
| Equipos | 50 |
| Líneas | 50 |
| Asignaciones | 60 |
| Revisiones | 10 |
| RegistroErrores | 8 |

**Contraseña desarrollo**: `123456` (hasheada con bcrypt).

### 5.5 SDD / OpenSpec

**Directorio**: `openspec/changes/celc-refactor/`

| Artefacto | Estado |
|-----------|--------|
| `explore.md` | ✅ Completado |
| `proposal.md` | ✅ Completado |
| `spec.md` | ✅ Completado |
| `design.md` | ✅ Completado |
| `tasks.md` | ✅ Completado (listo para implementar) |
| `state.yaml` | `current_phase: tasks` |

**Proposal** — *"Refactoring Proposal: CELC Project Modernization & Hardening"*

Objetivos:
1. **Security Hardening**: SQL Injection via Prisma, Helmet HTTP headers, Rate Limiting
2. **Architectural Standardization**: NestJS Guards, remover express-validator
3. **Modern State Management**: React Context → Zustand
4. **UI/UX Redesign**: Dark mode, ECharts, tablas responsivas

---

## 6. Estado de Calidad y Observaciones

### 6.1 Resumen

| Aspecto | Estado | Severidad |
|---------|--------|-----------|
| TypeScript strict | ✅ Frontend completo, backend parcial | Media |
| DTOs validación | ⚠️ 3/8 módulos con DTOs | Alta |
| Tests escritos | ❌ 0 frontend, 1 e2e backend | Alta |
| Swagger coverage | ⚠️ Solo Auth, Usuarios, Líneas | Media |
| CORS orígenes | ⚠️ Hardcodeado | Baja |
| Credenciales en repo | ❌ `.env` versionado con secrets | **Crítica** |
| Rate limiting | ❌ No implementado | Alta |
| Helmet / HTTP headers | ❌ No implementado | Media |
| Prettier frontend | ❌ No configurado | Baja |
| Inconsistencia de enums | ⚠️ Prisma vs TS types | Media |
| Storybook | ❌ No instalado | Baja |
| CI/CD | ❌ Sin `.github/workflows/` | Alta |
| Docker / IaC | ❌ Sin Dockerfile, sin Terraform/Bicep | Alta |
| Code coverage | ❌ Sin herramientas configuradas | Alta |

### 6.2 Mapeo de Deuda Técnica por Área

**Seguridad** (crítico)

- Migrar secretos a variables de entorno fuera del repo
- Implementar Helmet y Rate Limiting
- Completar DTOs en módulos faltantes

**Calidad** (alto)

- Incrementar cobertura de tests (Vitest en frontend, Jest en backend)
- Configurar Prettier en frontend
- Agregar Storybook para documentar componentes

**DevOps** (alto)

- Crear Dockerfile + docker-compose para entorno de desarrollo
- Definir pipeline CI/CD en `.github/workflows/`
- Configurar code coverage reporting

**Documentación** (medio)

- Completar decoradores Swagger en módulos faltantes
- Generar tipos desde Prisma (`prisma generate`) e integrar en build

---

## 7. Próximos Pasos (SDD)

El proyecto tiene un **change activo** en `openspec/changes/celc-refactor/` en fase `tasks`, listo para implementar. Los items de mayor impacto:

1. **Security hardening** (Helmet, rate limit, mover secrets fuera del repo)
2. **Completar DTOs** en módulos de equipos, asignaciones y revisiones
3. **Incrementar cobertura de tests** (Vitest setup ya existe en frontend)
4. **Completar Swagger** en módulos faltantes
5. **Normalizar enums** Prisma ↔ TypeScript types
6. **Migrar CORS** a variables de entorno

> Para iniciar la implementación, usar el flujo SDD: `/sdd-apply celc-refactor` o revisar el archivo [tasks.md](../../openspec/changes/celc-refactor/tasks.md).

---

## 📚 Documentos Relacionados

- [COMPONENTES_REACT.md](./COMPONENTES_REACT.md) — Inventario detallado de componentes UI
- [refactorizacion-frontend.md](../plans/refactorizacion-frontend.md) — Plan de refactor del frontend
- [openspec/changes/celc-refactor/](../../openspec/changes/celc-refactor/) — Artefactos SDD del refactor
- [celc-backend/README.md](../../celc-backend/README.md) — README backend
- [celc-frontend/README.md](../../celc-frontend/README.md) — README frontend
