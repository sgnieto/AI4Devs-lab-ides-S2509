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
- Respeta aliases de import: `@assets/*`, `@components/*`, `@hooks/*`, `@lib/*` (ver `tsconfig.json` y `craco.config.js`).
- Define aliases para cada bounded context.


### shadcn/ui y bloques
- Configuración en `components.json` (estilo `new-york`, baseColor `slate`, registries `@ss-components`, `@ss-themes`, `@ss-blocks`).
- Instala piezas exclusivamente mediante CLI:
  ```bash
  npm run shadcn -- add <componente|bloque|tema> --registry <@ss-components|@ss-blocks|@ss-themes>
  ```
- Si usas el servidor shadcn/studio (MCP), respeta su workflow:
  - /cui (create-ui): primero recoger todos los bloques, instalar al final y personalizar contenido después. No saltes pasos ni mezcles herramientas.
  - Fallback/Política de bloques: usa solo IDs confirmados por MCP (vía `get-blocks-metadata` + `get-block-meta-content`). Si un bloque no existe, utiliza componentes locales ya presentes (`ui/input`, `ui/label`, `ui/button`, `ui/card`, `ui/toast`, etc.) y documenta el fallback.

### Testing
- Usa Jest + Testing Library.
- Tests unitarios para utilidades y componentes puros; integración para interacciones.
- Mantén los tests rápidos y deterministas.

#### Utilidades de testing
- Usa `renderWithProviders` (MemoryRouter + SessionProvider) para componentes que dependan de Router y sesión.
- Polyfills en `src/setupTests.ts` (por ejemplo, `ResizeObserver`) para compatibilidad con Radix UI.

### Tailwind v3
- Entrada CSS: `@tailwind base; @tailwind components; @tailwind utilities;`.
- Tokens: define variables CSS en `:root` y `.dark` antes de los `@tailwind`.
- A11y mínimo: errores con `role="alert"` y `aria-live="assertive"`; “skip link” visible al foco.

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

### Orden de integración (contratos → UI)
1) Genera OpenAPI en backend y los tipos en frontend antes de tocar `src/lib/api.ts`.
2) Implementa o ajusta funciones de cliente (`apiFetch`, `fetchCandidates`, etc.).
3) Integra en UI con estados `loading/empty/error` y accesibilidad básica.

### Accesibilidad de listas y estados
- Listas: usa `ul/li` y `time` con `dateTime` para fechas; copia accesible en estados vacíos y errores (`aria-live`).
- Evita `role="list"` innecesario cuando usas `ul`/`li` semánticos.

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

### Subidas de archivos en FE (upload)
- Validar mimetype y tamaño en el cliente antes de enviar (PDF/DOCX, ≤ 5 MB).
- Usar `FormData` para `multipart/form-data` y añadir únicamente campos no vacíos.
- Mostrar mensajes accesibles (`role="alert"`, `aria-live="assertive"`) cuando el archivo sea inválido.


