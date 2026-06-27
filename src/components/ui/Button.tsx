'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'brand' | 'secondary' | 'ghost' | 'danger' | 'dark'
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
  primary:   'bg-[#111827] hover:bg-[#1F2937] active:bg-[#374151] text-white border-transparent',
  brand:     'bg-brand-500 hover:bg-brand-600 text-white border-transparent',
  secondary: 'bg-white hover:bg-[#F9FAFB] text-[#374151] border border-[#E2E8F0]',
  ghost:     'bg-transparent hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#374151] border-transparent',
  danger:    'bg-[#EF4444] hover:bg-[#DC2626] text-white border-transparent',
  dark:      'bg-sidebar hover:bg-neutral-800 text-white border-transparent',
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
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
      {...rest}
    >
      {loading ? (
        <span
          className="animate-spin"
          style={{
            width: 14, height: 14, borderRadius: '50%',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            display: 'block',
          }}
        />
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
