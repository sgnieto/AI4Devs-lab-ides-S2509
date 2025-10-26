import 'reflect-metadata'
import jwt from 'jsonwebtoken'

// Ensure env is available before importing middlewares
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret'

// Import after setting env
const { authenticateJwt } = require('@shared/http/middlewares/authenticateJwt')
const { authorizeRoles } = require('@shared/http/middlewares/authorizeRoles')

function mockReq(headers: Record<string, string> = {}) {
  return { header: (k: string) => headers[k.toLowerCase()] || headers[k] } as any
}
function mockRes() {
  const res: any = {}
  res.status = (c: number) => ((res.statusCode = c), res)
  res.json = (b: any) => ((res.body = b), res)
  return res
}

describe('auth middlewares', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret'
  })

  it('authenticateJwt rechaza sin token', () => {
    const req = mockReq()
    const res = mockRes()
    authenticateJwt(req as any, res as any, () => {})
    expect(res.statusCode).toBe(401)
  })

  it('authorizeRoles permite con rol correcto', () => {
    const token = jwt.sign({ sub: '1', email: 'a@b.com', role: 'recruiter' }, process.env.JWT_SECRET!)
    const req: any = mockReq({ authorization: `Bearer ${token}` })
    const res = mockRes()
    let called = false
    authenticateJwt(req as any, res as any, () => (called = true))
    expect(called).toBe(true)
    let called2 = false
    authorizeRoles('recruiter')(req as any, res as any, () => (called2 = true))
    expect(called2).toBe(true)
  })

  it('authorizeRoles deniega rol incorrecto', () => {
    const token = jwt.sign({ sub: '1', email: 'a@b.com', role: 'recruiter' }, process.env.JWT_SECRET!)
    const req: any = mockReq({ authorization: `Bearer ${token}` })
    const res = mockRes()
    authenticateJwt(req as any, res as any, () => {})
    authorizeRoles('hr_ops')(req as any, res as any, () => {})
    expect(res.statusCode).toBe(403)
  })
})


