import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SessionProvider } from '@session/SessionContext'

export function renderWithProviders(ui: React.ReactElement, options?: { route?: string; token?: string }) {
  if (options?.token) (window as any).__sessionToken = options.token
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[options?.route || '/']}>
      <SessionProvider>{children}</SessionProvider>
    </MemoryRouter>
  )
  return render(ui, { wrapper: Wrapper })
}


