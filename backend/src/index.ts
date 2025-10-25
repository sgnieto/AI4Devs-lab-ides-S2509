import 'reflect-metadata';
import { env } from '@shared/config/env';
import { createHttpServer } from '@shared/http/server';

export const app = createHttpServer();

const port = env.PORT;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at http://localhost:${port}`);
  });
}
