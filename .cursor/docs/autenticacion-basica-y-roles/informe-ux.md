## Informe UX — Autenticación básica y roles (RBAC)

### 1. Resumen ejecutivo
Se define la experiencia de login/logout, protección de rutas y dashboards adaptados a rol (`recruiter`, `hiring_manager`, `hr_ops`). Priorizamos accesibilidad, feedback claro y mínima fricción. El objetivo es cumplir la épica y criterios de aceptación, garantizando coherencia entre UI y backend.

### 2. Objetivos y métricas
- Acceso seguro con feedback claro.
- Rutas protegidas y redirecciones consistentes.
- Descubribilidad del contenido por rol.
- Métricas: ≥95% logins válidos, 0 accesos no autorizados, TTFPA ≤5 min p95.

### 3. Flujos principales
- Login: `/login` → credenciales → estados (loading, error, success) → redirect a `/dashboard` o última ruta protegida.
- Logout: acción en Navbar → `POST /api/auth/logout` → 204 → redirect `/login`.
- Acceso a candidatos: `/candidates` listado; alta rápida para `recruiter` y `hr_ops`.

### 4. Estados y mensajes
- Loading: botones deshabilitados + spinner; skeletons en dashboard/listas.
- Error: alert accesible con `role=alert` y `aria-live=assertive`; foco en el título del error.
- Success: toast con `aria-live=polite`, navegación con enfoque restaurado al `h1`.

### 5. Estructura de la información y navegación
- AppShell con Navbar lateral/superior.
- Información por rol:
  - recruiter: alta rápida, últimos 5 candidatos, conteo del día.
  - hiring_manager: recientes y conteos básicos; sin alta.
  - hr_ops: calidad de datos y mantenimiento (placeholder).

### 6. Accesibilidad (WCAG AA)
- Contraste suficiente en botones/links.
- Labels explícitos y `aria-describedby` en inputs.
- Gestión de foco tras rutas y errores.
- Atajos de teclado mínimos (Tab, Shift+Tab) sin trampas de foco.

### 7. Componentes y decisiones
- Login form: inputs con auto-complete apropiado.
- Navbar condicional por rol con estados activos visibles.
- Dashboard con tarjetas de estado y tabla reciente.
- Form alta rápida con validación y toasts.

### 8. Divergencias y decisiones informadas
- Cookie vs JWT: se propone JWT en memoria + refresh corto; opcional cookie HTTP-only si el backend lo ofrece. Se prioriza no exponer secretos en storage persistente.
- Rate limiting en `/api/auth/login`: se refleja en mensajes genéricos de error para no filtrar existencia de cuentas.
- RBAC en UI no sustituye autorización en backend: UI oculta/inhabilita, pero BE decide.

### 9. Requisitos para DEV
- Endpoint `POST /api/auth/login` devuelve JWT con claims `{ sub, email, role, iat, exp }`.
- Endpoint `POST /api/auth/logout` invalida token/sesión.
- Middleware FE para proteger rutas y leer `role` del token.
- Tipos generados desde OpenAPI para evitar desajustes.

### 10. Pruebas y validación
- Casos: credenciales válidas, inválidas, bloqueo rate limit, expiración de sesión, acceso sin rol, acceso con rol sin permiso.
- Accesibilidad: navegación por teclado, lector de pantalla, foco y `aria-live`.
- Observabilidad: logs de intentos fallidos sin exponer secretos.


