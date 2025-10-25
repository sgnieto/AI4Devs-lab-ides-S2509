# Define AGENT.md and project rules
_Exported on 10/25/2025 at 18:11:43 GMT+2 from Cursor (1.7.54)_

---

**User**

Eres prompt and context engineer experto en definición de reglas para cursor con optimización del contexto.
Tu tarea es definir el fichero AGENT.md para el proyecto, y si lo crees necesaria los específicos para los proyectos de frontend y backend.
Restricciones:
- Usa pensamiento profundo y crítico para buscar la mejor solución para que los agentes sigan la arquitectura y tecnologías, buenas prácticas, estrategias de testing... establecidas para el proyecto
- Es importante contemplar también la necesidad de que se hagan solo los mínimos cambios imprescindibles para realizar la tarea encomendada, sin romper funcionalidad anterior.
- Es importante seguir reglas KISS, DRY y YAGNI. Antes de duplicar código detecta necesidad de refactorización, pero no implementes más de una vez lógica similar.
- Analiza el codebase antes de realizar cualquier tarea.
Te proporciono a modo de ejemplo, un fichero de un agente de otro proyecto desarrollado con tecnología diferente. Es solo un ejemplo, construye el resultado con la información existente en este repositorio.
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application implementing AI chat streaming with hexagonal architecture. The application demonstrates Domain-Driven Design principles with clean separation between domain logic, application services, and infrastructure adapters.

## Architecture

### Tech Stack
- **Framework**: Next.js 13 with App Router (`app/` directory)
- **Architecture**: Hexagonal (Ports & Adapters) with Domain-Driven Design
- **AI Integration**: OpenAI SDK for chat completions
- **Streaming**: Vercel's Data Stream Protocol v1
- **State Management**: React Query (TanStack Query) + Vercel AI SDK
- **Testing**: Vitest with React Testing Library
- **UI Components**: shadcn/ui (new-york style)

### Hexagonal Architecture Layers

The codebase follows strict hexagonal architecture with three primary layers:

#### Backend
```
src/
  domain/              # Core business logic (framework-agnostic)
    entities/          # Aggregates (e.g., Conversation, Message)
    value-objects/     # Immutable domain concepts (MessageRole, ToolName)
    services/          # Domain services (ConversationOrchestrator)
    repositories/      # Repository interfaces
    exceptions/        # Domain-specific errors

  application/         # Use cases and application services
    use-cases/         # Business workflows (SendMessageUseCase, StreamChatCompletionUseCase)
    ports/
      inbound/         # Service interfaces exposed to presentation
      outbound/        # Interfaces for infrastructure dependencies
    dto/               # Data transfer objects
    mappers/           # DTO <-> Entity conversion

  infrastructure/      # Adapters and external integrations
    adapters/
      ai/              # OpenAI adapter
      streaming/       # Vercel stream adapter
      tools/           # Tool implementations
    repositories/      # Repository implementations
    config/            # DependencyContainer (IoC)
app/
  api/conversations/   # Next.js API route (thin controller)
```

#### Frontend
```
app/
  features/            # Feature-based organization for UI
    conversation/
      components/      # React components
      hooks/           # Business hooks (useConversation)
      data/            # Frontend data layer
```

### Key Architectural Principles

1. **Dependency Rule**: All dependencies point inward. Domain has zero dependencies on infrastructure.
2. **Ports & Adapters**: Infrastructure implements interfaces defined in application/ports
3. **Dependency Injection**: DependencyContainer manages all service instantiation
4. **Domain Entities**: Business rules enforced in entities (e.g., Conversation validates message ordering)

### Path Aliases (tsconfig.json)

```typescript
"@/*"              → Project root
"@/domain/*"       → ./src/domain/*
"@/application/*"  → ./src/application/*
"@/infrastructure/*" → ./src/infrastructure/*
"@/presentation/*" → ./src/presentation/*
"@/components"     → ./components (shadcn/ui)
"@/lib"            → ./lib
"@/hooks"          → ./hooks
```

## Development Commands

### Running the Application

```bash
yarn dev          # Development server on port 3000
yarn build        # Production build
yarn start        # Production server
```

### Testing

```bash
yarn test              # Run Vitest tests
yarn test:ui           # Run tests with UI
yarn test:coverage     # Run tests with coverage
```

### Linting

```bash
yarn lint         # ESLint
```

### Adding UI Components

```bash
npx shadcn-ui@latest add [component-name]
```

**Always use yarn instead of npm.**

## Environment Variables

Required in `.env`:
- `OPENAI_API_KEY` - OpenAI API key for GPT-4o model

## API Communication Flow

1. Frontend sends messages via `useConversation` hook → `/api/conversations`
2. API route delegates to use cases via DependencyContainer
3. `ManageConversationUseCase` creates/retrieves conversation entity
4. `SendMessageUseCase` adds user message to conversation
5. `StreamChatCompletionUseCase` orchestrates AI streaming:
   - Gets messages from conversation entity
   - Converts to OpenAI format via `OpenAIMessageConverter`
   - Streams response via `VercelStreamAdapter`
   - Executes tools via `ExecuteToolUseCase`
6. Frontend receives streaming response via Vercel AI SDK

## Key Technical Details

### Domain Entities

- **Conversation**: Aggregate root enforcing message ordering, status transitions, and conversation lifecycle
- **Message**: Entity with role validation, content, attachments, and tool invocations
- **Value Objects**: MessageRole, MessageContent, ToolName, Attachment, Coordinates

### Use Cases (Application Layer)

- `ManageConversationUseCase`: Create/retrieve conversations
- `SendMessageUseCase`: Add messages to conversations
- `StreamChatCompletionUseCase`: Stream AI responses
- `ExecuteToolUseCase`: Execute tool calls (e.g., weather)

### Frontend Architecture

The `useConversation` hook is the primary interface for chat functionality:
- Wraps Vercel AI SDK's `useChat` with business logic
- Manages conversation storage and metadata
- Provides derived state (isEmpty, isThinking, hasMessages)
- Handles error states with user-friendly messages

Located at: `app/features/conversation/hooks/useConversation.tsx:37`

### shadcn/ui Configuration

- Style: "new-york"
- Base color: zinc
- CSS variables enabled for theming
- Components auto-imported to `@/components/ui`

## Adding New Features

### Adding a New Tool

1. Create tool interface in `src/application/ports/outbound/` (e.g., `IWeatherService.ts`)
2. Implement tool in `src/infrastructure/adapters/tools/` (e.g., `WeatherTool.ts`)
3. Register in `ToolRegistry` (`src/infrastructure/adapters/tools/ToolRegistry.ts`)
4. Add to DependencyContainer if needed

### Adding a New Use Case

1. Define in `src/application/use-cases/`
2. Follow constructor injection pattern for dependencies
3. Add factory method to DependencyContainer
4. Call from API route controller

### Adding Frontend Components

Use shadcn/ui CLI:
```bash
npx shadcn-ui@latest add [component-name]
```

Components are automatically configured for the project's path aliases.

## Sub-Agent Workflow

## Rules
- After a plan mode phase you should create a `.claude/sessions/context_session_{feature_name}.md` with the definition of the plan
- Before you do any work, MUST view files in `.claude/sessions/context_session_{feature_name}.md` file and `.claude/doc/{feature_name}/*` files to get the full context (feature_name being the id of the session we are operate, if file doesnt exist, then create one)
- `.claude/sessions/context_session_{feature_name}.md` should contain most of context of what we did, overall plan, and sub agents will continusly add context to the file
- After you finish the work, MUST update the `.claude/sessions/context_session_{feature_name}.md` file to make sure others can get full context of what you did
- After you finish the each phase, MUST update the `.claude/sessions/context_session_{feature_name}.md` file to make sure others can get full context of what you did

## Sub-Agent Workflow
This project uses specialized sub-agents for different concerns. Always consult the appropriate agent:

- **shadcn-ui-architect**: UI building & component architecture
- **qa-criteria-validator**: Final UI/UX validation and feedback
- **ui-ux-analyzer**: UI review, improvements & tweaking
- **frontend-developer**: Client-side business logic
- **frontend-test-engineer**: Frontend test case definitions
- **typescript-test-explorer**: Test case design
- **hexagonal-backend-architect**: NextJS API & backend architecture
- **backend-test-architect**: Backend test definitions

Sub agents will do research about the implementation and report feedback, but you will do the actual implementation;
When passing task to sub agent, make sure you pass the context file, e.g. `.claude/sessions/context_session_{feature_name}.md`.
After each sub agent finish the work, make sure you read the related documentation they created to get full context of the plan before you start executing

## Code Writing Standards

- **Simplicity First**: Prefer simple, clean, maintainable solutions over clever ones
- **ABOUTME Comments**: All files must start with 2-line comment with "ABOUTME: " prefix
- **Minimal Changes**: Make smallest reasonable changes to achieve desired outcome
- **Style Matching**: Match existing code style/formatting within each file
- **Preserve Comments**: Never remove comments unless provably false
- **No Temporal Naming**: Avoid 'new', 'improved', 'enhanced', 'recently' in names/comments
- **Evergreen Documentation**: Comments describe code as it is, not its history

## Version Control

- Non-trivial edits must be tracked in git
- Create WIP branches for new work
- Commit frequently throughout development
- Never throw away implementations without explicit permission

## Testing Requirements

**NO EXCEPTIONS POLICY**: All projects MUST have:
- Unit tests

The only way to skip tests: Fran EXPLICITLY states "I AUTHORIZE YOU TO SKIP WRITING TESTS THIS TIME."

- Tests must comprehensively cover all functionality
- Test output must be pristine to pass
- Never ignore system/test output - logs contain critical information

## Architecture Compliance

When writing backend code:

1. **Keep Domain Pure**: Zero framework dependencies in `src/domain/`
2. **Define Ports First**: Interfaces in `src/application/ports/` before implementations
3. **Thin Controllers**: API routes delegate immediately to use cases
4. **Dependency Injection**: All dependencies injected via constructor
5. **Repository Pattern**: Data access only through repository interfaces

When writing frontend code:

1. **Container Pattern**: Separate business logic from presentation
2. **Custom Hooks**: Business logic in hooks (e.g., `useConversation`)
3. **Feature Organization**: Group by feature in `app/features/`
4. **Component Purity**: Components receive props, hooks manage state


## Code Writing

- YOU MUST ALWAYS address me as "Fran" in all communications.
- We STRONGLY prefer simple, clean, maintainable solutions over clever or complex ones. Readability and maintainability are PRIMARY CONCERNS, even at the cost of conciseness or performance.
- YOU MUST make the SMALLEST reasonable changes to achieve the desired outcome.
- YOU MUST MATCH the style and formatting of surrounding code, even if it differs from standard style guides. Consistency within a file trumps external standards.
- YOU MUST NEVER make code changes unrelated to your current task. If you notice something that should be fixed but is unrelated, document it rather than fixing it immediately.
- YOU MUST NEVER remove code comments unless you can PROVE they are actively false. Comments are important documentation and must be preserved.
- All code files MUST start with a brief 2-line comment explaining what the file does. Each line MUST start with "ABOUTME: " to make them easily greppable.
- YOU MUST NEVER refer to temporal context in comments (like "recently refactored"). Comments should be evergreen and describe the code as it is.
- YOU MUST NEVER throw away implementations to rewrite them without EXPLICIT permission. If you're considering this, YOU MUST STOP and ask first.
- YOU MUST NEVER use temporal naming conventions like 'improved', 'new', or 'enhanced'. All naming should be evergreen.
- YOU MUST NOT change whitespace unrelated to code you're modifying.

## Version Control

- For non-trivial edits, all changes MUST be tracked in git.
- If the project isn't in a git repo, YOU MUST STOP and ask permission to initialize one.
- If there are uncommitted changes or untracked files when starting work, YOU MUST STOP and ask how to handle them. Suggest committing existing work first.
- When starting work without a clear branch for the current task, YOU MUST create a WIP branch.
- YOU MUST commit frequently throughout the development process.


## Getting Help

- Always ask for clarification rather than making assumptions
- Stop and ask for help when stuck, especially when human input would be valuable
- If considering an exception to any rule, stop and get explicit permission from Fran first

## Testing

- Tests MUST comprehensively cover ALL implemented functionality. 
- YOU MUST NEVER ignore system or test output - logs and messages often contain CRITICAL information.
- Test output MUST BE PRISTINE TO PASS.
- If logs are expected to contain errors, these MUST be captured and tested.
- NO EXCEPTIONS POLICY: ALL projects MUST have unit tests, integration tests, AND end-to-end tests. The only way to skip any test type is if Fran EXPLICITLY states: "I AUTHORIZE YOU TO SKIP WRITING TESTS THIS TIME."


## Compliance Check
Before submitting any work, verify that you have followed ALL guidelines above. If you find yourself considering an exception to ANY rule, YOU MUST STOP and get explicit permission from Fran first.

---

**Cursor**

Voy a crear una lista de tareas para redactar los archivos AGENT.md y empezaré leyendo archivos clave del proyecto para ajustar las guías a la arquitectura real. Luego escribiré los AGENT.md correspondientes.

Ahora voy a revisar en paralelo archivos de documentación y configuración principales para extraer tecnologías, comandos y convenciones del proyecto.

Voy a leer en paralelo README, package.json y tsconfig de backend y frontend para detectar arquitectura, scripts, testing, tooling, además de los routers y use cases para confirmar el estilo hexagonal.

Acabo de revisar documentación y configuración de backend y frontend. Ahora marcaré el análisis como completado y empezaré a redactar AGENT.md en la raíz, seguido de los específicos de backend y frontend.

Voy a crear los archivos AGENT.md en la raíz, `backend/AGENT.md` y `frontend/AGENT.md` con las reglas y flujos alineados a la arquitectura real del repo, siguiendo KISS/DRY/YAGNI y priorizando cambios mínimos. Luego marcaré las tareas correspondientes como completadas.

```markdown
## AGENT.md

Este documento guía a los agentes (IA/automatizaciones en Cursor) que trabajan en este repositorio monorepo con `backend/` (Express + TypeScript + Prisma, DDD/Hexagonal) y `frontend/` (React + TypeScript + Tailwind + shadcn/ui).

### Principios globales (obligatorios)
- **KISS, DRY, YAGNI**: soluciones simples, sin duplicar lógica; refactoriza antes de duplicar, pero no sobre-ingenierices.
- **Cambios mínimos**: realiza solo las modificaciones imprescindibles para la tarea sin romper funcionalidades existentes.
- **Analiza antes de editar**: inspecciona el código y los `README.md` para entender arquitectura, capas y convenciones.
- **Respeta las capas**: sigue DDD + Hexagonal. Dominio y aplicación no dependen de infraestructura. Usa puertos/adaptadores.
- **Tipado estricto**: TypeScript estricto; evita `any` salvo en límites de infraestructura.
- **Estilo y formato**: mantén el estilo existente. No reformatees líneas no relacionadas.
- **Errores y logging**: no uses `console.log`; usa los logger(s) del proyecto. Propaga errores a manejadores centralizados.
- **Contratos como fuente de verdad**: en backend los esquemas Zod son el contrato; genera OpenAPI desde ellos (no edites manualmente `openapi.json`).
- **Testing primero**: añade/ajusta tests cuando cambies comportamiento. No rompas suites existentes.

### Estructura del repositorio
- `backend/`: API HTTP Express con DDD/Hexagonal, Prisma, Zod, DI (tsyringe), pino.
- `frontend/`: React 18 + TypeScript, Tailwind, shadcn/ui, CRA + CRACO, Testing Library.

### Flujo de trabajo recomendado
1. Leer documentación y `package.json` de la carpeta afectada para conocer scripts y tooling.
2. Identificar capa(s) involucradas y puntos de extensión (puertos/adaptadores en backend; componentes/hooks en frontend).
3. Diseñar el cambio más pequeño que cumpla el objetivo, sin duplicar código.
4. Implementar respetando las reglas de cada paquete (ver secciones específicas más abajo).
5. Añadir/ajustar tests (unit/integration/E2E según proceda) y ejecutar la suite.
6. En backend, si se modifican DTO/esquemas Zod, ejecutar generación de OpenAPI.

### Comandos útiles
- Backend (desde `backend/`):
  - `npm run dev` (desarrollo), `npm run build`, `npm start`, `npm run test`, `npm run typecheck`, `npm run generate:openapi`, `npm run prisma:generate`.
- Frontend (desde `frontend/`):
  - `npm run start`, `npm run build`, `npm test`, `npm run lint`, `npm run format`, `npm run shadcn`.

### Reglas de arquitectura por paquete
- Backend
  - Capas: `domain/` (puertos/entidades), `application/` (casos de uso), `infrastructure/` (adaptadores: HTTP/Prisma), `shared/` (http/config/kernel).
  - DI: registra implementaciones en el contenedor (`tsyringe`) y consume interfaces desde capas internas.
  - Aliases: `@shared/*`, `@users/*` (ver `tsconfig.json`).
  - Validación/env: centralizada en `shared/config/env.ts` (envalid). No accedas a `process.env` directamente en otras capas.
  - Logging: usa `shared/kernel/logger.ts`/`pino-http`.
  - Contratos: Zod (+ zod-openapi) → `scripts/generate-openapi.ts` produce `openapi.json`.
- Frontend
  - UI: componentes en `src/components/ui`, utilidades en `src/lib` (e.g., `cn`).
  - Estado/lógica: prefiere hooks/containers; componentes de presentación deben ser puros y tipados.
  - Estilos: Tailwind + tokens/variables; evita estilos inline innecesarios.
  - shadcn/ui: usa el CLI y la configuración en `components.json`. No copies/pegues código externo sin pasar por el flujo de instalación.

### Testing (obligatorio)
- Backend: Jest + Supertest. Unit para casos de uso (mocks de puertos). Integración para adaptadores (Prisma). E2E contra Express (sin `app.listen` en tests).
- Frontend: Jest + Testing Library. Tests unitarios de utilidades y componentes puros; integración para interacciones relevantes.

### Reglas para contratos y OpenAPI (backend)
- Define/actualiza esquemas Zod en capas de aplicación donde corresponda.
- Genera documentación con `npm run generate:openapi`. No edites `openapi.json` a mano.
- Mantén controllers/routers delgados: delegan en casos de uso y validan entrada/salida con Zod.

### Uso del cliente shadcn y MCP (frontend)
- Al instalar componentes/bloques/temas shadcn, sigue el flujo CLI y la configuración de `components.json`.
- Si interactúas con el servidor shadcn/studio (MCP) debes seguir estrictamente su workflow paso a paso:
  - Para create-ui (/cui): «collect first, install last», y después personaliza contenido.
  - No te saltes pasos, ni mezcles herramientas fuera de secuencia. Completa el flujo sin pedir confirmaciones intermedias.

### Criterios de aceptación de cambios
- Cambios mínimos, localizados y con tests pasando.
- Respeto de capas y dependencias (inward-only).
- Tipado explícito en APIs públicas; evitar `any`.
- Sin logging ad hoc ni supresión silenciosa de errores.
- Documentación/contratos actualizados cuando aplique.

### Guía rápida por tipo de tarea
- Añadir endpoint backend: define/ajusta puerto (interface) si procede → caso de uso → adaptador (repo/router) → registra en DI → tests → generar OpenAPI.
- Añadir componente frontend: instala vía shadcn → crea componente en `components/ui` → añade tests → evita lógica de negocio en el JSX; ponla en hooks.
- Corregir bug: reproducir con test, realizar el cambio mínimo, asegurar no romper flujos adyacentes.


```

Voy a marcar la redacción del AGENT.md raíz como completada y empezar con `backend/AGENT.md`. Luego haré lo mismo para `frontend/AGENT.md`.

```markdown
## BACKEND AGENT.md

Guía para agentes que implementan cambios en `backend/` (Express + TypeScript + Prisma) con arquitectura DDD + Hexagonal + SOLID + Screaming Architecture.

### Reglas clave
- Mantén la separación de capas: `domain/` (puertos), `application/` (casos de uso, validación Zod), `infrastructure/` (adaptadores HTTP/Prisma), `shared/` (config/env, http, kernel/DI, logger).
- Usa DI con `tsyringe` y registra implementaciones en `shared/kernel/container.ts`. Consume interfaces desde capas internas.
- No uses `console.log`; emplea `shared/kernel/logger.ts` y `pino-http` en el server.
- Valida inputs/outputs con Zod; trata Zod como fuente de verdad del contrato.
- Cambios mínimos y localizados; evita romper endpoints existentes.
- Respeta aliases de import: `@shared/*`, `@users/*` (ver `tsconfig.json`).

### Flujo por tipo de cambio
- Nuevo caso de uso
  1) Define/ajusta puertos en `domain/` si aplican.
  2) Implementa el caso de uso en `application/` con tipos explícitos y Zod para DTOs.
  3) Añade tests unitarios del caso de uso con repositorios mock.
  4) Si requiere persistencia, implementa adaptador en `infrastructure/` y registra en DI.

- Nuevo endpoint HTTP
  1) Mantén routers delgados en `infrastructure/http/*`. Valida `req` con Zod y delega al caso de uso.
  2) Registra el router en `shared/http/server.ts`.
  3) Añade tests E2E con Supertest para el endpoint.
  4) Si los esquemas cambiaron, genera OpenAPI.

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
- Maneja errores de forma coherente, propagando a middlewares y devolviendo respuestas consistentes.


```

He añadido `backend/AGENT.md`. Ahora lo marco como completado y paso a crear `frontend/AGENT.md`.

```markdown
## FRONTEND AGENT.md

Guía para agentes que trabajan en `frontend/` (React 18 + TypeScript + Tailwind + shadcn/ui, CRA + CRACO).

### Reglas clave
- Cambios mínimos y localizados. Evita romper estilos o props existentes.
- Componentes de presentación puros; mueve la lógica a hooks/containers.
- Tipado estricto de props/retornos; evita `any`. Usa utilidades en `src/lib` (e.g., `cn`).
- Usa Tailwind para estilos; evita duplicaciones. Reutiliza tokens/utilidades existentes.
- Sigue la estructura `src/components/ui` para piezas de UI (shadcn).

### shadcn/ui y bloques
- Configuración en `components.json` (estilo `new-york`, baseColor `slate`, registries `@ss-components`, `@ss-themes`, `@ss-blocks`).
- Instala piezas exclusivamente mediante CLI:
  ```bash
  npm run shadcn -- add <componente|bloque|tema> --registry <@ss-components|@ss-blocks|@ss-themes>
  ```
- Si usas el servidor shadcn/studio (MCP), respeta su workflow:
  - /cui (create-ui): primero recoger todos los bloques, instalar al final y personalizar contenido después. No saltes pasos ni mezcles herramientas.

### Testing
- Usa Jest + Testing Library.
- Tests unitarios para utilidades y componentes puros; integración para interacciones.
- Mantén los tests rápidos y deterministas.

### Comandos
```bash
npm run start
npm run build
npm test
npm run lint
npm run format
npm run shadcn
```

### Buenas prácticas TypeScript/React
- Props pequeñas y semánticas; usa discriminated unions cuando aplique.
- Evita efectos secundarios en render; usa hooks adecuados.
- Nombrado claro y consistente. Comentarios solo si aportan contexto no evidente.

### Guía rápida por tipo de tarea
- Añadir componente UI: instalar con shadcn → crear archivo en `components/ui` → tipar props → añadir tests.
- Añadir lógica de estado: crear hook en `src/hooks` → consumir desde componentes de presentación.
- Corrección de bug: reproducir con test → aplicar el cambio mínimo → asegurar que los renders y estilos no colaterales siguen intactos.


```

He creado los tres archivos y he cerrado todas las tareas.

- AGENT.md: reglas globales KISS/DRY/YAGNI, cambios mínimos, respeto de capas DDD/Hexagonal, contratos Zod→OpenAPI, testing por paquete, comandos, y flujo MCP de shadcn/studio sin desviaciones.
- backend/AGENT.md: pautas para puertos/casos de uso/adaptadores, DI con `tsyringe`, validación con Zod, generación de OpenAPI, testing unit/integración/E2E, comandos y buenas prácticas TS/logging/errores.
- frontend/AGENT.md: pautas de componentes puros + hooks, Tailwind/shadcn, workflow MCP (/cui) “collect first, install last”, testing con Testing Library y comandos.

¿Quieres que añada referencias cruzadas desde los README a estos AGENT.md para que sean más visibles?

