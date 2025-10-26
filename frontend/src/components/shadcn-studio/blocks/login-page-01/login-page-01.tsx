import { Button } from '@components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Separator } from '@components/ui/separator'
import { Toast } from '@components/ui/toast'

import Logo from '@components/shadcn-studio/logo'
import AuthBackgroundShape from '@assets/svg/auth-background-shape'
import LoginForm from '@components/shadcn-studio/blocks/login-page-01/login-form'

const Login = () => {
  return (
    <div className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute pointer-events-none'>
        <AuthBackgroundShape />
      </div>

      <Card className='z-10 w-full border-none shadow-md sm:max-w-lg'>
        <CardHeader className='gap-6'>
          <div>
            <CardTitle className='mb-1.5 text-2xl'>Inicia sesión</CardTitle>
            <CardDescription className='text-base'>Accede para gestionar candidatos y vacantes.</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* Login Form */}
          <div className='space-y-4'>
            <LoginForm />
          </div>
        </CardContent>
      </Card>
      {/* Placeholder toast container (controlled programáticamente en historias posteriores) */}
      <Toast message="" />
    </div>
  )
}

export default Login
