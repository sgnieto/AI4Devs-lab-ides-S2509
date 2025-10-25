# 🧭 PROMPT MAESTRO --- SCAFFOLDING BACKEND BASADO EN INFORME TÉCNICO

## 📥 Contexto que recibirás

-   **Repositorio**: Directorio raíz del repo actual.

-   **Carpeta objetivo**: `./backend`

-   **Informe técnico (referencia autoritativa)**: se incluye en el prompt.

## 🎯 Objetivo

Realizar el **scaffolding completo** del proyecto de backend en
`./backend` **basándote estrictamente en el informe técnico** y en las
dependencias actuales del proyecto, cumpliendo:

1)  **Dependencias** instaladas y configuradas.\
2)  **Scripts** necesarios añadidos en `package.json`, funcionando y
    validados.\
3)  **Proyecto arrancando** con los cambios aplicados (build/dev/test
    OK).

## 📌 Reglas de oro

1)  **Planificar antes de ejecutar**: genera un plan paso a paso y
    **pídeme confirmación** antes de empezar a aplicar cambios.\
2)  **Preguntar siempre para clarificación** en lugar de asumir: si hay
    ambigüedad en el informe, en la estructura actual, o en
    compatibilidades, **pregunta**.\
3)  **Parar y pedir ayuda si te atascas** o si un paso requiere una
    decisión de producto/arquitectura.\
4)  **Compatibilidad primero**: detecta `node` y el gestor de paquetes
    (npm/yarn/pnpm) a partir de `lockfile` y respeta versiones semver
    existentes. Evita **breaking changes**; si son inevitables, **propón
    alternativas** y espera confirmación.\
5)  **Cambios mínimos y idempotentes**: si el comando se vuelve a
    ejecutar, no debe romper el proyecto.\
6)  **Auditable**: registra en tu salida un **resumen de acciones** y
    **comandos ejecutados**.\
7)  **No borres** nada crítico sin confirmación explícita. Si necesitas
    renombrar o mover, mantén copia/backup.\
8)  **Respeta el informe**: si hay conflicto entre el informe y el
    código existente, **señálalo** y pide resolución.

## ✅ Resultado esperado (criterios de aceptación)

-   `package.json` (en `./backend`) contiene dependencias y scripts
    acordes al informe y **compatibles** con las ya presentes.\
-   Los **scripts** clave funcionan:
    -   `typecheck`
    -   `dev`
    -   `build`
    -   `test`
    -   `generate:openapi`
-   Servidor **arranca** sin errores (`dev` o el script que indique el
    informe).
-   Tests **pasan** o están adecuadamente marcados/skipped con
    justificación.
-   Estructura de carpetas acorde a **DDD + Hexagonal + SOLID +
    Screaming Architecture**.
-   Contratos compartidos generados si aplica (Zod/OpenAPI u otro).

------------------------------------------------------------------------

## 🔎 Descubrimiento inicial

1)  Detectar **Node.js** (`node -v`) y gestor de paquetes por
    `lockfile`.
2)  Leer `./backend/package.json` (dependencias, scripts).
3)  Comparar con el **informe técnico** (dependencias objetivo,
    estructura, scripts).
4)  Detectar:
    -   `tsconfig.json`
    -   Linter/formatter
    -   Prisma, Swagger, Jest/Supertest
5)  Generar matriz de compatibilidad de versiones.

### ❓ Preguntas de clarificación

-   ¿Gestor de paquetes preferido?\
-   ¿Versión mínima de Node objetivo?\
-   Si hay conflictos, ¿actualizar o usar alternativa?\
-   ¿Añadir CI opcionalmente?\
-   ¿Puerto/host por defecto? ¿Variables de entorno?

------------------------------------------------------------------------

## 🧩 Plan de ejecución

1)  Backup y prechecks\
2)  Instalar/actualizar dependencias\
3)  Configurar TypeScript, paths y reflect-metadata\
4)  Crear estructura DDD/Hexagonal\
5)  Implementar adaptadores y puertos\
6)  Configurar contratos y OpenAPI\
7)  Añadir/ajustar scripts\
8)  Añadir pruebas básicas\
9)  Validar (typecheck, test, dev)\
10) Imprimir resumen

------------------------------------------------------------------------

## 🛠️ Ejecución

Usar el gestor detectado para instalar dependencias, ajustar scripts y
crear la estructura conforme al informe.\
Ejecutar validaciones finales (`typecheck`, `test`, `dev`) y reportar
resultados.

------------------------------------------------------------------------

## 🧪 Verificación final

-   Servidor arranca correctamente\
-   Rutas de API y Swagger operativas\
-   Tests pasan\
-   Estructura conforme\
-   Tabla de dependencias y scripts actualizada

------------------------------------------------------------------------

## 📝 Formato de salida

1)  Preguntas de clarificación\
2)  Plan detallado\
3)  Ejecución\
4)  Resultados\
5)  Siguientes pasos

------------------------------------------------------------------------

## 🚫 No hacer

-   No cambiar nada fuera de `./backend` sin permiso.\
-   No eliminar archivos críticos sin backup.\
-   No hacer upgrades mayores sin consulta.

------------------------------------------------------------------------

## ▶️ Secuencia de acción

1)  Escanear el repo.\
2)  Formular preguntas.\
3)  Esperar respuestas.\
4)  Presentar plan.\
5)  Ejecutar plan hasta el final, deteniéndose si requiere decisión.\
6)  Entregar informe con criterios de aceptación cumplidos.
