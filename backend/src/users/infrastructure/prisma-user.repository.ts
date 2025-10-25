import { PrismaClient } from '@prisma/client';
import { UserRepository } from '@users/domain/user.repository';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma = new PrismaClient()) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async save(user: any) {
    await this.prisma.user.create({ data: user });
  }
}


