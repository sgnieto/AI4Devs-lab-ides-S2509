## Añadir Candidato — Informe UX/UI

### Resumen ejecutivo
La funcionalidad permite a perfiles `recruiter` crear nuevos candidatos con validaciones robustas, subida de CV (PDF/DOCX, ≤5 MB) y autocompletado para `educacion` y `experienciaLaboral` usando datos existentes del sistema. Se contemplan estados de carga, error, éxito y cumplimiento de RBAC (403) y sesión (401).

### Objetivos
- **Negocio**: acelerar alta de candidatos y calidad de datos; evitar duplicados por email.
- **Usuario**: crear candidato con mínima fricción, feedback claro y accesible.
- **Tecnología**: contratos API consistentes, seguridad en archivos, escalabilidad del autocompletado.

### Requisitos clave y criterios de aceptación (síntesis)
- Acceso visible desde el dashboard del reclutador.
- Formulario con campos obligatorios: `nombre`, `apellido`, `email`, `telefono`, `direccion`, `educacion`, `experienciaLaboral`, `cvFile?` o `resumeUrl` (alternativa si no hay almacenamiento físico).
- Validación: formato de email, requeridos, longitudes razonables (≤100 chars nombre/apellido), duplicado por email → 409.
- Subida CV: PDF o DOCX, ≤5 MB, normalización de ruta (prevención path traversal).
- RBAC: solo `recruiter` crea; `hiring_manager` y `hr_ops` reciben 403. Requiere sesión (401 si no autenticado).
- UX/A11y: estados `loading`/`error`, mensajes inline, conservación de entradas ante errores, navegación por teclado, ARIA correcta.
- Confirmación: tras 201, mensaje de éxito y reflejo en listado sin recargar toda la app (o redirección con recarga del listado).

### Flujo de usuario
1) Usuario autenticado con rol permitido accede a "Añadir candidato" desde el dashboard.
2) Se muestra formulario. Campos obligatorios con indicadores y ayudas.
3) Autocompletado en `educacion` y `experienciaLaboral` ofrece sugerencias mientras se escribe (min 2 chars, debounce 250 ms).
4) Usuario adjunta CV (arrastrar/soltar o selector). Validación inmediata de tipo/tamaño.
5) Al enviar, botón en estado `loading` y deshabilitado. Se valida en frontend y backend.
6) Éxito (201): toast de confirmación + inserción en lista (optimista) o redirección al detalle.
7) Errores:
   - 400 validación: mensajes inline por campo y resumen accesible.
   - 409 duplicado: mensaje específico indicando email ya en uso y CTA para ver candidato existente.
   - 401/403: redirección a login o pantalla de permiso denegado.
   - Error de subida: mensaje claro manteniendo datos del formulario.

### Estados de interfaz
- Idle → Editing → Submitting (spinner en botón) → Success (toast) / Error (inline + banner).
- Autocompletado: `no-results`, `loading`, `error` con reintento.
- Uploader: `idle`, `drag-over`, `validating`, `error-type`, `error-size`, `uploaded`.

### Diseño de UI (propuesta)
- Layout: página de formulario en `Card` con `Header` y breadcrumbs.
- Campos:
  - `nombre`, `apellido`: `Input` con contador y validación onBlur/onSubmit.
  - `email`: `Input` tipo email y validación de formato.
  - `telefono`: `Input` con máscara opcional; validación básica.
  - `direccion`: `Textarea` breve.
  - `educacion`, `experienciaLaboral`: `Combobox` con sugerencias (fuente dinámica) y opción de entrada libre si no hay coincidencias.
  - `cvFile` o `resumeUrl`: `Dropzone`/selector archivo estilizado; alternativa `Input` URL.
- Feedback: `FormMessage` inline, `Toast` para éxito y `Alert` para errores globales.
- Acciones: `Guardar` (primary) y `Cancelar` (secondary).

### Autocompletado: UX, datos y contrato API
- Comportamiento: muestra top sugerencias al escribir (min 2 chars, máx 10 resultados) con conteo de apariciones para priorizar.
- Performance: debounce 250 ms, cancelación de peticiones en curso, cache en memoria por clave `(field,q)`.
- Accesibilidad: patrón WAI-ARIA `combobox` con `listbox` y `options`, soporte teclado (↑/↓, Enter, Esc), anuncio de número de resultados.
- Tolerancia a fallos: si hay error de red, permitir entrada libre y mostrar aviso no bloqueante.
- Contratos API sugeridos:
  - GET `/api/candidates/suggest?field=educacion&q=<texto>&limit=10`
  - GET `/api/candidates/suggest?field=experienciaLaboral&q=<texto>&limit=10`
  - Respuesta 200:
    ```json
    { "items": [ { "value": "Licenciatura", "label": "Licenciatura", "occurrences": 134 } ] }
    ```
  - 400 si `field` inválido; 401/403 según RBAC.
  - Fuente de datos: valores distintos ya presentes en la tabla de candidatos (DISTINCT + LIKE ILIKE).

### Subida de CV
- Tipos permitidos: `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
- Tamaño: ≤ 5 MB. Validación en frontend y backend.
- Seguridad: normalizar nombres y rutas bajo `FILE_STORAGE_BASE_PATH`; prevenir path traversal.
- Alternativa MVP: si no hay almacenamiento, aceptar `resumeUrl` y deshabilitar input de archivo.

### RBAC y seguridad
- UI: ocultar CTA a perfiles sin permiso; bloquear en ruta protegida (`RequireAuth` + `RequireRole`).
- API: verificar rol en endpoint POST `/api/candidates`. Responder 403 para `hiring_manager` y `hr_ops`.
- Auditoría: registrar `createdAt`, `createdBy` (id usuario) en persistencia.

### Accesibilidad (WCAG 2.1 AA)
- Labels explícitas vinculadas a `Input`/`Combobox`/`Textarea`.
- Mensajes de error asociados por `aria-describedby`.
- Orden de tabulación lógico, visibilidad de foco, atajos de teclado.
- Anuncios ARIA live para éxito/error y conteo de sugerencias.

### Métricas y observabilidad
- Tasa de éxitos/errores del POST, tiempo a completar formulario, frequency de 409.
- Logs de validación y rechazos de archivo (tipo/tamaño) agregados y sin PII.

### Suposiciones y decisiones
- Se agrega endpoint `/api/candidates/suggest` para autocompletado basado en datos existentes.
- En caso de falta de almacenamiento físico, se habilita `resumeUrl` y se posterga la subida nativa.
- Las listas de sugerencias no son taxonomías cerradas; se permite entrada libre controlada.

### Plan de pruebas
- Unit: validaciones de formulario, componentes de combobox y uploader.
- Integra/HTTP: 201 feliz, 400 validación, 409 duplicado, 401/403.
- E2E: flujo completo con teclado; lector de pantalla anuncia feedback; límite de archivo rechazado correctamente.


