# Épica 02 — Dashboard esqueleto por perfil

## Objetivo
Proveer un dashboard mínimo, seguro y útil según el rol del usuario (`recruiter`, `hiring_manager`, `hr_ops`) que facilite la ejecución de tareas frecuentes inmediatamente después del login.

## Métricas de éxito
- Tiempo hasta primera acción útil en dashboard ≤ 60 s (p95).
- 0 accesos no autorizados vía UI (rutas protegidas correctamente).
- Core Web Vitals LCP del dashboard ≤ 2.5 s en entorno local.

## Alcance (MVP)
- Rutas protegidas y layout base del dashboard tras autenticación.
- Widgets mínimos por rol con datos provenientes del JWT obtenido tras la autenticación  y `/api/candidates`.
- Gestión de estados: cargando, vacío, error.

## Fuera de alcance (MVP)
- Personalización avanzada de widgets, filtros, gráficos, y estados del pipeline.
- Acciones de mantenimiento de datos (más allá de enlaces/CTA básicos).

---

## HU-DASH-01 — Rutas protegidas y layout de dashboard
Como usuario autenticado, quiero acceder a un dashboard protegido que muestre mi email y rol, y oculte las secciones no permitidas.

- Criterios de aceptación:
  1. La ruta `/dashboard` requiere sesión; sin sesión redirige a `/login` (302) y muestra aviso.
  2. El layout muestra topbar con `email` y `role` obtenidos del JWT obtenido tras la autenticación.
  3. La navegación lateral muestra entradas condicionales por rol (no renderizar opciones sin permiso).
  4. Accesos directos por URL a vistas no permitidas devuelven vista 403 en UI.
  5. Estados: `loading` (skeleton/spinner), `error` (mensaje recuperable), `empty` cuando aplique.

---

## HU-DASH-02 — Widgets para Recruiter
Como recruiter, quiero ver alta rápida, últimos 5 candidatos y conteo de candidatos del día para actuar con rapidez.

- Criterios de aceptación:
  1. Widget “Alta rápida”: CTA visible a formulario de “Añadir candidato” sólo para roles con permiso de creación (`recruiter`, `hr_ops`).
  2. “Últimos 5 candidatos”: consume `GET /api/candidates?limit=5&sort=-createdAt` y muestra `nombre` + `apellido` / `email` / `createdAt`.
  3. “Candidatos hoy”: muestra total creado en la fecha local actual (calculado en UI sobre la lista básica si no hay endpoint dedicado).
  4. Estados: vacío (sin candidatos), cargando, error (reintento).

---

## HU-DASH-03 — Widgets para Hiring Manager
Como hiring manager, quiero ver candidatos recientes visibles y conteo total para entender el volumen actual.

- Criterios de aceptación:
  1. “Recientes”: `GET /api/candidates?limit=5&sort=-createdAt` (misma lista mínima del MVP).
  2. “Total candidatos”: número total simple si está disponible; si no, se omite o se muestra nota “no disponible en MVP”.
  3. No se muestran acciones de creación (no tiene permiso para `POST /api/candidates`).

---

## HU-DASH-04 — Widgets para HR Ops
Como HR Ops, quiero ver una vista de calidad de datos básica y accesos a mantenimiento (cuando existan) para mejorar la integridad.

- Criterios de aceptación:
  1. “Calidad básica”: porcentaje de candidatos con `phone` o `resumeUrl`/`resumePath` informado sobre la muestra reciente.
  2. Lista top 5 sin `phone` ni `resumeUrl` para seguimiento (si la muestra lo permite).
  3. Exportación avanzada fuera de alcance; mostrar CTA deshabilitado con hint.

---

## HU-DASH-05 — Control de permisos en UI
Como sistema, quiero que el dashboard oculte acciones no permitidas y muestre mensajes claros cuando un usuario no tenga permisos.

- Criterios de aceptación:
  1. Elementos no permitidos por rol no se renderizan o aparecen deshabilitados con hint.
  2. Intentos de navegación directa a vistas no autorizadas muestran 403 en UI.
  3. El backend sigue aplicando RBAC; los 401/403 se reflejan en UI con mensajes amigables.

---

## HU-DASH-06 — Estados, accesibilidad y rendimiento
Como usuario, quiero una experiencia fluida con estados claros, accesible y con buen rendimiento.

- Criterios de aceptación:
  1. Estados `loading/empty/error` implementados en todos los widgets.
  2. Accesibilidad básica: navegación por teclado, roles ARIA en componentes clave.
  3. LCP de la pantalla de dashboard ≤ 2.5 s en entorno local.

---

## Dependencias
- Autenticación básica operativa (`/api/auth/login`).
- Endpoints de candidatos disponibles (`/api/candidates`).
- RBAC aplicado en backend y reflejado en frontend.

## Criterios de “hecho”
- Dashboard accesible sólo tras login y mostrando widgets por rol.
- Widgets mínimos renderizan datos reales o estados vacíos con gracia.
- Pruebas manuales documentadas (flujo login → dashboard → navegación widgets).

