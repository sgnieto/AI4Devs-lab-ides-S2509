import React from 'react'
import { screen } from '@testing-library/react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SessionProvider, useSession } from '@session/SessionContext'
import Login from '@components/shadcn-studio/blocks/login-page-01/login-page-01'
import AppShell from '@components/layout/AppShell'
import { RequireAuth, RequireRole } from '@components/RequireAuth'
import { fetchCandidates, type Candidate } from '@lib/api'
import { Skeleton } from '@components/ui/skeleton'
import { Card } from '@components/ui/card'
import StatisticsCard from '@components/shadcn-studio/blocks/statistics-card-01'
import { TrendingUp } from 'lucide-react'
import { Button } from '@components/ui/button'
import * as api from '@lib/api'
import { renderWithProviders } from './utils/renderWithProviders'

// Componente Protected sin el router externo
function Protected() {
  const { session, logout } = useSession()
  const [candidates, setCandidates] = React.useState<Candidate[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    fetchCandidates({ limit: 5, sort: '-createdAt' })
      .then((data) => { if (mounted) setCandidates(data) })
      .catch((e: any) => { if (mounted) setError(e?.message || 'Error') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const todayCount = React.useMemo(() => {
    if (!candidates) return 0
    const today = new Date().toDateString()
    return candidates.filter(c => new Date(c.createdAt).toDateString() === today).length
  }, [candidates])

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-4">Sesión: {session.email ?? 'desconocido'} | Rol: {session.role ?? 'N/A'}</p>

      {loading && (
        <div className="grid gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {!loading && error && (
        <Card role="alert" aria-live="polite" className="p-4">
          <p className="text-sm">Ha ocurrido un error: {error}</p>
          <Button onClick={() => {
            setLoading(true)
            setError(null)
            fetchCandidates({ limit: 5, sort: '-createdAt' })
              .then((data) => setCandidates(data))
              .catch((e: any) => setError(e?.message || 'Error'))
              .finally(() => setLoading(false))
          }} className="mt-2">Reintentar</Button>
        </Card>
      )}

      {!loading && !error && (
        <div className="grid gap-6 md:grid-cols-2">
          <RequireRole roles={['recruiter']}>
            <StatisticsCard icon={<TrendingUp size={16} />} value={String(todayCount)} title="Candidatos hoy" changePercentage="0%" />
          </RequireRole>
          <RequireRole roles={['hiring_manager']}>
            <StatisticsCard icon={<TrendingUp size={16} />} value={String(candidates?.length || 0)} title="Recientes" changePercentage="0%" />
          </RequireRole>
          <RequireRole roles={['hr_ops']}>
            <StatisticsCard icon={<TrendingUp size={16} />} value={String(candidates?.filter(c => c.phone || c.resumeUrl).length || 0)} title="Calidad de datos (muestra)" changePercentage="0%" />
          </RequireRole>
        </div>
      )}

      <Button onClick={logout} className="mt-6">Cerrar sesión</Button>
    </AppShell>
  )
}

// Componente App sin BrowserRouter para tests
function AppWithoutRouter() {
  const { session } = useSession()
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={session.token ? <Protected /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={session.token ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

test('mounts app', () => {
  const { container } = renderWithProviders(<AppWithoutRouter />)
  expect(container).toBeTruthy()
})

test('dashboard renders heading when authenticated', async () => {
  jest.spyOn(api, 'fetchCandidates').mockResolvedValueOnce([] as any)
  
  const token = [
    'x',
    btoa(JSON.stringify({ email: 't@t.com', role: 'recruiter' })),
    'y',
  ].join('.')
  
  renderWithProviders(<AppWithoutRouter />, { 
    route: '/dashboard', 
    token 
  })
  
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
})
