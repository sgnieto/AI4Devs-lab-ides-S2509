import { Router } from 'express';

export type RegisteredRouter = { prefix: string; router: Router };

const registry: RegisteredRouter[] = [];

export function registerRouter(prefix: string, router: Router) {
  registry.push({ prefix, router });
  return router;
}

export function getRegisteredRouters() {
  return registry.slice();
}


