import React from 'react'

export function Toast({ message }: { message: string }) {
  if (!message) return null
  return (
    <div role="status" aria-live="polite" className="fixed bottom-4 right-4 z-50 rounded-md bg-foreground text-background px-3 py-2 shadow-md">
      {message}
    </div>
  )
}


