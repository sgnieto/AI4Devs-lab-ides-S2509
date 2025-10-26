export type Candidate = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  resumeUrl?: string | null
  createdAt: Date
}

export type CandidateSearchParams = {
  limit?: number
  sort?: 'createdAt' | '-createdAt'
}

export interface CandidateRepository {
  findMany(params: CandidateSearchParams): Promise<Candidate[]>
}


