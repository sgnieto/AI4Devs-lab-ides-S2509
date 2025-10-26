import { injectable, inject } from 'tsyringe'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '@shared/config/env'
import { UserRepository } from '@users/domain/user.repository'

export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const LoginResponse = z.object({
  token: z.string(),
})

type Claims = { sub: string; email: string; role: 'recruiter' | 'hiring_manager' | 'hr_ops' }

@injectable()
export class LoginUseCase {
  constructor(@inject('UserRepository') private readonly repo: UserRepository) {}

  async execute(input: unknown) {
    const dto = LoginRequest.parse(input)
    const user = await this.repo.findByEmail(dto.email)
    if (!user) throw new Error('INVALID_CREDENTIALS')
    const ok = await bcrypt.compare(dto.password, user.passwordHash)
    if (!ok) throw new Error('INVALID_CREDENTIALS')
    const claims: Claims = { sub: user.id, email: user.email, role: user.role }
    const token = jwt.sign(claims, env.JWT_SECRET, { expiresIn: `${env.JWT_EXPIRES_MINUTES}m` })
    return LoginResponse.parse({ token })
  }
}


