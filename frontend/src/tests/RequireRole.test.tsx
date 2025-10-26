import { render, screen } from '@testing-library/react'
import { RequireRole } from '../components/RequireAuth'
import { SessionProvider } from '@session/SessionContext'
import { MemoryRouter } from 'react-router-dom'

function renderWithSession(children: React.ReactNode, token = 'eyJhbGciOiJIUzI1NiJ9.' + btoa(JSON.stringify({ email: 'a@b.com', role: 'recruiter' })) + '.x') {
  ;(window as any).__sessionToken = token
  return render(
    <MemoryRouter>
      <SessionProvider>{children}</SessionProvider>
    </MemoryRouter>
  )
}

describe('RequireRole', () => {
  it('renderiza hijos cuando el rol es permitido', () => {
    renderWithSession(<RequireRole roles={['recruiter']}><p>ok</p></RequireRole>)
    expect(screen.getByText('ok')).toBeInTheDocument()
  })
})


