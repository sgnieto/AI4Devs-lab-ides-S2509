## Plan técnico desatendido — Épica: Añadir Candidato (alineado con UX)

### 1) Estado actual del repositorio (resumen)
- Backend (Express+TS, DDD): `GET /candidates` implementado con `CandidateSearchUseCase`. No existe `POST /candidates` ni `/candidates/suggest`.
- RBAC: middlewares `authenticateJwt` y `authorizeRoles` disponibles; roles: `recruiter`, `hiring_manager`, `hr_ops`.
- Prisma: modelo `Candidate { id, firstName, lastName, email(unique), phone?, resumeUrl?, createdAt }`. Faltan `direccion`, `educacion`, `experienciaLaboral`, `createdBy`.
- OpenAPI: generación automática disponible; candidates GET anotado. Falta anotar `POST` y `GET suggest`.
- Frontend (React+TS): `fetchCandidates` y guards `RequireAuth/RequireRole`. No hay formulario de creación.

### 2) Objetivo
Entregar creación de candidatos con validaciones, RBAC, autocompletado de `educacion` y `experienciaLaboral`, y soporte de CV mediante almacenamiento de archivos en `FILE_STORAGE_BASE_PATH` (sin `resumeUrl` en MVP), coherente con la épica y el informe UX.

### 3) Alcance técnico por capas

#### 3.1 Base de datos (Prisma)
1) Ampliar modelo `Candidate`:
   - Campos nuevos: `address String`, `education String`, `workExperience String`, `createdBy String` (FK a `User.id`).
   - Índices: `@@unique([email])` ya existe.
2) Migración: crear migración y regenerar cliente.

#### 3.2 Dominio y aplicación (backend)
1) DTOs Zod (v4) para creación y respuesta:
   - `CreateCandidateInput`: { firstName≤100, lastName≤100, email(valid), phone?, address≤200, education≤100, workExperience≤100, cvFile? (PDF/DOCX ≤5 MB) }. Los ficheros se almacenan bajo `FILE_STORAGE_BASE_PATH` con normalización y sufijos únicos; persistir `cvPath` en Candidate.
   - `CreateCandidateOutput`: recurso creado.
2) Caso de uso `CreateCandidateUseCase` (reglas):
   - Rechaza duplicado por email → error de dominio transformado a 409.
   - Persiste `createdBy` desde `req.user.sub` y `createdAt` por BD.
3) Repositorio Prisma: `create(data)` y `findByEmail(email)`.

#### 3.3 Infraestructura HTTP (Express)
1) Router `candidates.router.ts`:
   - `POST /candidates/`: `authenticateJwt` + `authorizeRoles('recruiter')`.
   - Body `multipart/form-data` (MVP) con campos + `cv` opcional. Validar tipo/tamaño; persistir `cvPath`.
   - Errores: 400 (validación), 409 (duplicado), 401/403.
   - OpenAPI: anotar `requestBodySchema` y `responseSchema`, `responseStatus: 201`.
2) Endpoint sugerencias:
   - `GET /candidates/suggest`: `authenticateJwt` + `authorizeRoles('recruiter','hr_ops')`.
   - Query: `field in ['educacion','experienciaLaboral']`, `q`, `limit<=10`.
   - Implementación: SELECT DISTINCT/ILIKE sobre columnas `education`/`workExperience` con conteo (`occurrences`).
   - OpenAPI: respuesta `{ items: Array<{ value, label, occurrences }> }`.

#### 3.4 Almacenamiento de archivos (MVP)
- MVP: habilitar almacenamiento con `multer` bajo `FILE_STORAGE_BASE_PATH`. Validar tipo (PDF/DOCX) y tamaño (≤5 MB), normalizar nombre/ruta y prevenir path traversal. Si no está configurada la ruta base, devolver 400 indicando usar envío sin archivo temporalmente.

#### 3.5 Frontend (React)
1) Formularios y UI:
   - Crear `src/components/shadcn-studio/CandidateForm.tsx` con inputs indicados.
   - Combobox accesible para `education` y `workExperience` usando `command + popover`.
2) Autocompletado:
   - Hook `useAutocomplete(field)` con debounce 250 ms, cancelación y caché.
   - Endpoint `GET /api/candidates/suggest`.
3) Integración API:
   - `createCandidate(input)`: POST `/api/candidates` y manejo de 201/400/409.
   - Mostrar `Toast` de éxito y actualizar lista sin recargar.
4) Guards de ruta:
   - Envolver página en `RequireAuth` y `RequireRole(['recruiter'])`.

### 4) Entregables y pasos de ejecución (Windows/PowerShell)
1) Backend — Prisma y casos de uso
   - Editar `backend/prisma/schema.prisma` y crear migración:
     ```powershell
     cd backend
     npx prisma migrate dev --name add_candidate_fields
     npx prisma generate
     ```
   - Implementar `CreateCandidateUseCase`, repositorio y rutas `POST /candidates` y `GET /candidates/suggest` con metadatos OpenAPI.
   - Generar OpenAPI y sincronizar tipos FE:
     ```powershell
     npm run generate:openapi
     cd ..
     npm --prefix frontend run types:openapi
     ```
2) Frontend — UI y lógica
   - Ejecutar flujo MCP /cui de Shadcn Studio siguiendo `.cursor/docs/anadir-candidato/prompts-shadcn.md` (collect → install → personalización).
   - Crear `CandidateForm.tsx` y `useAutocomplete.ts`.
   - Integrar en ruta protegida y probar.

### 5) Estrategia de testing
- Backend
  - Unit (dominio/casos de uso):
    - `CreateCandidateUseCase` crea con datos válidos.
    - Rechaza duplicado por email → error mapeado a 409.
    - Validación de DTO (longitudes, email).
  - Unit (infra):
    - Normalización de nombres de fichero y path safe.
    - Utilidad de validación de tipo/tamaño de archivo.
  - Integración HTTP (Supertest):
    - `POST /candidates` 201 con multipart y `cv` válido (PDF/DOCX ≤5MB).
    - `POST /candidates` 400 por validación (email inválido, campos faltantes, tipo/tamaño inválido).
    - `POST /candidates` 409 por duplicado.
    - `POST /candidates` 401 sin token; 403 con rol `hiring_manager`/`hr_ops`.
    - `GET /candidates/suggest` 200 con `q` y `field` válidos; 400 si `field` inválido.
  - E2E mínimo (si aplica runner): flujo login → crear candidato → aparece en listado.
- Frontend
  - Unit:
    - `useAutocomplete(field)` debounce 250 ms, cancelación y caché; maneja error devolviendo lista vacía y estado `error`.
    - Validaciones de formulario (requeridos, email, longitudes).
    - Componente `FileInput` valida tipo/tamaño antes de enviar.
  - Integración:
    - Mock de API: éxito 201 muestra Toast y limpia/redirige; 400/409 muestran errores inline/banners y conservan inputs.
    - Combobox accesible: navegación teclado, ARIA `combobox`/`listbox`, `no-results`.
  - E2E (React Testing Library + jest-dom):
    - Flujo completo con teclado: rellenar, seleccionar sugerencias, adjuntar `cv`, enviar, ver Toast y presencia en listado.

### 6) Observabilidad y configuración
- Logs de creación y errores con contexto de `createdBy`.
- Vars entorno: `FILE_STORAGE_BASE_PATH`, `PORT`, `DATABASE_URL`.

### 8) Riesgos y mitigaciones
- Subida de archivos: validar exhaustivamente tipo/tamaño; manejo robusto cuando falta `FILE_STORAGE_BASE_PATH`.
- Carga de sugerencias: limitar a 10, debounce, índices si se requiere.


