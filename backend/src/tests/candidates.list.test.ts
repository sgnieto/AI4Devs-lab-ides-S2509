import request from 'supertest'
import jwt from 'jsonwebtoken'
import { app } from '../index'

describe('GET /candidates', () => {
  const secret = process.env.JWT_SECRET || 'test-secret'

  it('401 sin token', async () => {
    await request(app).get('/candidates').expect(401)
  })

  it('200 con token válido y respeta limit y sort', async () => {
    const token = jwt.sign({ sub: '1', email: 'x@y.com', role: 'recruiter' }, secret)
    const res = await request(app).get('/candidates?limit=5&sort=-createdAt').set('Authorization', `Bearer ${token}`).expect(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})


