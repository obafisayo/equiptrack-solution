'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'brand' | 'secondary' | 'ghost' | 'danger' | 'dark' | 'outline' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  variant?: Variant
  size?: Size
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  onClick?: () => void
  children?: ReactNode
  className?: string
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white border-transparent',
  brand:     'bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white border-transparent',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-border-default',
  ghost:     'bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-700 border-transparent',
  danger:    'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-transparent',
  dark:      'bg-sidebar hover:bg-brand-navy text-white border-transparent',
  outline:   'bg-transparent hover:bg-brand-tint text-brand-500 border border-brand-500 hover:border-brand-600',
  success:   'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white border-transparent',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-10 px-6 text-sm gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading
  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-semibold rounded-button',
        'transition-colors duration-150 whitespace-nowrap select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-1',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <span className="block w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="flex items-center shrink-0">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="flex items-center shrink-0">{icon}</span>
          )}
        </>
      )}
    </button>
  )
}
