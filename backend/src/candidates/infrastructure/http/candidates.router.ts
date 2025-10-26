import { Router, Request, Response, NextFunction } from 'express'
import multer, { FileFilterCallback } from 'multer'
import path from 'path'
import fs from 'fs'
import { authenticateJwt } from '@shared/http/middlewares/authenticateJwt'
import { authorizeRoles } from '@shared/http/middlewares/authorizeRoles'
import { container } from 'tsyringe'
import { CandidateSearchUseCase, CandidateSearchOutput, CandidateSearchInput } from '@candidates/application/search-candidates.usecase'
import { registerOpenApiRoute } from '@shared/http/openapi-registry'
import { CreateCandidateUseCase, CreateCandidateInput, CreateCandidateOutput } from '@candidates/application/create-candidate.usecase'
import { env } from '@shared/config/env'

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

// almacenamiento de CVs
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const base = env.FILE_STORAGE_BASE_PATH
    const dir = path.join(base, 'candidates', new Date().toISOString().slice(0,10))
    fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_').slice(0,64)
    cb(null, `${name}-${Date.now()}${ext}`)
  }
})

const upload = multer({
  storage,
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ok = ['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.mimetype)
    cb(null, ok)
  },
  limits: { fileSize: 5 * 1024 * 1024 }
})

registerOpenApiRoute('POST', '/candidates/', {
  tags: ['candidates'],
  description: 'Crear candidato',
  requestBodySchema: CreateCandidateInput,
  responseSchema: CreateCandidateOutput,
  responseStatus: 201,
})

candidatesRouter.post('/', authenticateJwt, authorizeRoles('recruiter'), upload.single('cv'), async (req, res, next) => {
  try {
    const usecase = container.resolve(CreateCandidateUseCase)
    const createdBy = (req as any).user?.sub as string | undefined
    const cvPath = (req as any).file ? (req as any).file.path : undefined
    const payload = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      education: req.body.educacion || req.body.education,
      workExperience: req.body.experienciaLaboral || req.body.workExperience,
      cvPath,
    }
    const result = await usecase.execute({ ...payload, createdBy })
    res.status(201).json(result)
  } catch (err: any) {
    if (err?.code === 'EMAIL_CONFLICT') return res.status(409).json({ error: 'CONFLICT', message: 'Email ya existe' })
    if (String(err?.message).includes('INVALID_FILE_TYPE')) return res.status(400).json({ error: 'BAD_REQUEST', message: 'Tipo de archivo no permitido' })
    if (String(err?.message).includes('File too large')) return res.status(400).json({ error: 'BAD_REQUEST', message: 'Archivo supera 5 MB' })
    if (err?.issues) return res.status(400).json({ error: 'BAD_REQUEST', details: err.issues })
    next(err)
  }
})

// Sugerencias para autocompletado
registerOpenApiRoute('GET', '/candidates/suggest', {
  tags: ['candidates'],
  description: 'Sugerencias para autocompletado de educación y experiencia',
})

candidatesRouter.get('/suggest', authenticateJwt, authorizeRoles('recruiter'), async (req, res, next) => {
  try {
    const field = String(req.query.field)
    const q = String(req.query.q || '')
    const limit = Math.min(10, Math.max(1, Number(req.query.limit) || 10))
    if (!['educacion','experienciaLaboral','education','workExperience'].includes(field)) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'field inválido' })
    }
    const column = (field === 'educacion' || field === 'education') ? 'education' : 'workExperience'
    // naive implementation using Prisma `$queryRaw` for DISTINCT and ILIKE
    const items = await (await import('@shared/database/prisma')).prisma.$queryRawUnsafe<any[]>(
      `SELECT ${column} AS value, COUNT(*)::int AS occurrences
       FROM "Candidate"
       WHERE ${column} IS NOT NULL AND ${column} ILIKE $1
       GROUP BY ${column}
       ORDER BY occurrences DESC
       LIMIT $2`, `%${q}%`, limit
    )
    res.json({ items: items.map(r => ({ value: r.value, label: r.value, occurrences: Number(r.occurrences) })) })
  } catch (err) {
    next(err)
  }
})


