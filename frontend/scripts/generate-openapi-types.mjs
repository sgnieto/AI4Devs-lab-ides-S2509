import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import openapiTS from 'openapi-typescript';

async function main() {
  const input = resolve(process.cwd(), '../backend/openapi.json');
  const output = resolve(process.cwd(), 'src/types/openapi.ts');
  const raw = readFileSync(input, 'utf-8');
  const schema = JSON.parse(raw);
  const types = await openapiTS(schema, { exportType: true });
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, types);
  // eslint-disable-next-line no-console
  console.log(`Generated ${output}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


