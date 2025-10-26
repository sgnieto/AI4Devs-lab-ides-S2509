## Prompts MCP — Autenticación básica y roles (RBAC)

Contexto: Implementar UI de autenticación (login/logout), rutas protegidas y dashboards por rol (`recruiter`, `hiring_manager`, `hr_ops`) cumpliendo la épica “Autenticación básica y roles (RBAC)”. Seguir estrictamente los workflows del servidor MCP de Shadcn Studio.

---

### /cui — Create UI (COLECCIONAR PRIMERO, INSTALAR AL FINAL)

Objetivo de la sesión /cui:
- Construir: pantalla `Login`, layout protegido `AppShell`, `Navbar` con menús por rol, `Dashboard` con tarjetas y tablas, formulario de alta rápida de candidatos.
- Requisitos clave: estados de carga/éxito/error, accesibilidad (labels, roles ARIA, foco), feedback (toasts), skeletons, route guards en FE.

Nombres oficiales de bloques (usar exactamente estos, según plan-fullstack.md):
- auth/login: `login-01`
- layout/app shell: `app-shell-02`
- navigation/navbar: `navbar-12`
- dashboard/stat cards: `stat-cards-03`
- data-display/table: `data-table-05`
- forms/quick create: `quick-form-01`
- feedback/toast: `toast-01`
- feedback/alert-dialog: `alert-dialog-01`
- feedback/skeleton: `skeleton-01`

1) Explorar y seleccionar bloques (fase de colección)
- Acción: listar categorías relevantes para encontrar bloques base.
  - Categorías a explorar: `auth/login`, `navigation/navbar`, `layout/dashboard`, `data-display/cards`, `data-display/table`, `forms/form`, `feedback/toast`, `feedback/alert-dialog`, `feedback/skeleton`.
- Para cada categoría:
  - Obtener metadatos → seleccionar 1 bloque adecuado por categoría.
  - Criterios: accesible, minimalista, con variantes, fácil de estilizar.

Comandos sugeridos:
```
/cui
Objetivo: Implementar Login + AppShell protegido + Navbar por rol + Dashboard + Form alta rápida

# 1. Explorar
get-blocks-metadata

# 2. Profundizar por categoría (ejemplos)
get-block-meta-content endpoint="/blocks/auth"
get-block-meta-content endpoint="/blocks/navigation"
get-block-meta-content endpoint="/blocks/layout"
get-block-meta-content endpoint="/blocks/data-display"
get-block-meta-content endpoint="/blocks/forms"
get-block-meta-content endpoint="/blocks/feedback"

# 3. Añadir a colección (bloques seleccionados; nombres reales a partir del meta)
collect add blockName="login-01" blockType="auth"
collect add blockName="navbar-12" blockType="navbar"
collect add blockName="app-shell-02" blockType="layout"
collect add blockName="stat-cards-03" blockType="dashboard"
collect add blockName="data-table-05" blockType="table"
collect add blockName="quick-form-01" blockType="form"
collect add blockName="toast-01" blockType="feedback"
collect add blockName="alert-dialog-01" blockType="feedback"
collect add blockName="skeleton-01" blockType="feedback"

# 4. Ver colección actual
collect list

# 5. (Instalar SOLO cuando termine la colección)
get-add-command-for-items
```

2) Instalación (al finalizar colección)
- Ejecutar el comando devuelto por `get-add-command-for-items` con flags no interactivos.

3) Personalización obligatoria tras instalar
- Mapeo de rutas: `/login`, `/`, `/dashboard`, `/candidates`.
- Estados de UI: `idle`, `loading`, `error`, `success` con toasts.
- Accesibilidad: foco gestionado en errores, `aria-live=polite` en mensajes.
- Navbar: items condicionales por `role`.
- Dashboard por rol:
  - recruiter: alta rápida, últimos 5 candidatos, conteo del día.
  - hiring_manager: candidatos recientes y conteos básicos.
  - hr_ops: calidad de datos y herramientas de mantenimiento (placeholder).

Guía de personalización (post-instalación):
```
# Login
- Título: "Inicia sesión"
- Campos: email (type=email, autoComplete=email), password (type=password, autoComplete=current-password)
- Botón: "Entrar"
- Estados: loading (deshabilitar botón), error (alert + focus), success (redirect /dashboard)

# AppShell protegido
- HOC/Provider de sesión: si no hay sesión → redirect('/login')
- Guardado de última ruta para redirect tras login

# Navbar por rol
- recruiter: Dashboard, Candidates (Add, List)
- hiring_manager: Dashboard, Candidates (List)
- hr_ops: Dashboard, Data Quality, Maintenance

# Dashboard
- Cards: totales del día, pendientes, recientes
- Tabla: últimos 5 candidatos (nombre, puesto, estado, fecha)

# Form alta rápida
- Campos mínimos: nombre, email, puesto/rol, fuente
- Validación en cliente (zod/yup), estados y toasts
```

---

### /rui — Refine UI

Objetivo: Ajustar componentes instalados para requisitos RBAC y feedback.

Prompts:
```
/rui
Requisitos:
- Añadir control de visibilidad por `role` en `Navbar` y secciones del `Dashboard`.
- Añadir skeletons en `Dashboard` y `CandidatesTable` durante carga.
- Añadir `aria-live` en `LoginError` y `ToastContainer`.
- Unificar tokens de color y espaciado según tema actual.
- Asegurar que el foco vuelva al título de la página tras navegación.
```

---

### /iui — Inspiration UI (opcional)

Uso: obtener referencias visuales sobrias para `login`, `navbar`, `dashboard cards`.

Prompts:
```
/iui
Inspiración requerida:
- Login minimal, alto contraste, mensajes de error discretos.
- Navbar compacto con estados activos/hover accesibles.
- Stat cards con tipografía clara y jerarquía visual.
```

---

### Post-condiciones de la sesión
- Rutas protegidas implementadas y redirecciones correctas.
- Estados (loading/error/success) con feedback accesible.
- Menú y acciones por rol en Navbar y vistas.
- Dashboard con contenido por rol y tabla de últimos candidatos.
- Formulario de alta rápida funcional (sin lógica de backend obligatoria en esta fase).


