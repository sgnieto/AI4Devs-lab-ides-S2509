import { Router } from 'express'
import { authenticateJwt } from '@shared/http/middlewares/authenticateJwt'
import { authorizeRoles } from '@shared/http/middlewares/authorizeRoles'

export const candidatesRouter = Router()

// Stub protegido: solo roles recruiter pueden acceder
candidatesRouter.get('/stats', authenticateJwt, authorizeRoles('recruiter'), (_req, res) => {
  res.json({ ok: true })
})


