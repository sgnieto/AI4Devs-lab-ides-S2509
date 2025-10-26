import request from 'supertest'
import { app } from '../index'
import jwt from 'jsonwebtoken'

describe('Protected candidates routes', () => {
  const secret = process.env.JWT_SECRET || 'test-secret'
  it('401 without token', async () => {
    await request(app).get('/candidates/stats').expect(401)
  })

  it('403 with wrong role', async () => {
    const token = jwt.sign({ sub: '1', email: 'x@y.com', role: 'hr_ops' }, secret)
    await request(app).get('/candidates/stats').set('Authorization', `Bearer ${token}`).expect(403)
  })

  it('200 with allowed role', async () => {
    const token = jwt.sign({ sub: '1', email: 'x@y.com', role: 'recruiter' }, secret)
    const res = await request(app).get('/candidates/stats').set('Authorization', `Bearer ${token}`).expect(200)
    expect(res.body).toHaveProperty('ok', true)
  })
})


