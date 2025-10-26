## Informe del Arquitecto — Dashboard esqueleto por perfil (MVP)

Resumen ejecutivo
- Se implementará un endpoint de lectura `GET /candidates` protegido por JWT para habilitar el dashboard.
- El frontend consumirá `/candidates?limit=5&sort=-createdAt` y mostrará widgets por rol con estados accesibles.
- Shadcn Studio seguirá el workflow /cui: colectar → instalar (batch) → personalizar.

Mapa técnico
- Backend: Express, middlewares `authenticateJwt` y `authorizeRoles`, router `candidates.router`.
- Frontend: React Router (`/dashboard`), `SessionContext`, `AppShell`, `RequireRole`, `apiFetch`.
- Tipos: OpenAPI → `frontend/src/types/openapi.ts`.

Tareas clave
1) Backend: añadir `GET /candidates` usa repositorio prisma, filtro `limit`, orden por `createdAt`. Añadir CandidateSearchUseCase.
2) Generar OpenAPI y tipos.
3) Frontend: función `fetchCandidates`, UI con estados y cálculos por rol.
4) Shadcn /cui: recolección e instalación en batch, luego personalización de copys.

Seguridad y permisos
- 401 si no hay JWT; 403 si el rol no está autorizado para rutas restringidas.
- UI no debe renderizar acciones no permitidas; vistas directas no autorizadas muestran 403 UI.

Rendimiento
- LCP ≤ 2.5 s con skeletons; datos limitados (limit=5).

Riesgos
- Ausencia de modelo `Candidate` → Genera repositorio prisma.
- Desalineación de contrato → refrescar OpenAPI + tipos tras formalizar modelo.


