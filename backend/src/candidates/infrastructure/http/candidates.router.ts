import { Router } from 'express'
import { authenticateJwt } from '@shared/http/middlewares/authenticateJwt'
import { authorizeRoles } from '@shared/http/middlewares/authorizeRoles'
import { container } from 'tsyringe'
import { CandidateSearchUseCase, CandidateSearchOutput, CandidateSearchInput } from '@candidates/application/search-candidates.usecase'
import { registerOpenApiRoute } from '@shared/http/openapi-registry'

export const candidatesRouter = Router()

// Stub protegido: solo roles recruiter pueden acceder
candidatesRouter.get('/stats', authenticateJwt, authorizeRoles('recruiter'), (_req, res) => {
  res.json({ ok: true })
})

registerOpenApiRoute('GET', '/candidates/', {
  tags: ['candidates'],
  description: 'Listar candidatos recientes',
  responseSchema: CandidateSearchOutput,
})

candidatesRouter.get('/', authenticateJwt, async (req, res, next) => {
  try {
    const usecase = container.resolve(CandidateSearchUseCase)
    const limit = req.query.limit ? Number(req.query.limit) : undefined
    const sort = (req.query.sort as any) || undefined
    const input = CandidateSearchInput.parse({ limit, sort })
    const result = await usecase.execute(input)
    res.json(result)
  } catch (err) {
    next(err)
  }
})


