'use client'

interface AvatarProps {
  name: string
  size?: number
}

const PALETTE = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']

export function Avatar({ name, size = 36 }: AvatarProps) {
  const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  const color = PALETTE[name.charCodeAt(0) % PALETTE.length]
  return (
    <div
      style={{ width: size, height: size, background: color, borderRadius: '50%', flexShrink: 0 }}
      className="flex items-center justify-center text-white font-bold"
    >
      <span style={{ fontSize: size / 2.8 }}>{initials}</span>
    </div>
  )
}
