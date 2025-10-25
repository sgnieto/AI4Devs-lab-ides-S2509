import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { httpLogger } from '@shared/kernel/logger';
import '@shared/kernel/container';
import { usersRouter } from '@users/infrastructure/http/users.router';
import { registerRouter } from './route-registry';

export function createHttpServer() {
  const app = express();

  app.use(express.json());
  app.use(httpLogger);

  app.get('/', (req, res) => {
    res.send('Hola LTI!');
  });

  // mount domain routers
  app.use('/users', registerRouter('/users', usersRouter));

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    (req as any).log?.error({ err }, 'Unhandled error');
    res.type('text/plain');
    res.status(500).send('Something broke!');
  });

  return app;
}


