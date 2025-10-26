import 'reflect-metadata'
import { LoginUseCase } from '@auth/application/login.usecase'
import { container } from 'tsyringe'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '@shared/config/env'

describe('LoginUseCase (unit)', () => {
  beforeAll(() => {
    // env values are loaded at module import; rely on current env
  })

  it('emite JWT válido con credenciales correctas', async () => {
    const password = 'StrongPass1!'
    const passwordHash = await bcrypt.hash(password, 12)
    const user = { id: 'u1', email: 'user@example.com', passwordHash, role: 'recruiter' }

    container.register('UserRepository', {
      useValue: {
        findByEmail: async (email: string) => (email === user.email ? user : null),
        save: async () => user,
      },
    })

    const uc = container.resolve(LoginUseCase)
    const res = await uc.execute({ email: user.email, password })
    expect(typeof res.token).toBe('string')
    const claims = jwt.verify(res.token, env.JWT_SECRET) as any
    expect(claims.email).toBe(user.email)
    expect(claims.role).toBe('recruiter')
  })

  it('falla con INVALID_CREDENTIALS si la contraseña no coincide', async () => {
    const user = { id: 'u1', email: 'user@example.com', passwordHash: await bcrypt.hash('rightpassword', 12), role: 'recruiter' }
    container.register('UserRepository', {
      useValue: { findByEmail: async () => user, save: async () => user },
    })
    const uc = container.resolve(LoginUseCase)
    await expect(uc.execute({ email: user.email, password: 'wrongpass' })).rejects.toThrow('INVALID_CREDENTIALS')
  })
})


