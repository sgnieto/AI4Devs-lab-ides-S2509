import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../index'

describe('Candidates integration', () => {
  const secret = process.env.JWT_SECRET || 'test-secret'
  it('GET /candidates 401 sin token', async () => {
    await request(app).get('/candidates/').expect(401)
  })
  it('GET /candidates 200 con token y array', async () => {
    const token = jwt.sign({ sub: '1', email: 'a@b.com', role: 'recruiter' }, secret)
    const res = await request(app).get('/candidates/?limit=5&sort=-createdAt').set('Authorization', `Bearer ${token}`).expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /candidates 403 si rol no permitido', async () => {
    const token = jwt.sign({ sub: '1', email: 'a@b.com', role: 'hiring_manager' }, secret)
    await request(app)
      .post('/candidates/')
      .set('Authorization', `Bearer ${token}`)
      .field('firstName', 'Ana')
      .field('lastName', 'García')
      .field('email', 'ana@example.com')
      .expect(403)
  })

  it('POST /candidates 400 por email inválido', async () => {
    const token = jwt.sign({ sub: '1', email: 'r@b.com', role: 'recruiter' }, secret)
    await request(app)
      .post('/candidates/')
      .set('Authorization', `Bearer ${token}`)
      .field('firstName', 'Ana')
      .field('lastName', 'García')
      .field('email', 'no-email')
      .expect(400)
  })

  it('GET /candidates/suggest 400 por field inválido', async () => {
    const token = jwt.sign({ sub: '1', email: 'r@b.com', role: 'recruiter' }, secret)
    await request(app)
      .get('/candidates/suggest?field=foo&q=dev')
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })
})


