import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import openapiTS, { astToString, COMMENT_HEADER } from 'openapi-typescript';

async function main() {
  const input = resolve(process.cwd(), '../backend/openapi.json');
  const output = resolve(process.cwd(), 'src/types/openapi.ts');
  const raw = readFileSync(input, 'utf-8');
  const schema = JSON.parse(raw);
  const nodes = await openapiTS(schema, { exportType: true });
  const text = `${COMMENT_HEADER}${astToString(nodes)}`;
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, text);
  // eslint-disable-next-line no-console
  console.log(`Generated ${output}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


