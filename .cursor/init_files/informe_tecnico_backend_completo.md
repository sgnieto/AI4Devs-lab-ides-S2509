# 🧠 Informe Técnico: Integración de Herramientas Backend y Principios de Arquitectura

## 1. Contexto del Proyecto

El proyecto actual utiliza **Express + TypeScript + Prisma + Swagger +
Jest**.\
El objetivo es mejorar la estructura backend aplicando principios de
**DDD**, **Arquitectura Hexagonal**, **SOLID** y **Screaming
Architecture**, con **tipado compartido (Zod/OpenAPI)**.

------------------------------------------------------------------------

## 2. Principios de Arquitectura Aplicados

### ✅ Domain-Driven Design (DDD)

-   Cada módulo representa un bounded context.
-   Separación clara en `domain`, `application`, `infrastructure`.

**Objetivo:** Organizar el código en torno al dominio del negocio, no a
detalles técnicos.

**Aplicación práctica en el monorepo:** - Cada *bounded context*
(usuarios, pagos, inventario...) vive en su propio módulo o paquete
(`/packages`). - Separación clara: - `domain/`: entidades, objetos de
valor, interfaces (puertos) - `application/`: casos de uso (servicios) -
`infrastructure/`: adaptadores (repositorios, APIs externas)

**Ejemplo:**

    /users
      /application
        create-user.usecase.ts
      /domain
        user.entity.ts
        user.repository.ts
      /infrastructure
        prisma-user.repository.ts
      users.module.ts

------------------------------------------------------------------------

### ✅ Arquitectura Hexagonal (Ports & Adapters)

-   Adaptadores desacoplados (Prisma, APIs externas).
-   Repositorios definidos como interfaces.

**Objetivo:** Separar el core (dominio y lógica) de dependencias
externas (DB, red...).

**Aplicación:** - Interfaces en `domain/` - Adaptadores (Prisma, HTTP
clients...) en `infrastructure/` - Los `application/` services dependen
solo de puertos - Inyección mediante DI en módulos

**Ventajas:** testing más sencillo, desacoplamiento, reemplazo de
infraestructura sin tocar dominio.

------------------------------------------------------------------------

### ✅ Principios SOLID

  -----------------------------------------------------------------------
  Principio            Aplicación en el stack
  -------------------- --------------------------------------------------
  SRP                  Cada archivo tiene única responsabilidad: usecase,
                       repo, controller

  OCP                  Extensión por inyección/polimorfismo

  LSP                  Implementaciones cumplen interfaces (ej.
                       repositorios)

  ISP                  Interfaces específicas por módulo

  DIP                  Módulos dependen de interfaces, no de clases
                       concretas
  -----------------------------------------------------------------------

------------------------------------------------------------------------

### ✅ Screaming Architecture

**Objetivo:** La estructura del código debe reflejar el dominio, no los
frameworks.

**Aplicación:** - Evitar `/controllers`, `/services`, `/models`. - Usar
`/users`, `/billing`, `/catalog`, etc. con subcarpetas: `domain/`,
`application/`, `infrastructure/`. - Clases orientadas a negocio:
`CreateUserUseCase`, `UserRepository`, `Invoice`.

------------------------------------------------------------------------

### ✅ Conclusión de Principios

-   🔄 Tipado compartido con Zod/OpenAPI\
-   🧱 Arquitectura limpia, hexagonal, modular

------------------------------------------------------------------------

## 3. Nuevas Dependencias Backend

  -----------------------------------------------------------------------
  Tipo            Paquete                    Propósito
  --------------- -------------------------- ----------------------------
  Inversión de    `tsyringe`,                Inyección de dependencias
  dependencias    `reflect-metadata`         basada en interfaces (DIP).

  Validación y    `zod`, `zod-to-openapi`    Validación y generación de
  tipado                                     contratos OpenAPI desde Zod.

  Configuración   `envalid`                  Validación de variables de
  segura                                     entorno.

  Cliente HTTP    `undici` o `zodios`        Llamadas HTTP tipadas o con
                                             validación.

  Logging         `pino`, `pino-http`        Log JSON estructurado y
  estructurado                               trazabilidad.

  Manejo de       `express-async-errors`     Captura errores en rutas
  errores async                              async sin boilerplate.

  Contratos HTTP  `@ts-rest/core`,           Contratos cliente-servidor
  (opcional)      `@ts-rest/express`         basados en Zod.

  Alias de paths  `tsconfig-paths`           Importaciones limpias
                                             (`@users/...`).
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 4. Cambios Recomendados en `package.json`

``` json
{
  "dependencies": {
    "pino": "^9.0.0",
    "pino-http": "^9.0.0",
    "express-async-errors": "^3.1.1",
    "reflect-metadata": "^0.1.13",
    "tsyringe": "^4.8.0",
    "zod": "^3.23.8",
    "zod-to-openapi": "^7.2.0",
    "undici": "^6.19.8"
  },
  "devDependencies": {
    "tsconfig-paths": "^4.3.0"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "dev": "node -r ts-node/register -r tsconfig-paths/register -r reflect-metadata node_modules/ts-node-dev/bin/ts-node-dev --respawn --transpile-only src/index.ts",
    "generate:openapi": "ts-node -r tsconfig-paths/register -r reflect-metadata scripts/generate-openapi.ts"
  }
}
```

------------------------------------------------------------------------

## 5. Estructura de Carpetas Recomendada

    /src
      /users
        /domain
          user.entity.ts
          user.repository.ts
        /application
          create-user.usecase.ts
          get-user.usecase.ts
          dtos.ts
        /infrastructure
          prisma-user.repository.ts
          /http
            users.router.ts
      /shared
        /kernel
          logger.ts
          container.ts
        /config
          env.ts
        /http
          server.ts
      index.ts

**Claves:**\
- Dominio define interfaces (puertos).\
- Application contiene casos de uso.\
- Infrastructure implementa adaptadores (Prisma, HTTP, APIs externas).

------------------------------------------------------------------------

## 6. Ejemplos Clave de Implementación

### a) Puerto de Repositorio (Dominio)

``` ts
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

### b) Caso de Uso + Validación con Zod

``` ts
@injectable()
export class CreateUserUseCase {
  constructor(@inject("UserRepository") private readonly repo: UserRepository) {}

  async execute(input: unknown) {
    const dto = CreateUserInput.parse(input);
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw new Error("EMAIL_TAKEN");
    const user = { ...dto, id: crypto.randomUUID() };
    await this.repo.save(user);
    return CreateUserOutput.parse(user);
  }
}
```

### c) Adaptador Prisma (Infraestructura)

``` ts
export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
  async save(user: any) {
    await prisma.user.create({ data: user });
  }
}
```

### d) Registro de Inyección

``` ts
container.register("UserRepository", { useClass: PrismaUserRepository });
```

### e) Adaptador HTTP (Express)

``` ts
router.post("/", async (req, res, next) => {
  try {
    const usecase = container.resolve(CreateUserUseCase);
    const result = await usecase.execute(req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
});
```

------------------------------------------------------------------------

## 7. Generación Automática de OpenAPI

``` ts
const generator = new OpenAPIGenerator(registry.definitions, "3.0.0");
const doc = generator.generateDocument({
  openapi: "3.0.0",
  info: { title: "API", version: "1.0.0" }
});
writeFileSync("openapi.json", JSON.stringify(doc, null, 2));
```

**Ventajas:**\
- Tipos y contratos se generan desde una sola fuente (Zod).\
- Swagger UI puede servir `openapi.json` directamente.

------------------------------------------------------------------------

## 8. Testing

-   **Unitarios:** Casos de uso con mocks de repositorio.\
-   **Integración:** Adaptadores Prisma con SQLite o contenedor.\
-   **E2E:** Supertest sobre el servidor Express.

------------------------------------------------------------------------

## 9. Checklist de Principios

  Principio                Implementación
  ------------------------ ---------------------------------------------------------
  DDD                      `domain/application/infrastructure` por bounded context
  Hexagonal                puertos en dominio, adaptadores en infraestructura
  SOLID                    SRP, DIP con `tsyringe`, ISP por módulo
  Screaming Architecture   carpetas por dominio, no por framework

------------------------------------------------------------------------

## 10. Conclusión

Con esta configuración se logra un backend **limpio, modular y
desacoplado**, con **contratos tipados compartidos** entre frontend y
backend.\
La base de Express y Prisma se mantiene, pero se adopta una arquitectura
alineada a **DDD + Hexagonal**, mejorando escalabilidad, mantenibilidad
y DX.
