## Prompts MCP — Shadcn Studio (/cui) para "Añadir Candidato"

Sigue estrictamente el flujo /cui: COLLECT FIRST, INSTALL LAST. No instales hasta completar la colección de bloques.

### Paso 1 — Instrucciones de creación
Describe la intención al MCP:

"Crea una página de formulario para añadir candidatos con campos: nombre, apellido, email, telefono, direccion (textarea), educacion (combobox con autocompletado), experienciaLaboral (combobox con autocompletado), cvFile (dropzone/selector) o resumeUrl. Necesito toasts, alerts, estados loading, validaciones y componentes accesibles."

### Paso 2 — Explorar bloques disponibles
- Solicita categorías relacionadas con `forms`, `input`, `textarea`, `combobox/command`, `toast`, `alert`, `card`, `button`, `label`, `skeleton`. Si existe `file-uploader`/`dropzone`, selecciónala; de lo contrario planifica fallback con `input[type=file]` estilizado en `Card`.

### Paso 3 — Seleccionar (collect) bloques
Añade a la colección los siguientes bloques (o equivalentes del registry):
- `@ss-blocks/form`
- `@ss-blocks/input`
- `@ss-blocks/textarea`
- `@ss-blocks/label`
- `@ss-blocks/button`
- `@ss-blocks/command` (base para combobox accesible)
- `@ss-blocks/popover` (trigger/list para combobox)
- `@ss-blocks/toast`
- `@ss-blocks/alert`
- `@ss-blocks/card`
- `@ss-blocks/skeleton`
- `@ss-blocks/separator`
- `@ss-blocks/file-uploader` o `@ss-blocks/dropzone` (SI EXISTE). 

Si `file-uploader`/`dropzone` no existe, documenta fallback: usar `input[type=file]` + estilos de `button` y `card` para el selector y zonas de arrastre.

### Paso 4 — Generar comando de instalación (install last)
Una vez completa la colección, solicita el comando de instalación. Ejecuta el comando sugerido por el MCP en el proyecto `frontend` (modo no interactivo, respetando el gestor de paquetes del repo). No instales antes.

### Paso 5 — Personalización obligatoria post-instalación
Aplica estos cambios tras instalar:
- Crea `src/components/shadcn-studio/CandidateForm.tsx` con los campos indicados y validaciones. Usa `command + popover` como combobox accesible con props para datos remotos.
- Implementa Hook `useAutocomplete(field)` (debounce 250 ms, cache in-memory, cancelación) que consuma `GET /api/candidates/suggest?field=<educacion|experienciaLaboral>&q=<texto>&limit=10` y mapee a `{ value, label, occurrences }`.
- En `cvFile`, valida tipo/tamaño (≤5 MB) antes de enviar. Fallback a `resumeUrl` si el almacenamiento físico no está habilitado.
- Muestra `Toast` en éxito y `Alert` para errores globales.
- Asegura roles: envolver ruta con `RequireAuth` y `RequireRole(["recruiter"])`.

### Paso 6 — Estados y a11y
- Añade estados `loading` (botón disabled + spinner), `error` inline por campo (`aria-describedby`) y `no-results` en combobox.
- Atajos de teclado para combobox (↑/↓, Enter, Esc) y anuncio de resultados en ARIA live region.

### Paso 7 — QA rápido visual
- Usa `skeleton` para pre-carga si la página necesita datos previos.
- Verifica contraste, focos visibles y tamaños hit target.

---

## Contratos API (referencia para front)
- POST `/api/candidates` → 201/400/409/401/403.
- GET `/api/candidates/suggest?field=educacion|experienciaLaboral&q=<texto>&limit=10` → 200 `{ items: [...] }`.

Notas:
- Respetar el flujo del MCP sin saltos: collect all → install once → personalizar contenido.
- Si un bloque no existe, aplica el fallback indicado y documenta la decisión.


