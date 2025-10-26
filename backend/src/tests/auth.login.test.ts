import request from 'supertest'
import { app } from '../index'

describe('POST /auth/login', () => {
  it('returns 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'nope@example.com', password: 'wrongpass' })
      .expect(401)

    expect(res.body).toHaveProperty('error')
  })
})


