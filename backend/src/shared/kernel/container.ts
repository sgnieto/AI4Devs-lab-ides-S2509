import { container } from 'tsyringe';
import { PrismaUserRepository } from '@users/infrastructure/prisma-user.repository';
import { PrismaCandidateRepository } from '@candidates/infrastructure/prisma-candidate.repository';

container.register('UserRepository', { useClass: PrismaUserRepository });
container.register('CandidateRepository', { useClass: PrismaCandidateRepository });

export { container };


