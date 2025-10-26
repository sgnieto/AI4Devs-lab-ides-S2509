import bcrypt from 'bcryptjs'
import { prisma } from '@shared/database/prisma'

export async function createUserFixture(data: { email: string; name?: string; role?: 'recruiter' | 'hiring_manager' | 'hr_ops'; password?: string }) {
  const password = data.password || 'StrongPass1!'
  await prisma.user.deleteMany({ where: { email: data.email } })
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name || 'Test User',
      passwordHash: await bcrypt.hash(password, 12),
    } as any,
  })
}

export async function deleteUserFixture(email: string) {
  await prisma.user.deleteMany({ where: { email } })
}


