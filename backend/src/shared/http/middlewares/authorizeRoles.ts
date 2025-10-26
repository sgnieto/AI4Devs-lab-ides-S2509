import type { NextFunction, Request, Response } from 'express'

export function authorizeRoles(...allowed: Array<'recruiter' | 'hiring_manager' | 'hr_ops'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).user?.role as string | undefined
    if (!role) return res.status(403).json({ error: 'FORBIDDEN' })
    if (!allowed.includes(role as any)) return res.status(403).json({ error: 'FORBIDDEN' })
    return next()
  }
}


