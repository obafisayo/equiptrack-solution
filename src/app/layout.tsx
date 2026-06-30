import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Equiptrack',
    template: '%s | Equiptrack',
  },
  description: 'Real-time equipment lifecycle tracking for oil & gas field operations — from request to delivery.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  )
}
