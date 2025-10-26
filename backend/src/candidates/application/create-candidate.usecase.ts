import { inject, injectable } from 'tsyringe'
import { z } from 'zod'
import type { CandidateRepository, Candidate } from '@candidates/domain/candidate.repository'

export const CreateCandidateInput = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  education: z.string().max(100).optional().nullable(),
  workExperience: z.string().max(100).optional().nullable(),
  cvPath: z.string().optional().nullable(),
  createdBy: z.string().optional(),
})

export const CreateCandidateOutput = z.object({
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

@injectable()
export class CreateCandidateUseCase {
  constructor(@inject('CandidateRepository') private readonly repository: CandidateRepository) {}

  async execute(input: z.infer<typeof CreateCandidateInput>): Promise<Candidate> {
    const dto = CreateCandidateInput.parse(input)
    const existing = await this.repository.findByEmail(dto.email)
    if (existing) {
      const err: any = new Error('EMAIL_CONFLICT')
      err.code = 'EMAIL_CONFLICT'
      throw err
    }
    
    // Preparar los datos para crear el candidato
    // El cvPath ya viene procesado por multer en el router
    const candidateData = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      address: dto.address,
      education: dto.education,
      workExperience: dto.workExperience,
      cvPath: dto.cvPath, // Ruta del archivo guardado por multer
      createdBy: dto.createdBy, // ID del usuario que crea el candidato
    }
    
    const created = await this.repository.create(candidateData)
    return CreateCandidateOutput.parse(created)
  }
}


