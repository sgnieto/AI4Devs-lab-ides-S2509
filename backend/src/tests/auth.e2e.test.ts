import request from 'supertest'
import { app } from '../index'
import bcrypt from 'bcryptjs'
import { env } from '@shared/config/env'
import { prisma } from '@shared/database/prisma'

describe('Auth E2E', () => {
  const email = 'e2e.user@example.com'
  const password = 'E2eStrong1!'

  beforeAll(async () => {
    // Seed user
    await prisma.user.deleteMany({ where: { email } })
    await prisma.user.create({
      data: {
        email,
        name: 'E2E',
        passwordHash: await bcrypt.hash(password, 12),
      } as any,
    })
  })

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email } })
    await prisma.$disconnect()
  })

  it('logs in with valid credentials and receives a JWT', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password })
      .expect(200)
    expect(res.body).toHaveProperty('token')
    expect(typeof res.body.token).toBe('string')
  })

  it('rejects invalid credentials with 401', async () => {
    await request(app)
      .post('/auth/login')
      .send({ email, password: 'WrongPass1!' })
      .expect(401)
  })

  it('returns 204 on logout', async () => {
    await request(app).post('/auth/logout').expect(204)
  })

})


