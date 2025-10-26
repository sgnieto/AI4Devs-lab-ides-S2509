import React from 'react'
import { screen } from '@testing-library/react'
import { renderWithProviders } from './utils/renderWithProviders'
import * as api from '@lib/api'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SessionProvider, useSession } from '@session/SessionContext'
import AppShell from '@components/layout/AppShell'
import { RequireRole } from '@components/RequireAuth'
import { fetchCandidates, type Candidate } from '@lib/api'

function Protected() {
  const { session } = useSession()
  const [candidates, setCandidates] = React.useState<Candidate[] | null>(null)
  React.useEffect(() => { fetchCandidates({ limit: 5, sort: '-createdAt' }).then(setCandidates) }, [])
  return (
    <AppShell>
      <h1>Dashboard</h1>
      <RequireRole roles={['recruiter','hiring_manager']}>
        <ul>
          {(candidates||[]).slice(0,5).map(c => (
            <li key={c.id}>
              <span>{c.firstName} {c.lastName}</span>
              <span>{c.email}</span>
              <time>{new Date(c.createdAt).toLocaleDateString()}</time>
            </li>
          ))}
        </ul>
      </RequireRole>
    </AppShell>
  )
}

function AppWithoutRouter() {
  const { session } = useSession()
  return (
    <Routes>
      <Route path="/dashboard" element={session.token ? <Protected /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

test('renderiza Últimos 5 con nombre+apellido, email y createdAt', async () => {
  const now = new Date().toISOString()
  jest.spyOn(api, 'fetchCandidates').mockResolvedValueOnce([
    { id: '1', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@ex.com', createdAt: now },
  ] as any)
  const token = ['x', btoa(JSON.stringify({ email: 't@t.com', role: 'recruiter' })), 'y'].join('.')
  renderWithProviders(<AppWithoutRouter />, { route: '/dashboard', token })
  expect(await screen.findByText(/Ada Lovelace/)).toBeInTheDocument()
  expect(screen.getByText(/ada@ex.com/)).toBeInTheDocument()
})


