# Product Brief — Applicant Tracking System (ATS) para LTI

## Visión
Construir un sistema sencillo y confiable que permita a LTI centralizar y acelerar la incorporación de candidatos, reduciendo fricciones operativas desde el primer día con un MVP que añada valor real: registrar candidatos de forma segura, visible y reutilizable.

## Propuesta de valor
- Para reclutadores: registrar candidatos en menos de 2 minutos con validaciones básicas y trazabilidad.
- Para hiring managers: visibilidad inmediata del pipeline inicial (lista básica).
- Para RR. HH.: datos consistentes y exportables, cumpliendo GDPR desde el inicio.

## Público objetivo
- Reclutadores y Talent Acquisition Partners de LTI.
- Hiring Managers (lectura/consulta).
- HR Ops (mantenimiento y reporting básico).

## Problema / Oportunidad
- Dispersión de datos entre hojas de cálculo y emails.
- Pérdida de información y duplicidad de candidatos.
- Dificultad para medir el embudo de selección.
Oportunidad: establecer un “sistema fuente” ligero y extensible que escale gradualmente.

## Solución propuesta (MVP)
Un ATS mínimo con:
- Alta de candidatos con validaciones esenciales y prevención de duplicados por email.
- Listado básico para consulta y verificación rápida.
- Persistencia simple y segura con auditoría mínima.
- Autenticación básica por credenciales hasheadas (bcrypt/scrypt/Argon2) con perfiles de usuario.
- Dashboard inicial con widgets mínimos dependientes del perfil.
- Almacenamiento de archivos en disco local con ruta base configurable para CVs.
- API y UI coherentes para extender el flujo en siguientes iteraciones.

## Alcance MVP inicial
- Funcionalidades:
  - Formulario “Añadir candidato”.
  - Validaciones mínimas: `nombre`, `apellido`, `email`, `telefono`, `direccion`, `educacion`, `experienciaLaboral` obligatorios; `email` válido y único.
  - Persistencia en BD liviana (vía Prisma según la tecnología utilizada en el proyecto).
  - Autenticación básica: login/logout con hash de contraseña, sesión o JWT de corta duración, y autorización por rol (RBAC sencillo: `recruiter`, `hiring_manager`, `hr_ops`).
  - Dashboard mínimo por perfil: widgets de alta rápida, últimos candidatos y conteos básicos.
  - CLI de gestión de usuarios: alta/listado/cambio de rol/reset de contraseña.
  - Carga de CV (PDF/DOCX) y guardado en disco bajo ruta base configurable.
  - Listado básico de candidatos (tabla simple).
- Fuera de alcance (MVP): estados del pipeline, entrevistas, permisos avanzados, integraciones externas, adjuntos binarios.

## Métricas clave
- Tiempo de alta de candidato ≤ 2 minutos (p95).
- Tasa de alta exitosa ≥ 95%.
- Porcentaje de duplicados por email ≤ 1%.
- Completitud de datos obligatorios = 100%.
- Adopción: ≥ 1 equipo piloto lo usa en 1 semana.

## Riesgos y dependencias
- Riesgos: cumplimiento GDPR (datos personales), calidad/validación insuficiente, creep de alcance.
- Mitigaciones: esquema mínimo de datos, consentimiento implícito en uso interno, registro de creación, validaciones estrictas de email, política de borrado.
- Riesgos añadidos por autenticación: almacenamiento inseguro de contraseñas, tokens persistentes demasiado largos, bypass de roles.
- Mitigaciones de autenticación: hash robusto (bcrypt/argon2), expiración corta, cookies HTTP-only o JWT firmados, middleware de rol probado, rate limit en login.
- Dependencias: base de datos operativa, despliegue local (docker o scripts), CI básica opcional.
 - Riesgos añadidos por archivos: consumo de disco, malware, path traversal, fuga de datos.
 - Mitigaciones de archivos: límites de tamaño/tipo, normalización de ruta, directorios segregados, política de retención/borrado, escaneo AV (futuro), no exponer rutas absolutas en respuestas.

## Suposiciones
- Uso interno por parte de LTI (entorno controlado).
- Se requiere autenticación básica con credenciales hasheadas y control de rol para acceder a UI y API.
- Email es identificador único operacional de candidato.

## Requisitos no funcionales
- Seguridad y privacidad por defecto (minimización de campos).
- Mantenibilidad: backend Node/TS con Prisma; frontend React/TS.
- Observabilidad mínima: logs de creación/errores y eventos de autenticación (intentos fallidos).
- Portabilidad: ejecución local con `docker-compose` o `npm scripts`.
 - Seguridad de autenticación: hash de contraseñas (bcrypt/similar), rate limiting en `/auth/login`, sesiones HTTP-only o JWT de corta duración, protección CSRF si se usan cookies, y RBAC aplicado en endpoints protegidos.
 - Operabilidad: CLI de usuarios con salida legible, idempotencia en comandos y códigos de salida consistentes.
 - Almacenamiento de archivos:
   - Ruta base configurable vía variable de entorno (p. ej., `FILE_STORAGE_BASE_PATH`).
   - Normalización de nombre de archivo, prevención de path traversal, límite de tamaño (5 MB) y tipos permitidos (PDF, DOCX).
   - Escritura atómica y creación automática de subdirectorios por fecha/ID; manejo de colisiones por sufijos únicos.

## Plan de entrega (24h - práctica)
- Resultado tangible: flujo “Añadir candidato” funcionando end-to-end con listado básico, tests mínimos y README de uso.
- Criterio de “hecho”: ejecución local reproducible, validaciones funcionando, prueba E2E manual documentada.

## Backlog inicial lean (previo al ticket real)
0) Autenticación básica y roles
   - Modelo `User` con `id`, `email`, `passwordHash`, `role`, `createdAt`.
   - Semillas locales de usuarios con contraseñas hasheadas y roles: `recruiter`, `hiring_manager`, `hr_ops`.
   - Endpoints de login/logout, sesión/JWT, middleware de autorización por rol.
   - CLI inicial para crear usuario, listar usuarios y cambiar rol.
0.5) Dashboard esqueleto por perfil
   - Rutas protegidas en frontend; layout de dashboard con widgets mínimos por rol.
1) Preparar entorno y base de datos mínima
   - Definir modelo `Candidate` mínimo: `id`, `nombre`, `apellido`, `email`, `telefono`, `direccion`, `educacion`, `experienciaLaboral`, `cvPath?`, `source?`, `notes?`, `createdAt`.
   - Migración Prisma y conexión SQLite (o memoria como fallback).
2) Endpoint backend para alta
   - `POST /candidates` con validaciones y control de duplicados (email).
   - Respuestas JSON con códigos 201/400/409.
3) Endpoint backend de listado
   - `GET /candidates` con paginado simple (opcional en MVP).
4) UI mínima
   - Formulario “Añadir candidato” (React/TS) con validación client-side.
   - Vista de lista básica (tabla) protegida tras login.
5) Tests mínimos
   - Unit/integration del use case de creación y validación de duplicados.
   - Tests de auth básicos: login válido/ inválido, acceso protegido.
6) Documentación y DX
   - README con pasos de instalación/ejecución y prueba manual.
   - OpenAPI actualizado y tipos en frontend.

## Ticket principal (historia real)
- Como reclutador de LTI, quiero añadir un candidato con `nombre`, `apellido`, `email`, `telefono`, `direccion`, `educacion`, `experienciaLaboral` y CV opcional, para iniciar su proceso de selección y mantener un registro centralizado.
- Criterios de aceptación (resumen):
  - Campos obligatorios: `nombre`, `apellido`, `email` válido, `telefono`, `direccion`, `educacion`, `experienciaLaboral`; error si falta o es inválido.
  - Rechazar duplicados por `email` con 409 y mensaje claro.
  - Guardar el candidato y devolver 201 con el recurso creado.
  - Si se adjunta CV: guardar en disco bajo `FILE_STORAGE_BASE_PATH` y persistir `cvPath`.
  - Reflejar el nuevo candidato en el listado al volver a la vista principal.

## APIs del MVP (propuesto)
- POST `/api/auth/login` → autentica usuario; devuelve sesión/JWT de corta duración.
- POST `/api/auth/logout` → invalida sesión/token.
- GET `/api/auth/me` → devuelve perfil de usuario autenticado.
- POST `/api/candidates` → crea candidato (multipart/form-data; campos + `cv` opcional).
- GET `/api/candidates` → lista candidatos.

## Dashboard (propuesto)
- Recruiter: widget de alta rápida, últimos 5 candidatos creados por el equipo, conteo de candidatos del día.
- Hiring Manager: lista de candidatos recientes y conteos por estado básico (si disponible; si no, solo recientes).
- HR Ops: vista de calidad de datos (campos obligatorios faltantes) y opción de exportación básica (alcance posterior).

## Modelo de datos (propuesto)
- Candidate: `id (uuid)`, `nombre (string)`, `apellido (string)`, `email (string, unique)`, `telefono (string)`, `direccion (string)`, `educacion (string)`, `experienciaLaboral (string)`, `cvPath? (string)`, `source? (enum/string)`, `notes? (string)`, `createdAt (datetime)`.
 - User: `id (uuid)`, `email (string, unique)`, `passwordHash (string)`, `role (enum: recruiter|hiring_manager|hr_ops)`, `createdAt (datetime)`.
 - Almacenamiento de archivos: `cvPath (string)` almacenado en `Candidate`; `cvUrl` opcional si se sirve estáticamente.

## Métricas adicionales de autenticación y uso

## CLI de gestión de usuarios (propuesto)
- Comandos mínimos:
  - `users:create --email <email> --role <role>` → crea usuario y solicita contraseña (o `--password`), hashea y persiste.
  - `users:list [--role <role>]` → lista usuarios (opcional filtrar por rol).
  - `users:role --email <email> --role <role>` → cambia el rol.
  - `users:reset-password --email <email> [--password <pwd>]` → reinicia contraseña (interactivo si no se pasa).
- Requisitos:
  - Salida JSON y/o tabla legible.
  - Códigos de salida estándar (0 éxito, 1 error de validación, 2 error interno).
  - Logs mínimos y mensajes seguros (no exponer contraseñas).
- Tasa de login exitoso ≥ 95%; tasa de intentos fallidos monitoreada.
- Tiempo hasta primer alta tras login ≤ 5 minutos (p95).
- 0 incidentes de acceso no autorizado a endpoints protegidos.
