import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../components/shadcn-studio/blocks/login-page-01/login-form'
import { SessionProvider } from '@session/SessionContext'
import { renderWithProviders } from './utils/renderWithProviders'

describe('LoginForm', () => {
  it('renders labels and submit', () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByText(/Correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument()
  })

  it('shows error when backend fails', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'INVALID_CREDENTIALS' }) }) as any
    renderWithProviders(<LoginForm />)
    await userEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }))
    expect(await screen.findByText(/No se pudo iniciar sesión|Credenciales inválidas/i)).toBeInTheDocument()
  })
})


