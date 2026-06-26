'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: Variant
  size?: Size
  disabled?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  children?: ReactNode
  className?: string
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-brand-500 hover:bg-brand-600 text-white border-transparent',
  secondary: 'bg-transparent hover:bg-brand-50 text-brand-500 border border-brand-500',
  ghost:     'bg-transparent hover:bg-neutral-100 text-gray-700 border border-border-default',
  danger:    'bg-status-critical hover:bg-red-600 text-white border-transparent',
  dark:      'bg-sidebar hover:bg-neutral-800 text-white border-transparent',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-6 text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center font-semibold rounded-button',
        'transition-colors duration-150 whitespace-nowrap select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
      {...rest}
    >
      {icon && iconPosition === 'left' && (
        <span className="flex items-center shrink-0">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="flex items-center shrink-0">{icon}</span>
      )}
    </button>
  )
}
