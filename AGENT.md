## AGENT.md

Este documento guía a los agentes (IA/automatizaciones en Cursor) que trabajan en este repositorio monorepo con `backend/` (Express + TypeScript + Prisma, DDD/Hexagonal) y `frontend/` (React + TypeScript + Tailwind + shadcn/ui).

### Principios globales (obligatorios)
- **KISS, DRY, YAGNI**: soluciones simples, sin duplicar lógica; refactoriza antes de duplicar, pero no sobre-ingenierices.
- **Cambios mínimos**: realiza solo las modificaciones imprescindibles para la tarea sin romper funcionalidades existentes.
- **Analiza antes de editar**: inspecciona el código y los `README.md` para entender arquitectura, capas y convenciones.
- **Respeta las capas**: sigue DDD + Hexagonal. Dominio y aplicación no dependen de infraestructura. Usa puertos/adaptadores.
- **Tipado estricto**: TypeScript estricto; evita `any` salvo en límites de infraestructura.
- **Estilo y formato**: mantén el estilo existente. No reformatees líneas no relacionadas.
- **Errores y logging**: no uses `console.log`; usa los logger(s) del proyecto. Propaga errores a manejadores centralizados. El sistema debe mostrar mensajes informativo y claro para el usuario. Se loga el detalle del error aunque sea técnico y se traduce al usuario para su claridad, no se revelan detalles de implementación en los mensajes.
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
  - `npm run dev` (desarrollo)
  - `npm run build`, `npm start`
  - `npm run test` (todas), `npm run test:unit`, `npm run test:e2e`, `npm run test:cov`
  - `npm run typecheck`, `npm run generate:openapi`, `npm run prisma:generate`.
- Frontend (desde `frontend/`):
  - `npm run start`, `npm run build`
  - `npm run test` (craco), `npm run test:jest` (jest directo), `npm run test:cov`
  - `npm run lint`, `npm run format`, `npm run shadcn`, `npm run types:openapi`.

### Reglas de arquitectura por paquete
- Backend
  - Capas: `domain/` (puertos/entidades), `application/` (casos de uso), `infrastructure/` (adaptadores: HTTP/Prisma), `shared/` (http/config/kernel).
  - DI: registra implementaciones en el contenedor (`tsyringe`) y consume interfaces desde capas internas.
  - Aliases: `@shared/*`, `@users/*` (ver `tsconfig.json`). Genera aliases para los bounded context
  - Validación/env: centralizada en `shared/config/env.ts` (envalid). No accedas a `process.env` directamente en otras capas.
  - Logging: usa `shared/kernel/logger.ts`/`pino-http`.
  - Contratos: Zod (+ zod-openapi) → `scripts/generate-openapi.ts` produce `openapi.json`.
    - Para sincronizar tipos en frontend: `npm --prefix backend run generate:openapi && npm --prefix frontend run types:openapi`.
    - Monta routers con `registerRouter(prefix, router)` en `shared/http/server.ts` para autodetección.
    - Anota endpoints con `registerOpenApiRoute(method, path, meta)` en cada router, incluyendo `requestBodySchema` y/o `responseSchema` (Zod v4).
    - Importa Zod desde `zod/v4` para compatibilidad con `zod-openapi@5`.
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
  - Si un bloque planificado no está disponible en el registry, usa alternativas con el mismo flujo MCP (buscar categorías y variantes equivalentes) y documenta el fallback en el plan.

### Tailwind v3 (frontend)
- Entrada CSS: usa `@tailwind base; @tailwind components; @tailwind utilities;` (no `@import "tailwindcss"`, reservado para v4).
- Variables: define tokens de color en `:root` y `.dark` antes de los `@tailwind` para que preflight pueda leerlos.
- Accesibilidad mínima: mensajes de error con `role="alert"` y `aria-live="assertive"`; “skip link” visible al foco.

### Pre-flight checklist (arquitectura)
- Backend: `reflect-metadata` importado en entry y en tests; env mínimos (`JWT_SECRET`, `JWT_EXPIRES_MINUTES`, `RATE_LIMIT_*`); aliases activos.
- Frontend: alias unificados (tsconfig, craco, jest); Router disponible en tests si el componente usa `useNavigate`.

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

### Alias Policy”:
- Lista oficial de alias:
  - "@components/*": ["components/*"]
  - "@ui/*": ["components/ui/*"]
  - "@lib/*": ["lib/*"]
  - "@hooks/*": ["hooks/*"]
  - "@assets/*": ["assets/*"]
  - "@{feature}/*": ["{feature}/*"] (por ejemplo: "@session/*": ["session/*"])
  - "@types/*": ["types/*"]

- Regla: “los tests deben usar SIEMPRE alias (no rutas relativas) salvo en casos excepcionales”
