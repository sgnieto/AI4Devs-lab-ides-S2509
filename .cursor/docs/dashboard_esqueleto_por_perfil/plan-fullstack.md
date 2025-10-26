## Plan de implementación full‑stack — Dashboard esqueleto por perfil

Referencia: épica `docs/user_stories/dashboard_esqueleto_por_perfil.md`, prompts MCP `prompts-shadcn.md` e informe UX `informe-ux.md`.

### Alcance (MVP)
- Ruta protegida `/dashboard` con topbar mostrando `email` y `role` desde JWT.
- Widgets mínimos por rol, listando candidatos recientes desde `/api/candidates`.
- Estados `loading/empty/error` coherentes y accesibles.
- Sin personalización avanzada ni persistencia de candidatos (mock/backend mínimo si no hay modelo).

### Supuestos y brecha detectada
- No existe el modelo `Candidate` en Prisma ni endpoint de listado. Para el MVP se implementará un endpoint mínimo de lectura con su repositorio asociado de base de datos y filtros `limit` y `sort` básicos. Para el entorno de desarrollo se implementará una migración de prisma específica para cargar información de candidatos para que se puedan visualizar en el dashboard.
- RBAC ya disponible vía middlewares `authenticateJwt` y `authorizeRoles` (backend) y `RequireRole` (frontend).

---

### Backend (Node/Express)
1) Endpoints mínimos de candidatos y repositorios
   - `GET /candidates` (protegido con `authenticateJwt`). Permitido para roles: `recruiter`, `hiring_manager`, `hr_ops`.
   - Parámetros soportados: `limit` (número), `sort` en formato `-createdAt` o `createdAt`.
   - Respuesta: lista de objetos `{ id, firstName, lastName, email, createdAt, phone?, resumeUrl? }`.
   - `CandidateRepository` y `PrismaCandidateRepository` para obtenición de los datos de los candidatos.
   - `CandidateSearchUseCase` (Busca la información de candidatos en base a los parametros soportados)

2) Ajuste del router
   - Archivo: `backend/src/candidates/infrastructure/http/candidates.router.ts`
   - Añadir `GET /` con `authenticateJwt` y lógica de orden/limit sobre un array fijo.
   - Mantener `GET /stats` (recruiter) como stub o derivarlo de la lista.

3) OpenAPI y tipos Frontend
   - Registrar el endpoint en el registro OpenAPI (si se usa el helper de registro de rutas).
   - Generar `backend/openapi.json` y luego tipos en `frontend/src/types/openapi.ts`.

4) Tests mínimos (opcional MVP)
   - Añadir prueba protegida que verifique 401 sin token y 200 con token para `GET /candidates`.

Comandos (PowerShell / Windows):
```powershell
cd backend
npm run generate:openapi
cd ..
cd frontend
npm run types:openapi
```

---

### Frontend (React + Router + Shadcn)
1) Consumo de API
   - Añadir función `fetchCandidates({ limit, sort })` en `frontend/src/lib/api.ts` usando `apiFetch` y el path `/candidates`.
   - En la página `/dashboard`, hacer `GET /candidates?limit=5&sort=-createdAt`.

2) UI del Dashboard (sin crear nueva estructura compleja)
   - Reutilizar `AppShell` y `RequireRole` existentes.
   - Mostrar H1 y leyenda con `email` y `role` desde `useSession`.
   - Estados: skeleton (`ui/skeleton`), empty y error (bloques o `Card` accesibles).
   - Cálculo “Candidatos hoy”: computado en UI sobre `createdAt` locales.

3) Widgets por rol (copys del informe UX)
   - Recruiter: KPI “Candidatos hoy”, lista “Últimos 5 candidatos” mostrando `nombre + apellido` / `email` / `createdAt`, CTA “Añadir candidato” (link placeholder).
   - Hiring Manager: lista “Recientes”, KPI “Total candidatos” si disponible (si no, nota “No disponible en MVP”).
   - HR Ops: KPI “Calidad de datos” (% con `phone` o `resumeUrl`), top 5 faltantes; CTA exportar deshabilitada con hint.

4) Accesibilidad
   - `aria-live` para mensajes `error/loading` y foco visible.
   - Evitar render de opciones no permitidas o mostrarlas deshabilitadas con hint accesible.

---

### Shadcn Studio (/cui) — Recolección e instalación
Sigue estrictamente `prompts-shadcn.md` (collect ALL → install → customize):
- Reutilizar existentes: `navbar-component-01`, `statistics-card-01`, `ui/skeleton`.
- Recolectar (si faltan): `list-basic-01` o `table-simple-01` (renderizar `nombre + apellido` / `email` / `createdAt` en “Últimos 5”), `empty-state-01`, `error-state-01`, `sidebar-component-0X` (si no usamos `ui/sidebar`).
- Instalar en un batch y personalizar contenido (textos/labels, no estructura).

---

### Validación y QA
- Flujo: login → dashboard → widgets por rol.
- LCP ≤ 2.5 s local gracias a skeletons y consultas ligeras.
- Permisos: 401/403 reflejados en UI; vistas no autorizadas con 403 UI.

---

### Estrategia de testing

Backend
- Unit
  - `CandidateSearchUseCase`: aplica `limit` y `sort` correctamente; sin mutar entrada.
  - `PrismaCandidateRepository` (si usa DB real en tests, marcar como integration). Alternativa: `InMemoryCandidateRepository` para pruebas unitarias del caso de uso.
  - Middlewares: ya existen tests de `authenticateJwt`/`authorizeRoles`; añadir casos para roles permitidos en `GET /candidates` (recruiter, hiring_manager, hr_ops).
- Integration (HTTP)
  - `GET /candidates` devuelve 401 sin token.
  - `GET /candidates` con JWT válido devuelve 200 y respeta `limit` y `sort`.
  - Estrategia: inyectar repo falso vía contenedor (DI) para evitar dependencia de DB en integración; datos deterministas desde fixtures.
- E2E (opcional en MVP)
  - Flujo `POST /auth/login` → JWT → `GET /candidates` 200. Cubrir 403 si se añade restricción de rol futuro.
- Datos de prueba
  - Recomendado: `fixtures` en `backend/src/tests/helpers/` para candidatos sintéticos y generación de JWT con `JWT_SECRET`.

Frontend
- Unit/Component
  - `/dashboard` estados: `loading` (skeleton visible), `empty` (copy accesible), `error` (botón Reintentar y `aria-live`).
  - Gating por rol con `RequireRole`: renderiza/oculta secciones según `session.role`.
  - Cálculo “Candidatos hoy”: correcto según fechas simuladas en items.
- Integration (React Testing Library)
  - Mock de `apiFetch`/MSW para `GET /candidates` con escenarios `200/empty/error`.
  - Verificar que copia y KPIs se muestran por rol (recruiter/hiring_manager/hr_ops).
  - Verificar “Últimos 5” renderiza `nombre + apellido`, `email` y `createdAt`.

Comandos (PowerShell / Windows)
```powershell
cd backend
$env:JWT_SECRET="test-secret"
npm test
cd ..
cd frontend
npm test
```

Cobertura (objetivo inicial)
- Backend: ≥ 70% líneas en `candidates` y middlewares.
- Frontend: ≥ 60% líneas en `/dashboard` y `RequireRole`.

---

### Plan de tareas y orden sugerido
1) Backend: `GET /candidates` + repositorio + usecase + registro OpenAPI.
2) Tests backend: unit (usecase, middlewares) e integration (HTTP con repo falso).
3) Generar OpenAPI + tipos Frontend.
4) Frontend: consumo API, estados y widgets por rol.
5) Tests frontend: estados, gating y KPIs.
6) /cui Shadcn: recolectar/instalar/personalizar bloques faltantes.
7) QA manual y ajustes de accesibilidad.

---

### Rollback
- El endpoint de candidatos es no destructivo (solo lectura, mock). Se puede retirar sin afectar datos.
- Frontend conserva gating existente y no modifica rutas globales.


