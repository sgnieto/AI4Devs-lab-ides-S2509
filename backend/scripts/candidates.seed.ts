/* eslint-disable no-console */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.candidate.deleteMany({})
  const now = new Date()
  const items = Array.from({ length: 8 }).map((_, i) => ({
    firstName: `Nombre${i+1}`,
    lastName: `Apellido${i+1}`,
    email: `c${i+1}@mail.com`,
    createdAt: new Date(now.getTime() - i * 3600 * 1000),
  }))
  await prisma.candidate.createMany({ data: items })
  console.log('Seed de candidatos completado')
}

main().finally(async () => prisma.$disconnect())


