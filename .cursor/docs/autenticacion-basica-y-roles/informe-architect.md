## Informe del arquitecto — Épica 01: Autenticación básica y roles (RBAC)

### KISS / DRY / YAGNI
- KISS: JWT sin refresh y revocación simple en memoria para el MVP. Evitamos complejidad de sesiones persistentes.
- DRY: metadatos OpenAPI en los routers + Zod v4 generan el contrato y tipos FE sin duplicar esquemas.
- YAGNI: no implementamos federación, SSO ni scopes complejos; solo RBAC mínimo.

### Riesgos principales y mitigación
1) Exposición del token (XSS)
   - Mitigación: token en memoria, no en `localStorage`; CSP recomendada.
2) Fuerza bruta de contraseñas
   - Mitigación: rate limiting en `/api/auth/login` y mensajes de error genéricos.
3) Desalineación FE/BE
   - Mitigación: OpenAPI autogenerado y sync de tipos tras cada cambio.
4) Falta de módulo candidatos aún
   - Mitigación: stubs de rutas protegidas y middleware de autorización ya listo.
5) Secretos mal gestionados
   - Mitigación: `.env` con `AUTH_JWT_SECRET`, validación al boot.

### Impacto en DX y testing
- Comandos claros: generar OpenAPI y tipos FE.
- E2E con Supertest para login y rutas protegidas aumenta confianza en cambios.

### Hoja de ruta posterior (no bloqueante)
- Refresh tokens + rotación.
- Lista de revocación persistente (BD o cache) y logout global.
- Métricas de seguridad y alertas.


