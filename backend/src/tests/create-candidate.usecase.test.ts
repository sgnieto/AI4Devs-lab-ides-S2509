import { CreateCandidateUseCase } from '@candidates/application/create-candidate.usecase'

describe('CreateCandidateUseCase', () => {
  it('crea candidato válido', async () => {
    const repo = mockRepo({ exists: false })
    const uc = new CreateCandidateUseCase(repo as any)
    const created = await uc.execute({ firstName: 'Ana', lastName: 'G', email: 'ana@example.com', createdBy: 'u1' })
    expect(created.email).toBe('ana@example.com')
  })

  it('lanza conflicto por email duplicado', async () => {
    const repo = mockRepo({ exists: true })
    const uc = new CreateCandidateUseCase(repo as any)
    await expect(uc.execute({ firstName: 'Ana', lastName: 'G', email: 'ana@example.com', createdBy: 'u1' })).rejects.toHaveProperty('code', 'EMAIL_CONFLICT')
  })
})

function mockRepo({ exists }: { exists: boolean }) {
  return {
    findByEmail: async () => exists ? ({ id: '1', firstName: 'Ana', lastName: 'G', email: 'ana@example.com', createdAt: new Date() }) : undefined,
    create: async (data: any) => ({ id: '2', ...data, createdAt: new Date() }),
  }
}


