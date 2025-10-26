'use client'

import { useState } from 'react'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { loginRequest } from '@lib/api'

import { useSession } from '@session/SessionContext'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { login } = useSession()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      className='space-y-4'
      onSubmit={async e => {
        e.preventDefault()
        setError(null)
        const form = e.currentTarget as HTMLFormElement
        const email = (form.querySelector('#userEmail') as HTMLInputElement)?.value || ''
        const password = (form.querySelector('#password') as HTMLInputElement)?.value || ''
        try {
          setLoading(true)
          const { token } = await loginRequest({ email, password })
          login({ token })
          navigate('/dashboard', { replace: true })
        } catch (err: any) {
          setError(err?.message || 'LOGIN_FAILED')
        } finally {
          setLoading(false)
        }
      }}
    >
      {/* Email */}
      <div className='space-y-1'>
        <Label htmlFor='userEmail' className='leading-5'>
          Correo electrónico*
        </Label>
        <Input type='email' id='userEmail' placeholder='Introduce tu correo electrónico' />
      </div>

      {/* Password */}
      <div className='w-full space-y-1'>
        <Label htmlFor='password' className='leading-5'>
          Contraseña*
        </Label>
        <div className='relative'>
          <Input id='password' type={isVisible ? 'text' : 'password'} placeholder='••••••••••••••••' className='pr-9' />
          <Button
            variant='ghost'
            size='icon'
            type='button'
            onClick={() => setIsVisible(prevState => !prevState)}
            className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className='sr-only'>{isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}</span>
          </Button>
        </div>
      </div>

      {/* Remember Me and Forgot Password */}
      <div className='flex items-center justify-between gap-y-2'>
        <div className='flex items-center gap-3'>
          <Checkbox id='rememberMe' className='size-6' />
          <Label htmlFor='rememberMe' className='text-muted-foreground'>
            {' '}
            Recordarme
          </Label>
        </div>

        <a href='/forgot-password' className='hover:underline'>
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      {error ? (
        <p role='alert' aria-live='assertive' className='text-red-600 text-sm'>
          {error === 'INVALID_CREDENTIALS' ? 'Credenciales inválidas' : 'No se pudo iniciar sesión'}
        </p>
      ) : null}

      <Button className='w-full' type='submit' disabled={loading}>
        {loading ? 'Entrando…' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}

export default LoginForm
