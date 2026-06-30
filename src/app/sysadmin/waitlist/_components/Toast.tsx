'use client'

interface ToastProps {
  message: string
}

export function Toast({ message }: ToastProps) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 300,
      background: '#111827', color: '#fff',
      padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    }}>
      {message}
    </div>
  )
}
