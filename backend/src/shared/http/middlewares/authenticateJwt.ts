import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '@shared/config/env'

type JwtClaims = {
  sub: string
  email: string
  role: 'recruiter' | 'hiring_manager' | 'hr_ops'
  iat?: number
  exp?: number
}

export function authenticateJwt(req: Request, res: Response, next: NextFunction) {
  const auth = req.header('authorization') || req.header('Authorization')
  if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'UNAUTHORIZED' })
  }
  const token = auth.slice(7).trim()
  try {
    const claims = jwt.verify(token, env.JWT_SECRET) as JwtClaims
    ;(req as any).user = claims
    return next()
  } catch {
    return res.status(401).json({ error: 'INVALID_TOKEN' })
  }
}


