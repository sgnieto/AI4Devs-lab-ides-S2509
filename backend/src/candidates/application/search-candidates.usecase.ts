import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import type { CandidateRepository, Candidate } from '@candidates/domain/candidate.repository'

export const CandidateSearchInput = z.object({
  limit: z.number().int().min(1).max(50).optional(),
  sort: z.enum(['createdAt', '-createdAt']).optional().default('-createdAt'),
})

export const CandidateSearchOutput = z.array(
  z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    education: z.string().optional().nullable(),
    workExperience: z.string().optional().nullable(),
    cvPath: z.string().optional().nullable(),
    createdAt: z.date(),
  })
)

@injectable()
export class CandidateSearchUseCase {
  constructor(@inject('CandidateRepository') private readonly repository: CandidateRepository) {}

  async execute(input: unknown): Promise<Candidate[]> {
    const dto = CandidateSearchInput.parse(input)
    const result = await this.repository.findMany({ limit: dto.limit, sort: dto.sort })
    return CandidateSearchOutput.parse(result)
  }
}


