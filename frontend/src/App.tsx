import React from 'react';
import './App.css';
import { Button } from '@components/ui/button';
import { SessionProvider, useSession } from '@session/SessionContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@components/shadcn-studio/blocks/login-page-01/login-page-01';
import AppShell from '@components/layout/AppShell';
import { RequireAuth, RequireRole } from '@components/RequireAuth';

function Protected() {
  const { session, logout } = useSession()
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-4">Sesión: {session.email ?? 'desconocido'} | Rol: {session.role ?? 'N/A'}</p>
      <RequireRole roles={['recruiter']}>
        <p className="text-sm text-muted-foreground">Vista Recruiter</p>
      </RequireRole>
      <RequireRole roles={['hiring_manager']}>
        <p className="text-sm text-muted-foreground">Vista Hiring Manager</p>
      </RequireRole>
      <RequireRole roles={['hr_ops']}>
        <p className="text-sm text-muted-foreground">Vista HR Ops</p>
      </RequireRole>
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
