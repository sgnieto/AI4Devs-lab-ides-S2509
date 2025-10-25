import 'dotenv/config';
import { cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  PORT: port({ default: 3010 }),
  DATABASE_URL: str({ desc: 'PostgreSQL connection string for Prisma' }),
});


