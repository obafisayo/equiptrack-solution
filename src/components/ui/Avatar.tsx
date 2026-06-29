/* eslint-disable */
const PALETTE = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B',
  '#EF4444', '#06B6D4', '#EC4899', '#F97316',
]

function pickColor(name: string): string {
  const code = (name || ' ').charCodeAt(0)
  return PALETTE[code % PALETTE.length]
}

function initials(name: string): string {
  return (name || '?')
    .split(' ')
    .map(p => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface AvatarProps {
  name: string
  size?: number
  className?: string
}

export function Avatar({ name, size = 28, className = '' }: AvatarProps) {
  const bg = pickColor(name)
  const fontSize = Math.round(size / 2.8)

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 ${className}`}
      style={{ width: size, height: size, background: bg, fontSize }}
      title={name}
    >
      {initials(name)}
    </div>
  )
}
