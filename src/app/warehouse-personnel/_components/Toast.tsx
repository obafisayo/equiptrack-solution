'use client'

export interface ToastProps {
  message: string
}

export function Toast({ message }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-500 bg-neutral-900 text-white px-4 py-3 rounded-card shadow-overlay text-sm font-medium animate-fade-in">
      {message}
    </div>
  )
}
