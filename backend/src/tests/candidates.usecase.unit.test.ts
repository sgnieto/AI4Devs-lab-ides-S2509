import { CandidateSearchUseCase } from '@candidates/application/search-candidates.usecase'
import type { CandidateRepository } from '@candidates/domain/candidate.repository'

class InMemoryRepo implements CandidateRepository {
  constructor(private data: any[]) {}
  async findMany(params: any) {
    const sorted = [...this.data].sort((a, b) => {
      const av = new Date(a.createdAt).getTime()
      const bv = new Date(b.createdAt).getTime()
      return params.sort === '-createdAt' ? bv - av : av - bv
    })
    return sorted.slice(0, Math.max(1, Math.min(50, params.limit ?? 5)))
  }
}

describe('CandidateSearchUseCase', () => {
  it('aplica limit y sort', async () => {
    const repo = new InMemoryRepo([
      { 
        id: '1', 
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        createdAt: new Date('2023-01-01') 
      },
      { 
        id: '2', 
        firstName: 'María',
        lastName: 'García',
        email: 'maria@example.com',
        createdAt: new Date('2023-01-02') 
      },
      { 
        id: '3', 
        firstName: 'Carlos',
        lastName: 'López',
        email: 'carlos@example.com',
        createdAt: new Date('2023-01-03') 
      },
    ])
    const usecase = new CandidateSearchUseCase(repo)
    const out = await usecase.execute({ limit: 2, sort: '-createdAt' })
    expect(out).toHaveLength(2)
    expect(out[0].id).toBe('3')
  })
})


