## BACKEND AGENT.md

Guía para agentes que implementan cambios en `backend/` (Express + TypeScript + Prisma) con arquitectura DDD + Hexagonal + SOLID + Screaming Architecture.

### Reglas clave
- Mantén la separación de capas: `domain/` (puertos), `application/` (casos de uso, validación Zod), `infrastructure/` (adaptadores HTTP/Prisma), `shared/` (config/env, http, kernel/DI, logger).
- Usa DI con `tsyringe` y registra implementaciones en `shared/kernel/container.ts`. Consume interfaces desde capas internas.
- No uses `console.log`; emplea `shared/kernel/logger.ts` y `pino-http` en el server.
- Valida inputs/outputs con Zod; trata Zod como fuente de verdad del contrato.
- Cambios mínimos y localizados; evita romper endpoints existentes.
- Respeta aliases de import: `@shared/*`, `@users/*` (ver `tsconfig.json`).
- Define aliases para cada bounded context.

### Flujo por tipo de cambio
- Nuevo caso de uso
  1) Define/ajusta puertos en `domain/` si aplican.
  2) Implementa el caso de uso en `application/` con tipos explícitos y Zod para DTOs.
  3) Añade tests unitarios del caso de uso con repositorios mock.
  4) Si requiere persistencia, implementa adaptador en `infrastructure/` y registra en DI.

- Nuevo endpoint HTTP
  1) Mantén routers delgados en `infrastructure/http/*`. Valida `req` con Zod y delega al caso de uso.
  2) Registra el router en `shared/http/server.ts` usando `registerRouter(prefix, router)` para que pueda ser autodetectado por el generador de OpenAPI.
  3) Añade tests E2E con Supertest para el endpoint.
  4) Si los esquemas cambiaron, genera OpenAPI y actualiza tipos del frontend:
     ```bash
     npm --prefix backend run generate:openapi && npm --prefix frontend run types:openapi
     ```

- Persistencia (Prisma)
  - Modifica `prisma/schema.prisma` cuando sea necesario, ejecuta migraciones y `npm run prisma:generate`.
  - No accedas a Prisma fuera de adaptadores `infrastructure/`.

### Contratos y OpenAPI
- Define esquemas Zod cercanos al caso de uso.
- Genera `openapi.json` con:
  ```bash
  npm run generate:openapi
  ```
- No edites `openapi.json` a mano.
 - Cuando el contrato cambie, sincroniza tipos en `frontend/` con `npm --prefix frontend run types:openapi`.

#### Registro de rutas para generación automática de OpenAPI
El script de generación autodetecta rutas y construye `paths` a partir de routers y metadatos.

- Monta routers con registro para autodetección en `shared/http/server.ts`:

```ts
// shared/http/server.ts
import { registerRouter } from '@shared/http/route-registry';
import { usersRouter } from '@users/infrastructure/http/users.router';

// ...
app.use('/users', registerRouter('/users', usersRouter));
```

- Anota cada endpoint con metadatos OpenAPI en el propio router. Usa Zod v4 para los esquemas:

```ts
// users/infrastructure/http/users.router.ts
import { Router } from 'express';
import { container } from 'tsyringe';
import { CreateUserUseCase, CreateUserInput, CreateUserOutput } from '@users/application/create-user.usecase';
import { registerOpenApiRoute } from '@shared/http/openapi-registry';

export const usersRouter = Router();

registerOpenApiRoute('POST', '/users/', {
  tags: ['users'],
  description: 'Create a new user',
  requestBodySchema: CreateUserInput,
  responseSchema: CreateUserOutput,
  responseStatus: 201,
});

usersRouter.post('/', async (req, res, next) => {
  // ...
});
```

- Asegúrate de que los esquemas se importen desde `zod/v4` para compatibilidad con `zod-openapi@5`.


### Testing
- Unitarios: casos de uso con mocks de puertos.
- Integración: adaptadores Prisma.
- E2E: Supertest contra el `app` sin llamar `listen` cuando `NODE_ENV === 'test'`.

### Comandos
```bash
npm run dev
npm run build
npm start
npm run test
npm run typecheck
npm run prisma:generate
npm run generate:openapi
```

### Buenas prácticas TypeScript
- Tipado explícito en APIs públicas y DTOs; evita `any`.
- Early returns; evita anidaciones profundas y `try/catch` innecesarios.
- Nombres descriptivos y consistentes. Comentarios solo cuando aporten contexto no obvio.

### Observabilidad y errores
- Centraliza logging con pino; no mezcles estilos de logs.
- Maneja errores de forma coherente, propagando a middlewares y devolviendo respuestas consistentes. Loga el detalle del error, pero no expongas detalles técnicos de implementación en las respuestas de los endpoints.


