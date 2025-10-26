import React from 'react';
import './App.css';
import { Button } from '@components/ui/button';
import { SessionProvider, useSession } from '@session/SessionContext';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from '@components/shadcn-studio/blocks/login-page-01/login-page-01';
import AppShell from '@components/layout/AppShell';
import { RequireAuth, RequireRole } from '@components/RequireAuth';
import { fetchCandidates, type Candidate } from '@lib/api';
import CandidateForm from '@components/shadcn-studio/CandidateForm';
import { Skeleton } from '@components/ui/skeleton';
import { Card } from '@components/ui/card';
import StatisticsCard from '@components/shadcn-studio/blocks/statistics-card-01';
import { TrendingUp } from 'lucide-react';

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
            <StatisticsCard icon={<TrendingUp size={16} />} value={String(candidates?.filter(c => c.phone || (c as any).cvPath).length || 0)} title="Calidad de datos (muestra)" changePercentage="0%" />
          </RequireRole>
      <RequireRole roles={[ 'recruiter' ]}>
        <div className="mt-6">
          <Link to="/candidates/new" className="inline-flex"><Button>Añadir candidato</Button></Link>
        </div>
      </RequireRole>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-6 grid gap-6">
          <RequireRole roles={['recruiter', 'hiring_manager']}>
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-3">Últimos 5 candidatos</h2>
              {(!candidates || candidates.length === 0) ? (
                <p className="text-sm text-muted-foreground" aria-live="polite">Sin candidatos recientes</p>
              ) : (
                <ul className="divide-y">
                  {candidates.slice(0,5).map((c) => (
                    <li key={c.id} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{c.firstName} {c.lastName}</p>
                        <p className="text-sm text-muted-foreground">{c.email}</p>
                      </div>
                      <time className="text-sm text-muted-foreground" dateTime={c.createdAt}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </time>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </RequireRole>
        </div>
      )}

      <Button onClick={logout} className="mt-6">Cerrar sesión</Button>
    </AppShell>
  )
}

function App() {
  const { session } = useSession()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={session.token ? <Protected /> : <Navigate to="/login" replace />} />
        <Route path="/candidates/new" element={session.token ? (
          <RequireRole roles={['recruiter']}>
            <AppShell>
              <CandidateForm />
            </AppShell>
          </RequireRole>
        ) : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={session.token ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function Root() {
  return (
    <SessionProvider>
      <App />
    </SessionProvider>
  )
}
