import React from 'react'
import Navbar from '@components/shadcn-studio/blocks/navbar-component-01/navbar-component-01'

type Props = {
  children: React.ReactNode
}

export default function AppShell({ children }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Saltar al contenido principal
      </a>
      <header role="banner">
        <Navbar navigationData={[]} />
      </header>
      <main id="main" role="main" className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}


