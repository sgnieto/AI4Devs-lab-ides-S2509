# Frontend (React + TypeScript)

Aplicación React 18 + TypeScript con Tailwind CSS, shadcn/ui y Heroicons. Incluye ESLint + Prettier para formato consistente y CRACO para integrar PostCSS/Tailwind en CRA.

## Estructura

```
frontend/
  components.json                # Config del cliente shadcn (registries, estilo)
  craco.config.js                # PostCSS/Tailwind vía CRACO
  postcss.config.js
  tailwind.config.js
  package.json
  src/
    index.tsx
    index.css                    # @tailwind base, components, utilities + tokens CSS
    App.tsx
    components/
      ui/                        # Componentes UI (shadcn)
        button.tsx
    lib/
      utils.ts                   # utilidades (cn)
    tests/
      App.test.tsx
```

## Tecnologías

- **React 18** + TypeScript
- **Tailwind CSS** + tailwindcss-animate
- **shadcn/ui** (cliente `shadcn`, estilo `new-york`, base `slate`)
- **Heroicons** (`@heroicons/react`) y Lucide (`lucide-react`)
- **ESLint + Prettier** para calidad de código
- **CRA + CRACO** para configuración personalizada
- **Autenticación JWT** con contexto React
- **Tipos generados** desde OpenAPI del backend

## Principios de arquitectura

- SOLID en UI: componentes pequeños, props tipadas, lógica reutilizable en hooks.
- Atomic Design: base en `src/components/ui` y composición progresiva.
- Screaming Architecture (frontend): carpetas por feature/dominio cuando escale (`src/features/...`).
- Simplicity First: evitar sobre-ingeniería, utilidades mínimas y claras.

## Testing

- **Unit**: utilidades (`src/lib`), hooks y componentes puros.
- **Integración**: interacciones con Testing Library.
- **Autenticación**: tests de login, logout y protección de rutas.
- **Cobertura**: flujos críticos y renders condicionales.

Ejecutar: `cd frontend ; npm test`

### Tests implementados
- ✅ **App.test.tsx**: Tests de integración de la aplicación
- ✅ **LoginForm.test.tsx**: Tests del formulario de login
- ✅ **RequireRole.test.tsx**: Tests de protección por roles
 - ✅ **DashboardList.test.tsx**: Verifica “Últimos 5” (nombre+apellido / email / createdAt)

## Buenas prácticas TypeScript

- Tipar props/retornos; evitar `any`.
- Preferir unions/enums frente a strings sueltas.
- Centralizar helpers (`cn`) y evitar duplicaciones.
- Evitar side-effects en render; usar hooks.
- Nombres semánticos y consistentes.
- Container Pattern: Separa la lógica de negocio de la presentación
- Custom Hooks: Lógica de negocio en hooks
- Pureza de componentes: Components reciben props, hooks manejan estado

## Cliente shadcn (registries y comandos)

- Configuración en `components.json`:
  - style: `new-york`
  - tailwind.baseColor: `slate`
  - registries: `@ss-components`, `@ss-themes`, `@ss-blocks`

- Comandos (desde `frontend`):
  - Listar themes (ejemplo solicitado):
    ```bash
    npm run shadcn list @ss-themes
    ```
  - Listar componentes/bloques:
    ```bash
    npm run shadcn list @ss-components
    npm run shadcn list @ss-blocks
    ```
  - Añadir un componente (ejemplo):
    ```bash
    npm run shadcn -- add button --registry @ss-components
    ```

## Scripts

```bash
# desarrollo
npm run start

# build producción
npm run build

# lint/format
npm run lint
npm run lint:fix
npm run format

# testing
npm test

# generar tipos desde OpenAPI del backend
npm run types:openapi
```

## Características implementadas

- ✅ **Autenticación JWT** con contexto React
- ✅ **Protección de rutas** por roles
- ✅ **Componentes shadcn/ui** para UI consistente
- ✅ **Layout responsivo** con sidebar
- ✅ **Formularios** con validación
- ✅ **Tipos TypeScript** generados desde OpenAPI
- ✅ **Tests automatizados** con Jest y Testing Library
 - ✅ **Dashboard por rol (MVP)** con KPIs y lista “Últimos 5”

## Tipos generados desde OpenAPI
- Este proyecto incluye un script para generar tipos a partir de `backend/openapi.json`.
- Ejecuta:

```
npm --prefix backend run generate:openapi && npm --prefix frontend run types:openapi
```

- Los tipos se generan en `src/types/openapi.ts`. Úsalos así:

```ts
import type { paths } from './types/openapi';

type CreateUserBody =
  paths['/users/']['post']['requestBody']['content']['application/json'];
```

