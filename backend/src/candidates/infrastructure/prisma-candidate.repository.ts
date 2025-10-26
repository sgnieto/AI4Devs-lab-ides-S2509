import { injectable, singleton } from 'tsyringe'
import { prisma } from '@shared/database/prisma'
import type { CandidateRepository, Candidate, CandidateSearchParams } from '@candidates/domain/candidate.repository'

@injectable()
@singleton()
export class PrismaCandidateRepository implements CandidateRepository {
  async findMany(params: CandidateSearchParams): Promise<Candidate[]> {
    const limit = Math.max(1, Math.min(50, params.limit ?? 5))
    const orderBy = (params.sort === '-createdAt') ? { createdAt: 'desc' as const } : { createdAt: 'asc' as const }
    const rows = await prisma.candidate.findMany({ take: limit, orderBy })
    return rows as unknown as Candidate[]
  }
}


