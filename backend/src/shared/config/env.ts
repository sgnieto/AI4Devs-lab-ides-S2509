import 'dotenv/config';
import { cleanEnv, port, str, num, bool } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  PORT: port({ default: 3010 }),
  DATABASE_URL: str({ desc: 'PostgreSQL connection string for Prisma' }),
  JWT_SECRET: str({ desc: 'Secret for signing JWT (HS256)' }),
  JWT_EXPIRES_MINUTES: num({ default: 15 }),
  RATE_LIMIT_WINDOW_MS: num({ default: 60_000 }),
  RATE_LIMIT_MAX: num({ default: 60 }),
  FILE_STORAGE_BASE_PATH: str({ default: 'storage', desc: 'Base path on disk to store uploaded CV files' }),
  TRUST_PROXY: bool({ default: true, desc: 'Enable Express trust proxy for X-Forwarded-For headers' }),
});


