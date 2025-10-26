import React, { createContext, useContext, useMemo, useState } from 'react'

type Role = 'recruiter' | 'hiring_manager' | 'hr_ops'

type Session = {
  token: string | null
  role: Role | null
  email: string | null
}

type SessionContextValue = {
  session: Session
  login: (payload: { token: string }) => void
  logout: () => void
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(() => {
    try {
      const token = (window as any)?.__sessionToken || null
      if (!token) return { token: null, role: null, email: null }
      const [, payload] = token.split('.')
      const decoded = JSON.parse(atob(payload)) as { role?: Role; email?: string }
      return { token, role: decoded.role ?? null, email: decoded.email ?? null }
    } catch {
      return { token: null, role: null, email: null }
    }
  })

  const value = useMemo<SessionContextValue>(() => ({
    session,
    login: ({ token }) => {
      try {
        const [, payload] = token.split('.')
        const decoded = JSON.parse(atob(payload)) as { role?: Role; email?: string }
        setSession({ token, role: decoded.role ?? null, email: decoded.email ?? null })
        try { (window as any).__sessionToken = token } catch (e) { /* no-op */ }
      } catch {
        setSession({ token, role: null, email: null })
        try { (window as any).__sessionToken = token } catch (e) { /* no-op */ }
      }
    },
    logout: () => setSession({ token: null, role: null, email: null }),
  }), [session])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}

export function getSessionToken() {
  try {
    // this is a simple getter; in app runtime, the provider will update window.__sessionToken
    return (window as any)?.__sessionToken || null
  } catch {
    return null
  }
}


