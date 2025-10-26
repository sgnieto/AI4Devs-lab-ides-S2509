import React from 'react'
import { useSession } from '@session/SessionContext'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session } = useSession()
  if (!session.token) return null
  return <>{children}</>
}

export function RequireRole({ roles, children }: { roles: Array<'recruiter' | 'hiring_manager' | 'hr_ops'>; children: React.ReactNode }) {
  const { session } = useSession()
  if (!session.token || !session.role || !roles.includes(session.role)) return null
  return <>{children}</>
}


