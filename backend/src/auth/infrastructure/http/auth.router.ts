import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { container } from 'tsyringe'
import { registerOpenApiRoute } from '@shared/http/openapi-registry'
import { LoginUseCase, LoginRequest, LoginResponse } from '@auth/application/login.usecase'
import { env } from '@shared/config/env'

export const authRouter = Router()

const limiter = rateLimit({ 
  windowMs: env.RATE_LIMIT_WINDOW_MS, 
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
})

registerOpenApiRoute('POST', '/auth/login', {
  tags: ['auth'],
  description: 'User login (JWT)',
  requestBodySchema: LoginRequest,
  responseSchema: LoginResponse,
  responseStatus: 200,
})

authRouter.post('/login', limiter, async (req, res, next) => {
  try {
    const usecase = container.resolve(LoginUseCase)
    const result = await usecase.execute(req.body)
    res.json(result)
  } catch (err: any) {
    if (err?.message === 'INVALID_CREDENTIALS') return res.status(401).json({ error: 'INVALID_CREDENTIALS' })
    next(err)
  }
})

// For MVP logout is noop (client-side token discard). Added for parity.
registerOpenApiRoute('POST', '/auth/logout', {
  tags: ['auth'],
  description: 'Logout (client discards JWT)',
  responseStatus: 204,
})

authRouter.post('/logout', limiter, async (_req, res) => {
  res.status(204).end()
})


