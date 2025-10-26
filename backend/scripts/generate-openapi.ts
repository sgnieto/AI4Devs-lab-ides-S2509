import 'reflect-metadata';
import { writeFileSync } from 'fs';
import { z } from 'zod';
import { createSchema } from 'zod-openapi';
import { createHttpServer } from '@shared/http/server';
import { getRegisteredRouters } from '@shared/http/route-registry';
import { listRoutes } from '@shared/http/route-introspect';
import { getOpenApiRouteMeta } from '@shared/http/openapi-registry';

// Esquema de ejemplo; sustituir por tus esquemas reales
const Example = z.object({ id: z.string(), name: z.string() });

// zod-openapi v5 tipa contra zod/v4; hacemos cast para compatibilidad con zod v3
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { schema: exampleSchema, components: exampleComponents } = createSchema(Example as any);

// Construir paths automáticamente desde routers registrados
const app = createHttpServer();
const paths: Record<string, any> = {};
for (const { prefix, router } of getRegisteredRouters()) {
  for (const r of listRoutes(router, prefix)) {
    paths[r.path] = paths[r.path] || {};
    const meta = getOpenApiRouteMeta(r.method, r.path);
    let requestBody;
    let responses: any = { '200': { description: 'OK' } };
    let tags: string[] | undefined;
    let description: string | undefined;
    if (meta) {
      tags = meta.tags;
      description = meta.description;
      if (meta.requestBodySchema) {
        const { schema } = createSchema(meta.requestBodySchema as any);
        requestBody = {
          content: { 'application/json': { schema } },
        };
      }
      if (meta.responseSchema) {
        const { schema } = createSchema(meta.responseSchema as any);
        const status = String(meta.responseStatus ?? 200);
        responses = { [status]: { description: 'Success', content: { 'application/json': { schema } } } };
      }
    }
    paths[r.path][r.method.toLowerCase()] = {
      tags,
      description,
      requestBody,
      responses,
    };
  }
}

const doc = {
  openapi: '3.0.0',
  info: { title: 'API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3010' }],
  components: {
    schemas: {
      ...exampleComponents,
      Example: exampleSchema,
    },
  },
  paths,
};

writeFileSync('openapi.json', JSON.stringify(doc, null, 2));

// eslint-disable-next-line no-console
console.log('openapi.json generado');


