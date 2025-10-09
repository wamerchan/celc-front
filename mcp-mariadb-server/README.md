# MCP MariaDB Server (mock population)

Este subproyecto contiene un servidor MCP mínimo y utilidades para poblar la base de datos `CELC` con datos mock para desarrollo y pruebas.

## Estructura importante

- `scripts/populate_mock.js` - Script Node.js (ESM) que trunca tablas y genera datos mock:
  - Roles (5)
  - Usuarios (20)
  - Equipos (50)
  - Lineas (50)
  - Asignaciones (60)
  - Revisiones (10)
  - RegistroErrores (8)

- `package.json` - scripts útiles:
  - `npm run populate` — ejecuta `scripts/populate_mock.js`
  - `npm run build` — compila TypeScript (servidor MCP)

## Requisitos

- Node.js 18+ (ESM)
- MariaDB/MySQL accesible en `localhost:3306` con la base `CELC` y credenciales adecuadas.

Los datos de conexión están embebidos en `scripts/populate_mock.js` en la constante `DB_CONFIG`. Para entornos más seguros, extrae esas variables a un `.env` y actualiza el script en consecuencia.

## Uso rápido

1. Instalar dependencias:

```bash
cd mcp-mariadb-server
npm install
```

2. Ejecutar el poblado (ATENCIÓN: borra datos en tablas objetivo con TRUNCATE):

```bash
npm run populate
```

3. Verifica los datos en la base `CELC`.

## Contraseñas de desarrollo

El script está configurado para crear todos los usuarios con la contraseña en texto plano `123456`. Esta contraseña se hashea con bcrypt antes de insertarla en la columna `contrasena_hash`. Este comportamiento es únicamente para entornos de desarrollo.

Si quieres cambiar la contraseña usada o generar contraseñas únicas por usuario, modifica `scripts/populate_mock.js`.

## Notas de seguridad

- No uses este script ni las credenciales embebidas en entornos de producción.
- Considera retirar `TRUNCATE` o protegerlo detrás de una variable de entorno para evitar pérdida accidental de datos.

## Próximos pasos sugeridos

- Añadir un CLI con opciones (dry-run, número de filas, password, db config)
- Mover configuración sensible a variables de entorno
- Añadir tests unitarios para validación de formatos

---

Creado automáticamente para el flujo de desarrollo del proyecto.
