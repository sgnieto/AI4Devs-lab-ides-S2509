import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { httpLogger } from '@shared/kernel/logger';
import '@shared/kernel/container';
import { usersRouter } from '@users/infrastructure/http/users.router';
import { authRouter } from '@auth/infrastructure/http/auth.router';
import { candidatesRouter } from '@candidates/infrastructure/http/candidates.router';
import { registerRouter } from './route-registry';
import { env } from '@shared/config/env';

export function createHttpServer() {
  const app = express();

  // Configurar trust proxy para manejar headers X-Forwarded-For
  app.set('trust proxy', env.TRUST_PROXY);

  app.use(express.json());
  app.use(httpLogger);

  app.get('/', (req, res) => {
    res.send('Hola LTI!');
  });

  // mount domain routers
  app.use('/users', registerRouter('/users', usersRouter));
  app.use('/auth', registerRouter('/auth', authRouter));
  app.use('/candidates', registerRouter('/candidates', candidatesRouter));

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    (req as any).log?.error({ err }, 'Unhandled error');
    res.type('text/plain');
    res.status(500).send('Something broke!');
  });

  return app;
}


