export type Candidate = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  address?: string | null
  education?: string | null
  workExperience?: string | null
  cvPath?: string | null
  resumeUrl?: string | null
  createdAt: Date
}

export type CandidateSearchParams = {
  limit?: number
  sort?: 'createdAt' | '-createdAt'
}

export interface CandidateRepository {
  findMany(params: CandidateSearchParams): Promise<Candidate[]>
  findByEmail(email: string): Promise<Candidate | undefined>
  create(data: Omit<Candidate, 'id' | 'createdAt'>): Promise<Candidate>
}


