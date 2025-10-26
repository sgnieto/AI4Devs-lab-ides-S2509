## Informe técnico — Añadir Candidato

### Verificación de coherencia (épica ↔ UX ↔ código)
- RBAC: épica exige `recruiter`. Se deja nota en ADR.
- Datos: Prisma carece de `address`, `education`, `workExperience`, `createdBy`; se planifica migración.
- API existente: solo `GET /candidates`. Faltan `POST /candidates` y `GET /candidates/suggest` descritos por UX.
- Frontend: no existe formulario; se integrará vía Shadcn Studio siguiendo prompts.

### Riesgos y mitigaciones
- Subida de archivos: MVP con almacenamiento en `FILE_STORAGE_BASE_PATH`. No usar `resumeUrl`.
- Rendimiento de sugerencias: limitar resultados, usar debounce, valorar índices si escala.

### Checklist de implementación
- [ ] Migración Prisma y regeneración de cliente
- [ ] Caso de uso y repositorio de creación
- [ ] Rutas POST y GET suggest + OpenAPI
- [ ] Tipos FE desde OpenAPI
- [ ] UI CandidateForm + hook de autocompletado
- [ ] Pruebas (unit/int/e2e)


