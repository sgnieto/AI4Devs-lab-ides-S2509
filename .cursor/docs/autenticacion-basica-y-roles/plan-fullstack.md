## Plan técnico desatendido — Épica 01: Autenticación básica y roles (RBAC)

### 1) Estado actual del repositorio (resumen corto)
- Backend (Express + TS): rutas registradas vía `registerRouter`, `users` con `POST /users/` y metadatos OpenAPI. No hay auth/JWT aún.
- Prisma: modelo `User { id, email, name? }` sin `passwordHash` ni `role`.
- OpenAPI: generado con autodetección de rutas; sin endpoints de auth.
- Frontend (React+TS+shadcn): app de ejemplo; no hay rutas protegidas ni login.

### 2) Objetivo de la épica
- Entregar login/logout con JWT, RBAC básico, rutas/backend protegidos, y esqueleto de UI por rol.

### 3) Alcance técnico por capas

#### 3.1 Backend (API, dominio y seguridad)
1. Modelo de datos Prisma
   - Ampliar `User` con `passwordHash String` y `role String` (`enum Role { recruiter hiring_manager hr_ops }`).
   - Migración y generación de cliente.
2. Casos de uso y repositorios
   - `AuthRepository` y `PrismaAuthRepository` para lookup por email.
   - `LoginUseCase` (valida credenciales con bcrypt/argon2, emite JWT), `LogoutUseCase` (lista de tokens inválidos en memoria simple para MVP).
3. Infraestructura HTTP
   - Router `auth.router.ts` con `POST /api/auth/login` y `POST /api/auth/logout`.
   - Middleware `authenticateJwt` que valida `Authorization: Bearer <token>` y añade `req.user`.
   - Middleware `authorizeRoles(...roles)` que verifica `req.user.role`.
4. Seguridad
   - JWT HS256 con `AUTH_JWT_SECRET`, `AUTH_JWT_EXPIRES_IN` corto (15m) para access token.
   - Rate limiting en `/api/auth/login` (5 req/min/IP) con `express-rate-limit`.
   - Hash de contraseña con `bcrypt` (cost 10-12) o `argon2id`.
5. OpenAPI
   - Anotar rutas de auth y añadir esquemas Zod v4 para `LoginRequest`, `LoginResponse` y errores.

Entregables BE:
- Prisma actualizado, migración aplicada.
- Routers `auth` y middlewares de `authn/authz` funcionales.
- OpenAPI con paths de auth y guards documentados por código.

#### 3.2 Frontend (UI, routing, estado de sesión)
1. Tipos OpenAPI actualizados (`npm --prefix frontend run types:openapi`).
2. Estado de sesión en memoria (Context) con persistencia opcional de refresh no incluida en MVP.
3. Rutas protegidas: HOC/`RequireAuth` que redirige a `/login` si no hay sesión.
4. Pantalla `Login`: formulario accesible con estados `loading/error/success`, toasts, focus management, `aria-live`.
5. AppShell + Navbar condicional por rol.
6. Dashboard por rol con tarjetas y tabla reciente (mock de datos o integración futura con candidatos).

Entregables FE:
- `/login`, `/dashboard`, `/candidates` protegidas.
- Navbar y contenidos condicionales por `role` (`recruiter`, `hiring_manager`, `hr_ops`).

### 4) Diseño de contratos (Zod/OpenAPI)
- LoginRequest: `{ email: z.string().email(), password: z.string().min(8) }`.
- JwtClaims mínimos: `{ sub: string, email: string, role: Role, iat: number, exp: number }`.
- LoginResponse: `{ token: string }` o `{ accessToken: string }`.
- Logout: 204 sin body.

### 5) Variables de entorno (backend)
- `AUTH_JWT_SECRET` (obligatoria)
- `AUTH_JWT_EXPIRES_IN=900` (segundos)
- `BCRYPT_SALT_ROUNDS=12`

### 6) Tareas detalladas (orden de ejecución)
1) Prisma y dominio
   - Añadir `role` (enum) y `passwordHash` al modelo `User`.
   - Ejecutar migración y generar cliente.
   - Semillas locales (opcional) con usuarios de cada rol.
2) Seguridad y casos de uso
   - Instalar `bcrypt` (o `argon2`).
   - Implementar `LoginUseCase` y `AuthRepository`.
   - Firmar JWT con claims mínimos.
3) HTTP y middlewares
   - `authenticateJwt` y `authorizeRoles`.
   - `auth.router.ts` con login/logout; rate limit en login.
   - Registrar router: `app.use('/api/auth', registerRouter('/api/auth', authRouter));`
4) OpenAPI
   - Registrar metadatos y regenerar `openapi.json`.
5) Frontend
   - Generar tipos OpenAPI.
   - Crear `AuthProvider`, `useAuth`, `RequireAuth`.
   - Implementar `Login` y `AppShell` con Navbar por rol.
   - Dashboard y rutas protegidas.
6) Tests
   - Unitarios de `LoginUseCase`: válido/ inválido.
   - E2E: login con Supertest; acceso a ruta protegida con/ sin token.
7) DX
   - Scripts `npm run generate:openapi` y sync de tipos FE.

### 7) Criterios de aceptación (trazabilidad)
- HU-01: `POST /api/auth/login`, JWT con claims mínimos, 401 en inválidas, rate limit, verificación de hash.
- HU-02: `POST /api/auth/logout` → 204; invalidación básica en memoria.
- HU-03: Middleware `authorizeRoles` aplicado a rutas de candidatos (placeholder hasta que exista el módulo).
- HU-04: FE con rutas protegidas y dashboards por rol.
- HU-05: CLI mínimo (post-épica o ticket paralelo; se deja plan de comandos).

### 8) Plan CLI (mínimo, backend script)
- `users:create --email --role [--password]`
- `users:list [--role]`
- `users:role --email --role`
- `users:reset-password --email [--password]`

- Política de contraseñas (CLI): mínimo 8 caracteres. Validación en CLI y backend. Si no se pasa `--password`, el CLI generará una contraseña segura que cumpla la política y la mostrará en salida segura (u opción `--json`).
- Si la variable de entorno env es distinto de prod, almacena el detalle de los usuarios, incluidas las credenciales en el fichero users-{env}.json

### 9) Observabilidad y seguridad
- Logs de intentos fallidos sin filtrar existencia de email.
- No almacenar tokens en localStorage; mantenerlos en memoria.
- Configurar CORS si FE/BE están en orígenes distintos.

### 10) Riesgos y mitigación
- Falta de módulo candidatos: introducir stubs y proteger rutas desde ya.
- Expiración de token: en MVP no hay refresh; UX deberá re-login.
- Rate limiting: mensajes genéricos para no revelar cuentas.


### 11) Plan de testing (detallado)
1) Backend — Unit tests (Jest)
   - `LoginUseCase`:
     - Debe emitir JWT válido si `email` y `password` correctos.
     - Debe fallar con 401 si credenciales inválidas (mensaje genérico).
     - Debe registrar intentos fallidos (sin filtrar existencia de email).
   - `authenticateJwt`:
     - Rechaza sin `Authorization` o token inválido/expirado (401).
     - Acepta con token válido y adjunta `req.user`.
   - `authorizeRoles`:
     - 403 cuando el rol no está permitido; 200 cuando sí lo está.
   - Utilidades de seguridad (hash/compare, sign/verify JWT): casos felices y bordes.

2) Backend — Integration/E2E (Supertest)
   - `POST /api/auth/login`:
     - 200 con token y claims mínimos.
     - 401 con error genérico para credenciales inválidas.
     - Rate limit tras 5 intentos: 429.
   - `POST /api/auth/logout`:
     - 204 sin body; tras logout, token anterior no debe permitir acceso si usamos lista de revocación (para MVP: test opcional si se implementa).
   - Rutas protegidas de ejemplo (stub candidatos):
     - Acceso con rol permitido → 200.
     - Acceso con rol denegado → 403.
     - Acceso sin token → 401.

3) Frontend — Unit/Component (React Testing Library)
   - `Login` form:
     - Validación client-side (email formato, password min 8) y estados `loading/error`.
     - En éxito, dispara navegación a `/dashboard` y muestra toast.
     - En error 401 o 429, muestra alert con `role=alert` y `aria-live=assertive` y enfoca el título.
   - `AuthProvider`/`useAuth`:
     - Guarda token en memoria; limpia en logout.
   - `RequireAuth`:
     - Redirige a `/login` si no hay sesión; renderiza hijos si hay sesión.
   - `Navbar` condicional por rol:
     - Ítems visibles/ocultos según `role`.

4) Frontend — E2E ligero (opcional en MVP)
   - Con Playwright/Cypress (si disponible): flujo `login → dashboard → logout`.

5) Accesibilidad (a11y)
   - `aria-live` en errores de login y toasts.
   - Gestión de foco: tras error, foco en título; tras navegación, foco en `h1`.
   - Contraste de botones y enlaces: checks AA.

6) Cobertura y CI
   - Umbral mínimo de cobertura backend 70% líneas en módulo auth.
   - Ejecutar `npm test` en backend y frontend en CI.
   - Paso de generación OpenAPI y tipos FE en CI para detectar desalineaciones.


### 12) Nomenclatura de bloques Shadcn (oficial para /cui)
- auth/login: `login-01`
- layout/app shell: `app-shell-02`
- navigation/navbar: `navbar-12`
- dashboard/stat cards: `stat-cards-03`
- data-display/table: `data-table-05`
- forms/quick create: `quick-form-01`
- feedback/toast: `toast-01`
- feedback/alert-dialog: `alert-dialog-01`
- feedback/skeleton: `skeleton-01`

### 13) Reglas de alias y fallback MCP
- Alias únicos y sincronizados en `tsconfig.json` (paths), `craco.config.js` (webpack.alias + jest.configure.moduleNameMapper) y `jest.config.js`.
- Los tests deben usar SIEMPRE alias salvo excepciones documentadas.
- Si un bloque shadcn planificado no está en el registry, usar el flujo MCP para localizar alternativa equivalente (misma categoría/uso) y documentar el fallback.

