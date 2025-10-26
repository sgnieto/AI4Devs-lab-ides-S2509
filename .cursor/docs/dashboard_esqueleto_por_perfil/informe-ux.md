## Informe UX — Dashboard esqueleto por perfil

Épica: `docs/user_stories/dashboard_esqueleto_por_perfil.md`
Objetivo: Dashboard mínimo, seguro y útil por rol (`recruiter`, `hiring_manager`, `hr_ops`) inmediatamente tras login.

### 1) Análisis inicial
- Éxito: p95 ≤ 60 s a primera acción útil; 0 accesos no autorizados; LCP ≤ 2.5 s.
- Dependencias: login operativo, `/api/candidates` disponible, RBAC aplicado.
- Frontend actual: ruta `/dashboard` protegida por token, `AppShell` con navbar, `RequireRole` para gating por rol, bloques shadcn básicos instalados.

### 2) Interpretación (flujos principales)
1. Usuario visita `/login` → hace login → redirección a `/dashboard`.
2. En `/dashboard`, topbar muestra `email` y `role` (desde sesión).
3. Render condicional por rol:
   - Recruiter: alta rápida (CTA), últimos 5 candidatos, “Candidatos hoy”.
   - Hiring Manager: “Recientes” y “Total candidatos” (si disponible).
   - HR Ops: “Calidad de datos” y top 5 con carencias.
4. Estados universales: `loading`, `empty`, `error` con reintento.

### 3) Diseño (layout y componentes)
- Layout: `AppShell` con `Navbar`; contenedor max-w-7xl; jerarquía H1 → descripción → secciones.
- Navegación/IA: `/login`, `/dashboard` (home). En MVP no hay subrutas.
- Componentes:
  - KPI cards: `statistics-card-01` para contadores simples.
  - Lista reciente: bloque de lista/table simple (5 ítems).
  - Empty/Error: bloques dedicados o `Card` accesibles si no existen en registry.
  - Skeletons: `ui/skeleton` para placeholders.

### 4) Decisión informada (trade-offs)
- Tabla vs lista: lista simple reduce ruido en MVP y carga cognitiva.
- “Total candidatos”: se muestra sólo si hay dato; evitar valor ficticio.
- HR Ops: enfoque en calidad de datos sobre volumen para impacto rápido.

### 5) Prompts MCP (/cui)
Ver `prompts-shadcn.md`. Cumple: collect → install (batch) → customize.

### 6) Validación (accesibilidad y rendimiento)
- Accesibilidad: 
  - Skip link en `AppShell` (ya presente). 
  - Roles ARIA en `header`/`main`. 
  - `aria-live` para mensajes `error/loading`.
  - Controles alcanzables por teclado; foco visible.
- Rendimiento: 
  - LCP ≤ 2.5 s con skeletons.
  - Evitar consultas pesadas; lazy de vistas no críticas.

### 7) Mapeo a criterios de aceptación
- CA-1 Redirección sin sesión → `/login` con aviso: Protegido por token en router; añadir aviso UI.
- CA-2 Topbar con email/rol: ya soportado por `SessionContext`.
- CA-3 Navegación lateral condicional: render condicional por `RequireRole` o deshabilitado con hint.
- CA-4 Accesos directos no permitidos → vista 403 UI: devolver vista 403 en componentes no autorizados.
- CA-5 Estados loading/error/empty: skeleton + bloques de estado con copy.
- HU-DASH-02/03/04 widgets: definidos arriba; consumen `/api/candidates` (limit=5, sort=-createdAt).

### 8) Checklist de QA manual (MVP)
- Login → dashboard en < 2.5 s LCP local.
- Email y rol visibles.
- Gating por rol efectivo (no se renderiza lo no permitido).
- “Últimos 5” muestra nombre+apellido / email / createdAt.
- “Candidatos hoy” correcto cuando hay/ no hay datos.
- Empty: copy amigable; Error: reintento funciona.
- Teclado: foco visible, navegación completa, `Skip to content` operativa.

### 9) Siguientes pasos (post-MVP)
- Subvistas por rol y filtros ligeros.
- Métricas de calidad más ricas (HR Ops) y exportación real.
- Tests E2E de permisos y estados vacíos/errores.


