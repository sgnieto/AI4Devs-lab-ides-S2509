## Bank Memory — Arquitectura Dashboard por perfil (MVP)

Contexto proyecto: `AI4Devs-lab-ides-S2509`
Feature: Dashboard esqueleto por perfil (épica `docs/user_stories/dashboard_esqueleto_por_perfil.md`).

Clave de decisiones:
- Mantener MVP lean: endpoint `GET /candidates` con datos simulados en backend para habilitar UI y estados.
- Reutilizar bloques shadcn existentes y recolectar sólo lo mínimo adicional (listas/empty/error).
- RBAC consistente: back (`authenticateJwt`/`authorizeRoles`) y front (`RequireRole`).

Interfaces esperadas:
- GET `/candidates?limit=5&sort=-createdAt` → `Array<{ id, firstName, lastName, email, createdAt, phone?, resumeUrl? }>`
- GET `/candidates/stats` (recruiter) → `{ ok: true }` (stub actual)

Riesgos y mitigaciones:
- Falta de modelo Prisma `Candidate`: genera un repositorio en Prisma.
- Tipos OpenAPI/tipos TS: regenerar cuando se formalice el contrato.

Notas de implementación:
- Frontend `apiFetch` ya gestiona Authorization y errores JSON.
- `SessionContext` decodifica JWT y expone `email`/`role` para UI.


