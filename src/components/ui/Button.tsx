import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] active:bg-[var(--brand-dark)]',
  secondary: 'bg-[var(--brand-light)] text-[var(--brand)] hover:bg-blue-100',
  ghost: 'bg-transparent text-[var(--foreground)] hover:bg-gray-100',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'bg-white border border-[var(--border)] text-[var(--foreground)] hover:bg-gray-50',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 sm:px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
