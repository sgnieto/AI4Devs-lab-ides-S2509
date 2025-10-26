## Bank Memory — Añadir Candidato (ADRs)

1) Permisos de creación (RBAC)
- Decisión: `POST /candidates` autorizado para `recruiter`, denegado para `hiring_manager`  y `hr_ops`.

2) Modelo de datos de Candidate
- Decisión: añadir `address`, `education`, `workExperience`, `createdBy`.
- Motivo: cumplir con campos de formulario y trazabilidad.

3) Subida de CV
- Decisión: MVP con almacenamiento, `multer` y validaciones de tipo/tamaño (≤5 MB) y normalización de ruta.

4) Autocompletado
- Decisión: endpoint `GET /candidates/suggest` sobre columnas `education` y `workExperience` con DISTINCT y conteo, límite 10, debounce en FE.
- Motivo: reutilizar datos existentes, mejorar UX sin nuevas tablas.

5) OpenAPI y sincronización de tipos
- Decisión: anotar rutas con `registerOpenApiRoute` y generar tipos FE con script del repo.
- Motivo: contratos fuente-de-verdad y DX.

6) Frontend y accesibilidad
- Decisión: `command + popover` como combobox accesible; mensajes inline, ARIA live para toasts/errores.
- Motivo: cumplir WCAG 2.1 AA.

7) Manejo de duplicados por email
- Decisión: verificar en caso de uso; mapear a 409 con mensaje claro.
- Motivo: requisito de negocio/UX.


