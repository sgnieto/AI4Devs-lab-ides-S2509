## Prompts MCP — /cui Shadcn Studio

Contexto: Implementar el dashboard mínimo por rol (HU-DASH-01..06) tras login, usando bloques de Shadcn Studio. Sigue el workflow /cui EXACTO: Collect ALL → Install (batch) → Customize content. No te detengas ni pidas confirmación intermedia.

### Alcance MVP
- Rutas protegidas y layout base tras login (`/dashboard`).
- Topbar con `email` y `role` (desde JWT en sesión) y navegación condicional por rol.
- Widgets mínimos por rol usando bloques shadcn.
- Estados `loading/empty/error` y mensajes accesibles.

### Inventario actual (no instalar de nuevo)
- Ya existen: `navbar-component-01`, `login-page-01`, `statistics-card-01`, componentes `ui/*` (button, card, skeleton, sidebar, etc.). Úsalos cuando aplique.

---

### Paso 1 — Identificar bloques necesarios (NO instalar aún)
- Navbar (ya instalado) en `AppShell`.
- Cards de KPIs: `statistics-card-01` (ya instalado) para contadores rápidos.
- Lista básica reciente (candidatos): buscar categoría "list" o "table simple" (preferir lista con título y subtítulo, sin paginación).
- Empty state: bloque de estado vacío genérico.
- Error state: bloque de error genérico con acción de reintento.
- Skeletons: usar `ui/skeleton` existente para placeholders.
- Sidebar opcional: si hay bloque de "sidebar" en el registry. Si no, usar `ui/sidebar` local.

Marca todos como UNCOMPLETED (excepto los ya existentes que se consideran COMPLETED para instalación, pero SÍ deben personalizarse en Step 6).

---

### Pasos 2–4 — Colección de bloques (loop por cada bloque UNCOMPLETED)
Para cada bloque requerido y no existente:
1) get-blocks-metadata → localizar categoría y opciones.
2) get-block-meta-content (endpoint devuelto por metadata) → listar variantes.
3) Elegir la variante más simple y accesible acorde al MVP.
4) collect_selected_blocks action='add'.

Bloques a recolectar:
- list/recent-items (p. ej., `list-basic-01` o `table-simple-01`).
- empty-state (p. ej., `empty-state-01`).
- error-state (p. ej., `error-state-01`).
- sidebar (sólo si no vamos a usar `ui/sidebar` local): `sidebar-component-0X`.

No generes comandos de instalación hasta terminar TODA la colección.

---

### Paso 5 — Instalar en un único batch (automático)
1) collect_selected_blocks action='list' → verificar que están todos.
2) get_add_command_for_items → obtener comando de instalación batch.
3) Ejecutar el comando inmediatamente (no pedir confirmación) y continuar a personalización.

Nota: Si algún bloque ya existe, la instalación debe ser idempotente (no reinstalar). Continúa igualmente.

---

### Paso 6 — Personalización obligatoria (sin cambios estructurales)
Usa sólo actualización de textos, imágenes y datos. Mantén la estructura de cada bloque. Accesibilidad obligatoria (roles, aria, foco, contraste).

1) Topbar y navegación condicional
- Mostrar `email` y `role` del contexto de sesión.
- Ocultar o deshabilitar entradas no permitidas por rol. Añadir hints accesibles al foco.

2) Widgets por rol
- Recruiter
  - Card KPI “Candidatos hoy”: usar `statistics-card-01` con valor calculado en UI sobre `GET /api/candidates?limit=5&sort=-createdAt`.
  - Lista “Últimos 5 candidatos”: lista simple (nombre + apellido / email / createdAt). CTA “Añadir candidato”.
- Hiring Manager
  - Lista “Recientes” (misma fuente). Card “Total candidatos” si dato disponible; si no, texto pequeño “No disponible en MVP”.
- HR Ops
  - Card “Calidad de datos”: % con phone o resumeUrl en la muestra reciente.
  - Lista top 5 sin phone ni resume (si aplica). CTA “Exportar” deshabilitado con hint.

3) Estados y mensajes
- loading: skeletons (usar `ui/skeleton`).
- empty: bloque empty-state con copy específico (“Sin candidatos recientes”).
- error: bloque error-state con botón “Reintentar” y texto accesible.

4) Copys y rótulos
- Botones: “Añadir candidato”, “Reintentar”, “Ver todos”.
- Titulares claros por sección: “Últimos 5 candidatos”, “Candidatos hoy”, “Calidad de datos (muestra reciente)”.

5) Accesibilidad
- Asegurar orden de tabulación, `aria-live` para mensajes de error/carga, alt text descriptivo cuando haya imágenes/avatares.

---

### Paso 7 — Actualización de archivos (sólo contenido)
- Personaliza textos en los archivos instalados sin tocar la estructura.
- Revisa `AppShell` y el contenedor de `/dashboard` para insertar títulos y descripciones.
- No crees nuevos archivos de bloque. Reusa existentes.

Ejemplo de copy a inyectar en el dashboard (mantén estructura existente):

```tsx
// Titular principal y leyenda con email y rol
<h1 className="text-2xl font-semibold">Dashboard</h1>
<p className="text-sm text-muted-foreground">Sesión: {session.email} | Rol: {session.role}</p>

// Cards KPI (statistics-card-01), reemplaza props de texto e iconos según API del bloque
<StatisticsCard01 title="Candidatos hoy" value={stats.todayCount} />

// Lista reciente (list-basic-01 / table-simple-01) con 5 elementos
<RecentList title="Últimos 5 candidatos" items={candidates.slice(0,5)} emptyText="Sin candidatos recientes" />
```

---

### Paso 8 — Revisión
- Verifica: textos correctos por rol, estados presentes, hints accesibles, contraste suficiente.
- LCP local ≤ 2.5 s: usar skeletons y evitar contenido pesado en el primer paint.

---

### Paso 9 — Cierre
Marca como COMPLETED los bloques personalizados y registra brevemente qué contenido se actualizó (copys, labels, estados, CTAs).

---

### Notas de fallback
- Si no existe bloque de lista básica en el registry, usar alternativa equivalente de categoría "table" simple.
- Si no existe un bloque de estado vacío/error, usa un `Card` con icono de `lucide-react` y copy accesible.


