# Épica 01 — Autenticación básica y roles (RBAC)

## Objetivo
Garantizar acceso seguro al ATS con contraseñas hasheadas y control de permisos por rol (`recruiter`, `hiring_manager`, `hr_ops`), habilitando dashboard y API protegidos.

## Métricas de éxito
- ≥ 95% logins exitosos (usuarios válidos).
- 0 accesos no autorizados a endpoints protegidos.
- Tiempo a primer acción tras login ≤ 5 min (p95).

---

## HU-01 — Iniciar sesión con credenciales
Como usuario de LTI, quiero iniciar sesión con email y contraseña para acceder al sistema según mi rol.

- Criterios de aceptación:
  1. Endpoint `POST /api/auth/login` acepta `{ email, password }`.
  2. Si credenciales válidas: 200 con JWT firmado (y opcionalmente en cookie HTTP-only secure) de corta duración; nunca devuelve `password` ni `passwordHash`.
  3. El token JWT contendrá los claims mínimos: `{ sub: id, email, role, iat, exp }`.
  4. Si inválidas: 401 con mensaje claro sin revelar si el email existe.
  5. Rate limiting activo para el endpoint (p. ej., 5 req/min por IP).
  6. Contraseñas verificadas contra hash seguro (bcrypt/argon2).

---

## HU-02 — Cerrar sesión
Como usuario autenticado, quiero cerrar sesión para revocar mi acceso desde el dispositivo actual.

- Criterios de aceptación:
  1. Endpoint `POST /api/auth/logout` invalida sesión/token actual.
  2. Respuesta 204 sin cuerpo.
  3. La UI redirige a la pantalla de login al cerrar sesión.

---

## HU-03 — Aplicar RBAC en API de candidatos
Como sistema, quiero restringir la API de candidatos según rol para evitar acciones no autorizadas.

- Criterios de aceptación:
  1. `POST /api/candidates`: permitido a `recruiter` y `hr_ops`; denegado a `hiring_manager` con 403.
  2. `GET /api/candidates`: permitido a `recruiter`, `hiring_manager`, `hr_ops`.
  3. Middleware de autorización verifica rol antes del controlador.
  4. Respuestas de error usan 401 (no autenticado) o 403 (sin permiso) coherentemente.

---

## HU-04 — Rutas UI protegidas y dashboard por rol
Como usuario autenticado, quiero que la UI proteja rutas y muestre el dashboard acorde a mi rol.

- Criterios de aceptación:
  1. Rutas del dashboard requieren sesión; sin sesión redirigen a `/login`.
  2. Menús y acciones no permitidas se ocultan/deshabilitan por rol.
  3. Dashboard:
     - `recruiter`: alta rápida, últimos 5 candidatos, conteo del día.
     - `hiring_manager`: candidatos recientes visibles y conteos básicos.
     - `hr_ops`: calidad de datos y herramientas de mantenimiento (cuando existan).

---

## HU-05 — CLI mínimo de gestión de usuarios
Como admin técnico, quiero gestionar usuarios desde CLI para operar el entorno local rápidamente.

- Criterios de aceptación:
  1. Comandos:
     - `users:create --email <email> --role <role> [--password <pwd>]`
     - `users:list [--role <role>]`
     - `users:role --email <email> --role <role>`
     - `users:reset-password --email <email> [--password <pwd>]`
  2. Las contraseñas se hashean antes de persistir.
  3. `users:create` falla con 409 si el email existe.
  4. Códigos de salida: 0 éxito; 1 validación; 2 error interno.
  5. Salida en tabla legible y opción `--json`.
  6. Si se ejecuta para el entorno de test, además de la persistencia definida, se almacenará en un fichero json los usuarios y sus credenciales para facilitar las labores posteriores de testing.

---

## Dependencias y notas
- Modelo `User` con `email` único, `passwordHash`, `role`.
- Sesión con cookie HTTP-only o JWT de corta duración.
- Rate limiting en `/api/auth/login`.
- Logs de intentos fallidos sin exponer secretos.