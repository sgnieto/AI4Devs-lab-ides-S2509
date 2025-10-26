# Añadir Candidato al Sistema

Como reclutador,
Quiero tener la capacidad de añadir nuevos candidatos al sistema ATS,
Para poder gestionar sus datos y procesos de selección de manera eficiente.

## Criterios de Aceptación
- **Acceso a la función**: Debe existir un botón o enlace claramente visible en el dashboard principal del reclutador que permita añadir un nuevo candidato.

- **Formulario de registro**: Al seleccionar la opción de añadir candidato, se mostrará un formulario con los siguientes campos obligatorios:
  - nombre
  - apellido
  - email
  - telefono
  - direccion
  - educacion
  - experienciaLaboral
- **Validación de datos**: El formulario debe validar la información antes de enviarla.
  - El correo electrónico debe tener un formato válido.
  - Los campos obligatorios no deben quedar vacíos.
- **Carga de documentos**: El reclutador podrá cargar el CV del candidato en formato PDF o DOCX.
  - El CV se almacenará en disco bajo una ruta base configurable por variable de entorno FILE_STORAGE_BASE_PATH.
  - Tamaño máximo permitido: 5 MB. Tipos permitidos: PDF, DOCX.
  - Se prevendrá path traversal mediante normalización del nombre y directorio destino.
  - En caso de no habilitar almacenamiento físico, se permitirá alternativa de URL de CV.
- **Confirmación de registro**: Tras enviar el formulario correctamente, el sistema mostrará un mensaje de confirmación indicando que el candidato fue añadido exitosamente.
- **Manejo de errores**: En caso de error (por ejemplo, un fallo de conexión con el servidor), el sistema debe mostrar un mensaje informativo y claro para el usuario.
  - Si la subida de CV excede el tamaño o el tipo permitido, se devolverá un error claro y no se perderán los datos del formulario.
- **Compatibilidad y accesibilidad**: La funcionalidad debe ser usable desde distintos dispositivos y navegadores, cumpliendo con buenas prácticas de accesibilidad.

---

## Criterios complementarios (sin alterar requisitos existentes)
- **RBAC y autenticación**:
  - Sólo `recruiter` y `hr_ops` pueden crear candidatos; `hiring_manager` no puede (403).
  - La ruta del formulario y el endpoint de creación requieren sesión (401 si no autenticado).
- **Contratos de API**:
  - Endpoint: `POST /api/candidates`.
  - Body: `{ nombre, apellido, email, telefono, direccion, educacion, experienciaLaboral, cvFile? }`.
  - Respuestas: 201 (creado), 400 (validación), 409 (duplicado por email), 401/403 (auth/permiso).
- **Validación adicional**:
  - Email único a nivel de sistema; si ya existe, devolver 409 con mensaje claro.
  - Tamaño máximo de CV: 5 MB; tipos permitidos: PDF o DOCX; antivirus/escaneo fuera de alcance (marcar como futuro).
  - Tamaños/longitudes razonables en texto (p.ej., nombre/apellido ≤ 100 chars) para evitar abusos.
- **Persistencia y auditoría**:
  - Registrar `createdAt` y `createdBy` (id del usuario autenticado) para trazabilidad.
  - Almacén de CV opcional: si no hay almacenamiento de archivos en MVP, aceptar URL (`resumeUrl`) como alternativa y dejar subida nativa para iteración posterior.
- **UX/Accesibilidad**:
  - Estados `loading`, `error` y mensajes inline en campos.
  - El formulario conserva entradas ante errores de validación o red.
  - Navegación por teclado y labels/ARIA correctos.
- **Confirmación y sincronización de lista**:
  - Tras 201, mostrar confirmación y reflejar el candidato en el listado sin recargar toda la app (o redirigir con recarga del listado).
- **Privacidad (GDPR) y minimización**:
  - Mostrar nota de uso interno y mínima retención de datos.
  - No registrar datos sensibles no requeridos en MVP.

