export type OpenApiRouteMeta = {
  description?: string;
  tags?: string[];
  requestBodySchema?: unknown;
  responseSchema?: unknown;
  responseStatus?: number;
};

type Key = `${string} ${string}`; // "METHOD /path"

const metaMap = new Map<Key, OpenApiRouteMeta>();

export function registerOpenApiRoute(method: string, path: string, meta: OpenApiRouteMeta) {
  const key = `${method.toUpperCase()} ${normalizePath(path)}` as Key;
  metaMap.set(key, meta);
}

export function getOpenApiRouteMeta(method: string, path: string): OpenApiRouteMeta | undefined {
  const normalized = normalizePath(path);
  const key = `${method.toUpperCase()} ${normalized}` as Key;
  const altKey = `${method.toUpperCase()} ${toggleTrailingSlash(normalized)}` as Key;
  return metaMap.get(key) ?? metaMap.get(altKey);
}

function normalizePath(p: string) {
  return p.replace(/\\+/g, '/');
}

function toggleTrailingSlash(p: string) {
  return p.endsWith('/') ? p.slice(0, -1) : `${p}/`;
}


