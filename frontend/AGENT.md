## FRONTEND AGENT.md

Guía para agentes que trabajan en `frontend/` (React 18 + TypeScript + Tailwind + shadcn/ui, CRA + CRACO).

### Principios de arquitectura

- SOLID en UI: componentes pequeños, props tipadas, lógica reutilizable en hooks.
- Atomic Design: base en `src/components/ui` y composición progresiva.
- Screaming Architecture (frontend): carpetas por feature/dominio cuando escale (`src/features/...`).
- Simplicity First: evitar sobre-ingeniería, utilidades mínimas y claras.
- KISS, DRY, YAGNI

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
# generar tipos desde OpenAPI del backend
npm run types:openapi
```

### Consumo de contratos OpenAPI del backend
- El backend genera `backend/openapi.json` con `npm run generate:openapi`.
- Si necesitas tipado de cliente o mocks, genera los tipos/SDK con `openapi-typescript` a `../backend/openapi.json`, para ello utiliza el comando proporcionado.
- Evita definir tipos duplicados en el frontend; sincroniza desde OpenAPI cuando sea posible.

#### Generación de tipos con openapi-typescript (incluida)
- Comando recomendado (desde la raíz):
  ```bash
  npm --prefix backend run generate:openapi && npm --prefix frontend run types:openapi
  ```
- Salida: `frontend/src/types/openapi.ts`.
- Uso:
  ```ts
  import type { paths } from '../types/openapi';
  type CreateUserBody = paths['/users/']['post']['requestBody']['content']['application/json'];
  ```

### Buenas prácticas TypeScript/React
- Props pequeñas y semánticas; usa discriminated unions cuando aplique.
- Evita efectos secundarios en render; usa hooks adecuados.
- Nombrado claro y consistente. Comentarios solo si aportan contexto no evidente.
- Preferir unions/enums frente a strings sueltas.
- Centralizar helpers (`cn`) y evitar duplicaciones.
- Container Pattern: Separa la lógica de negocio de la presentación
- Custom Hooks: Lógica de negocio en hooks
- Pureza de componentes: Components reciben props, hooks manejan estado

### Guía rápida por tipo de tarea
- Añadir componente UI: instalar con shadcn → crear archivo en `components/ui` → tipar props → añadir tests.
- Añadir lógica de estado: crear hook en `src/hooks` → consumir desde componentes de presentación.
- Corrección de bug: reproducir con test → aplicar el cambio mínimo → asegurar que los renders y estilos no colaterales siguen intactos.


