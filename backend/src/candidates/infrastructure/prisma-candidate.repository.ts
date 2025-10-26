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

  async findByEmail(email: string): Promise<Candidate | undefined> {
    const row = await prisma.candidate.findUnique({ where: { email } })
    return row as unknown as Candidate | undefined
  }

  async create(data: Omit<Candidate, 'id' | 'createdAt'>): Promise<Candidate> {
    const createdBy = (data as any).createdBy
    const row = await prisma.candidate.create({ data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      address: data.address ?? null,
      education: data.education ?? null,
      workExperience: data.workExperience ?? null,
      cvPath: data.cvPath ?? null,
      resumeUrl: data.resumeUrl ?? null,
      createdBy: createdBy || null,
    } })
    return row as unknown as Candidate
  }
}


