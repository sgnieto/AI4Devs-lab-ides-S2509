## Bank Memory — Autenticación básica y roles (RBAC)

### Decisiones arquitectónicas (ADR breves)
1. Token de sesión: JWT HS256 de corta duración (15 min) sin refresh en MVP.
   - Motivo: simplicidad y time-to-value. Se evaluará refresh en épica posterior.
2. Almacenamiento del token en FE: memoria (Context) sin localStorage.
   - Motivo: reducir superficie de ataque XSS; UX aceptará re-login en expiración.
3. Hash de contraseñas: bcrypt con `saltRounds=12` (alternativa: argon2id).
   - Motivo: compatibilidad extendida; cost razonable.
4. RBAC: verificación en backend mediante middleware `authorizeRoles`.
   - Motivo: la UI oculta/inhabilita, pero la autorización real es del backend.
5. Rate limiting: 5 req/min/IP en `/api/auth/login`.
   - Motivo: mitigación de fuerza bruta.
6. Modelo `User`: añadir `passwordHash` y `role` (enum `Role`).
   - Motivo: cumplir requisitos de autenticación y permisos mínimos.
7. OpenAPI autogenerado desde metadatos en routers + Zod v4.
   - Motivo: sincronía contrato-implementación y tipos FE consistentes.

### Esquema de claims JWT
`{ sub: string, email: string, role: 'recruiter'|'hiring_manager'|'hr_ops', iat: number, exp: number }`

### Entidades y puertos
- `User { id, email, passwordHash, role }`
- `AuthRepository` → `findByEmail(email): Promise<User|undefined>`
- `UserRepository` existente para creación/gestión (se ampliará cuando toque CLI).

### Endpoints
- `POST /api/auth/login` → 200 `{ token }` | 401.
- `POST /api/auth/logout` → 204.

### Middlewares
- `authenticateJwt` añade `req.user`.
- `authorizeRoles('recruiter','hr_ops')` para proteger rutas (p. ej., candidatos).

### Entorno y configuración
- `AUTH_JWT_SECRET`, `AUTH_JWT_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`.

### Pruebas
- Unit: `LoginUseCase` válido/ inválido.
- E2E: login y acceso a ruta protegida.

### Pendientes explícitos (fuera del MVP)
- Refresh tokens y rotación.
- Lista de revocación persistente.
- Gestión de sesiones múltiples.


