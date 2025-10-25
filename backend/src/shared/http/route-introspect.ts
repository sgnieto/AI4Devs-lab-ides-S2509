import type { Router } from 'express';

export type RouteDef = {
  method: string;
  path: string;
};

export function listRoutes(router: Router, prefix = ''): RouteDef[] {
  const stack: any[] = (router as any).stack || [];
  const routes: RouteDef[] = [];
  for (const layer of stack) {
    if (layer.route?.path) {
      const methods = Object.keys(layer.route.methods || {});
      for (const m of methods) {
        routes.push({ method: m.toUpperCase(), path: prefix + layer.route.path });
      }
    } else if (layer.name === 'router' && layer.handle?.stack) {
      const nested = listRoutes(layer.handle as Router, prefix + (layer.regexp?.fast_slash ? '' : (layer.path || '')));
      routes.push(...nested);
    }
  }
  return routes;
}


