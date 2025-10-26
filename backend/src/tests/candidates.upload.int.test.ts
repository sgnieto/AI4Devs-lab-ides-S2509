import request from 'supertest'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { app } from '../index'
import { prisma } from '@shared/database/prisma'

describe('POST /candidates file upload', () => {
  const secret = process.env.JWT_SECRET || 'test-secret'

  beforeEach(async () => {
    // Crear un usuario de prueba para evitar problemas de FK
    await prisma.user.upsert({
      where: { id: 'u1' },
      update: {},
      create: {
        id: 'u1',
        email: 'r@b.com',
        name: 'Test User',
        passwordHash: 'test-hash',
        role: 'recruiter'
      }
    })
  })

  afterEach(async () => {
    // Limpiar candidatos creados en el test
    await prisma.candidate.deleteMany({
      where: { email: { contains: 'ana_' } }
    })
  })

  it('guarda el fichero bajo FILE_STORAGE_BASE_PATH y devuelve cvPath', async () => {
    // Usar un token sin sub para evitar problemas de FK
    const token = jwt.sign({ email: 'r@b.com', role: 'recruiter' }, secret)
    const pdfBuffer = Buffer.from('%PDF-1.4\n% Test PDF')
    const res = await request(app)
      .post('/candidates/')
      .set('Authorization', `Bearer ${token}`)
      .field('firstName', 'Ana')
      .field('lastName', 'García')
      .field('email', `ana_${Date.now()}@example.com`)
      .attach('cv', pdfBuffer, { filename: 'cv.pdf', contentType: 'application/pdf' })
      .expect(201)

    const cvPath = res.body?.cvPath as string | undefined
    expect(typeof cvPath).toBe('string')
    const base = process.env.FILE_STORAGE_BASE_PATH || 'storage'
    expect(cvPath?.startsWith(path.join(base, 'candidates'))).toBe(true)
    expect(fs.existsSync(cvPath!)).toBe(true)

    // cleanup best-effort
    try { fs.unlinkSync(cvPath!) } catch {}
  })
})


