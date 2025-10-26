import type { paths } from '../types/openapi'

type LoginRequestBody = NonNullable<
  NonNullable<paths['/auth/login']['post']['requestBody']>['content']
>['application/json']

type LoginResponseBody = paths['/auth/login']['post']['responses'][200]['content']['application/json']

import { getSessionToken } from '@session/SessionContext'

export async function apiFetch<TResponse, TRequest = unknown>(
  url: string,
  options?: { method?: string; body?: TRequest; headers?: Record<string, string> }
): Promise<TResponse> {
  const method = options?.method ?? 'GET'
  const hasBody = typeof options?.body !== 'undefined'
  const headers: Record<string, string> = {
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(options?.headers ?? {}),
  }
  const token = getSessionToken?.()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const init: RequestInit = {
    method,
    headers,
    ...(hasBody ? { body: JSON.stringify(options?.body) } : {}),
  }

  const res = await fetch(url, init)
  if (!res.ok) {
    let msg = `${res.status}`
    try {
      const data = await res.json()
      msg = (data as any)?.error || msg
    } catch {
      // keep default msg
    }
    throw new Error(msg)
  }
  if (res.status === 204) return undefined as unknown as TResponse
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return (await res.json()) as TResponse
  // Non-JSON responses
  return (undefined as unknown) as TResponse
}

export async function loginRequest(input: LoginRequestBody): Promise<LoginResponseBody> {
  return apiFetch<LoginResponseBody, LoginRequestBody>('/auth/login', { method: 'POST', body: input })
}

// Auth logout
export async function logoutRequest(): Promise<void> {
  await apiFetch<void>('/auth/logout', { method: 'POST' })
}

// Users - Create
type CreateUserRequestBody = NonNullable<
  NonNullable<paths['/users/']['post']['requestBody']>['content']
>['application/json']

type CreateUserResponseBody = paths['/users/']['post']['responses'][201]['content']['application/json']

export async function createUserRequest(input: CreateUserRequestBody): Promise<CreateUserResponseBody> {
  return apiFetch<CreateUserResponseBody, CreateUserRequestBody>('/users/', { method: 'POST', body: input })
}

// Candidates - List
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
  createdAt: string
}

export async function fetchCandidates(params?: { limit?: number; sort?: 'createdAt' | '-createdAt' }): Promise<Candidate[]> {
  const qp = new URLSearchParams()
  if (params?.limit) qp.set('limit', String(params.limit))
  if (params?.sort) qp.set('sort', params.sort)
  const url = `/candidates${qp.toString() ? `?${qp.toString()}` : ''}`
  return apiFetch<Candidate[]>(url)
}

// Candidates - Create (multipart/form-data)
export async function createCandidateRequest(form: FormData): Promise<Candidate> {
  const headers: Record<string, string> = {}
  const token = getSessionToken?.()
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch('/candidates/', { method: 'POST', headers, body: form })
  if (!res.ok) {
    let msg = `${res.status}`
    try { msg = (await res.json())?.message || msg } catch {
      // Ignore JSON parsing errors, use default message
    }
    throw new Error(msg)
  }
  return (await res.json()) as Candidate
}

// Autocomplete suggestions
export type SuggestItem = { value: string; label: string; occurrences: number }
export async function fetchSuggestions(field: 'educacion'|'experienciaLaboral', q: string, limit = 10): Promise<SuggestItem[]> {
  const qp = new URLSearchParams({ field, q, limit: String(limit) })
  const url = `/candidates/suggest?${qp.toString()}`
  return (await apiFetch<{ items: SuggestItem[] }>(url)).items
}


