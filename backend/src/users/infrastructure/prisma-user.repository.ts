import { injectable, singleton } from 'tsyringe';
import { UserRepository } from '@users/domain/user.repository';
import { prisma } from '@shared/database/prisma';

@injectable()
@singleton()
export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async save(user: any) {
    const created = await prisma.user.create({ data: user });
    return created;
  }
}


