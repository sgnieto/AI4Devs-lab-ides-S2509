import React from 'react'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { renderWithProviders } from './utils/renderWithProviders'
import CandidateForm from '@components/shadcn-studio/CandidateForm'

describe('CandidateForm', () => {
  beforeEach(() => {
    // mock fetch for suggest and submit
    global.fetch = jest.fn(async (input: RequestInfo) => {
      const url = String(input)
      if (url.includes('/candidates/suggest')) {
        return new Response(JSON.stringify({ items: [{ value: 'Licenciatura', label: 'Licenciatura', occurrences: 10 }] }), { headers: { 'content-type': 'application/json' } })
      }
      if (url.includes('/candidates/')) {
        return new Response(JSON.stringify({ id: '1', firstName: 'Ana', lastName: 'G', email: 'ana@example.com', createdAt: new Date().toISOString() }), { headers: { 'content-type': 'application/json' } })
      }
      return new Response('{}', { status: 404 })
    }) as any
  })

  it('envía datos válidos y navega', async () => {
    const { container } = renderWithProviders(<CandidateForm />, { route: '/candidates/new', token: createToken('recruiter') })
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'García' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'ana@example.com' } })
    fireEvent.change(screen.getByLabelText(/Educación/i), { target: { value: 'Li' } })
    await waitFor(() => screen.getByRole('listbox'))
    fireEvent.click(screen.getByRole('option', { name: /Licenciatura/i }))
    fireEvent.submit(container.querySelector('form')!)
    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/candidates/'), expect.any(Object)))
  })
})

function createToken(role: 'recruiter'|'hiring_manager'|'hr_ops') {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ role, email: 't@t.com' }))
  return `${header}.${payload}.sig`
}


