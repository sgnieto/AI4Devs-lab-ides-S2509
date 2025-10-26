# Backend – LTI: Sistema de Seguimiento de Talento

Este backend proporciona una API HTTP basada en Express con TypeScript y Prisma, estructurada con principios DDD + Arquitectura Hexagonal + SOLID + Screaming Architecture. Incluye validación de configuración con envalid, DI con tsyringe, logging estructurado con pino y generación de contratos OpenAPI.

## Contenido
- Descripción del proyecto
- Estructura de directorios
- Tecnologías utilizadas
- Principios de arquitectura aplicados
- Estrategia de testing
- Buenas prácticas TypeScript en backend
- Uso de herramientas y scripts

## Descripción del proyecto
- Base: Express + TypeScript.
- Persistencia: Prisma (PostgreSQL).
- Arquitectura limpia: DDD/Hexagonal/SOLID/Screaming Architecture.
- Contratos: Zod (+ OpenAPI).
- Observabilidad: pino/pino-http.
- DX: ts-node-dev, tsconfig-paths, Jest/Supertest.

## Estructura de directorios
```
backend/
  prisma/
    schema.prisma
  src/
    index.ts
    shared/
      config/
        env.ts              # Validación de variables de entorno (envalid)
      http/
        server.ts           # Bootstrap de Express, middlewares y routers
      kernel/
        container.ts        # Registro de inyección de dependencias (tsyringe)
        logger.ts           # Logger (pino) + http logger (pino-http)
    users/
      domain/
        user.repository.ts  # Puerto de repositorio
      application/
        create-user.usecase.ts  # Caso de uso + validación Zod
      infrastructure/
        prisma-user.repository.ts  # Adaptador Prisma
        http/
          users.router.ts    # Adaptador HTTP (Express Router)
    candidates/
      domain/
        candidate.repository.ts
      application/
        search-candidates.usecase.ts
      infrastructure/
        prisma-candidate.repository.ts
        http/
          candidates.router.ts
  scripts/
    generate-openapi.ts      # Generación de openapi.json (si se utiliza)
    candidates.seed.ts       # Seed de candidatos para desarrollo
  tsconfig.json
  package.json
```

## Tecnologías utilizadas
- **Runtime/Framework**: Node.js, Express.
- **Lenguaje**: TypeScript.
- **ORM**: Prisma con singleton pattern para conexiones.
- **Validación**: envalid (config), Zod (DTOs/domain).
- **DI**: tsyringe + reflect-metadata.
- **Logging**: pino, pino-http.
- **Autenticación**: JWT con roles (recruiter, hiring_manager, hr_ops).
- **Rate Limiting**: express-rate-limit con configuración personalizable.
- **Contratos/Docs**: Swagger (swagger-jsdoc, swagger-ui-express); OpenAPI generado desde Zod.
- **Testing**: Jest, Supertest, ts-jest con configuración optimizada.
- **DX**: ts-node-dev, tsconfig-paths.

## Principios de arquitectura aplicados
- Domain-Driven Design (DDD)
  - Módulos por bounded context (`users`, `billing`, …) con `domain/`, `application/`, `infrastructure/`.
  - Dominio define entidades/objetos de valor e interfaces (puertos).
- Arquitectura Hexagonal (Ports & Adapters)
  - `domain` expone puertos, `infrastructure` implementa adaptadores (Prisma/HTTP).
  - Los casos de uso en `application` dependen solo de puertos.
- SOLID
  - SRP: archivos con única responsabilidad (usecase, repo, controller/router).
  - OCP/DIP: inyección por interfaces con tsyringe; extensible por polimorfismo.
  - ISP/LSP: interfaces específicas por módulo; implementaciones cumplen contratos.
- Screaming Architecture
  - La estructura refleja el dominio (`/users`) en lugar del framework.
- Tipado compartido con Zod/OpenAPI
  - Esquemas Zod como fuente de verdad para validación y contratos.

## Estrategia de testing
- **Unitarios**
  - Casos de uso en `application` con repositorios mock (puertos).
- **Integración**
  - Adaptadores Prisma con DB efímera (Docker o contenedor).
- **End-to-End (E2E)**
  - Supertest contra el servidor Express.
  - Tests de autenticación JWT y rate limiting.
- **Configuración Jest**
  - `moduleNameMapper` para aliases (`@shared/*`, `@users/*`).
  - `testPathIgnorePatterns` para excluir archivos helper.
  - Evita open handles: no llamar `app.listen` cuando `NODE_ENV === 'test'`.

### Tests implementados
- ✅ **Auth E2E**: Login, logout, credenciales inválidas
- ✅ **Rate Limiting E2E**: Verificación de límites por endpoint
- ✅ **Login UseCase**: Casos de uso de autenticación
- ✅ **Candidates Protected**: Endpoints protegidos por roles
- ✅ **App Integration**: Tests de integración general

## Buenas prácticas TypeScript en backend
- Exporta APIs con tipos explícitos; evita `any` salvo en límites de infraestructura.
- Early returns y funciones pequeñas; evita anidaciones profundas.
- No abuses de `try/catch`; captura solo donde se espera lanzar/propagar.
- Nombres descriptivos y consistentes (Clean Code).
- Comentarios solo cuando aporten contexto no evidente.
- Mantén `strict`, `esModuleInterop`, `skipLibCheck` en `tsconfig`.
- Usa aliases (`@shared/*`, `@users/*`) para imports legibles.

## Uso de herramientas y scripts
Requisitos:
- Node.js LTS, npm
- Docker (opcional) para PostgreSQL

Variables de entorno (`backend/.env`):
```
NODE_ENV=development
PORT=3010
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname?schema=public
JWT_SECRET=dev-secret
JWT_EXPIRES_MINUTES=15
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60
FILE_STORAGE_BASE_PATH=storage
TRUST_PROXY=true
```

Instalación:
```
npm install
```

Scripts:
```
npm run dev           # Desarrollo (ts-node-dev, tsconfig-paths)
npm run typecheck     # Comprobación de tipos
npm run build         # Compilación a dist/
npm run test          # Jest + Supertest
npm run prisma:init   # Inicializa Prisma
npm run prisma:generate  # Genera cliente Prisma
npm run generate:openapi # Genera openapi.json (si se usa el script)
```

### Generación de OpenAPI (autodetectada)
- El script `scripts/generate-openapi.ts` construye `openapi.json` detectando automáticamente los routers montados y rutas definidas en Express.
- Para enriquecer los contratos por ruta (request/response), registra metadatos en el router usando `registerOpenApiRoute`:

```ts
// users.router.ts
registerOpenApiRoute('POST', '/users/', {
  tags: ['users'],
  description: 'Create a new user',
  requestBodySchema: CreateUserInput,   // Zod v4
  responseSchema: CreateUserOutput,     // Zod v4
  responseStatus: 201,
});
```

- Ejecuta la generación:

```
npm run generate:openapi
```

- El archivo resultante se guarda en `backend/openapi.json`.

### Tipos de Frontend a partir de OpenAPI
- En el proyecto `frontend/` hay un script para generar tipos TypeScript desde `backend/openapi.json`:

```
npm --prefix backend run generate:openapi && npm --prefix frontend run types:openapi
```

- Esto escribirá los tipos en `frontend/src/types/openapi.ts` para su uso en desarrollo.

Swagger UI (si se expone): montar `swagger-ui-express` sirviendo `openapi.json` generado.

Docker/PostgreSQL (opcional): usar `docker-compose.yml` en la raíz para levantar la DB.

## Endpoints disponibles

### Autenticación
- `POST /auth/login` → Login con JWT (rate limited)
- `POST /auth/logout` → Logout (rate limited)

### Usuarios
- `POST /users` → Crear usuario (usa caso de uso + repo Prisma)

### Candidatos (Protegido)
- `GET /candidates/` → Listar candidatos recientes (requiere autenticación). Query params: `limit`, `sort=createdAt|-createdAt`.
- `POST /candidates` → Crear candidato. Requiere `role=recruiter`.
  - Content-Type: `multipart/form-data`
  - Campos: `firstName`, `lastName`, `email`, `phone?`, `address?`, `educacion?`, `experienciaLaboral?`, `cv?`
  - `cv` (opcional): PDF o DOCX, ≤ 5 MB. Se almacena en disco bajo `FILE_STORAGE_BASE_PATH/candidates/YYYY-MM-DD/` con nombre normalizado. La respuesta incluye `cvPath` si se adjuntó.
- `GET /candidates/suggest?field=educacion|experienciaLaboral&q=texto&limit=10` → Sugerencias para autocompletar (requiere `role=recruiter`).

### Health
- `GET /` → Health básico: "Hola LTI!"

### Documentación
- `GET /api-docs` → Swagger UI con documentación OpenAPI

---

## Scripts útiles (PowerShell)
```powershell
cd backend
npx prisma migrate dev --name add_candidates --skip-generate --schema prisma/schema.prisma
npx prisma generate --schema prisma/schema.prisma
npm run seed:candidates
npm run generate:openapi
```

## Estrategia de testing (resumen MVP)
- Unit: `CreateCandidateUseCase` (creación, conflicto por email) con repositorio mock. `CandidateSearchUseCase` (limit/sort) con repo en memoria.
- Integración HTTP: `GET /candidates/` 401/200; `POST /candidates` 400/403/201 con `multipart/form-data`; `GET /candidates/suggest` 400/200.
- Upload: test de integración verifica que `cvPath` existe en disco bajo `FILE_STORAGE_BASE_PATH`.
  
Ejecutar tests:
```powershell
cd backend
npm test
```
Si necesitas ampliar la documentación (CI/CD, migraciones Prisma, políticas de errores), añade secciones según crezca el dominio.
