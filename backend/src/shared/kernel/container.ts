import { container } from 'tsyringe';
import { PrismaUserRepository } from '@users/infrastructure/prisma-user.repository';

container.register('UserRepository', { useClass: PrismaUserRepository });

export { container };


