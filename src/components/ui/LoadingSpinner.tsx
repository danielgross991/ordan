import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: string
}

const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'border-2 border-gray-200 border-t-[var(--brand)] rounded-full animate-spin',
          sizes[size]
        )}
      />
      {label && <p className="text-sm text-[var(--muted)]">{label}</p>}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <LoadingSpinner size="lg" label="טוען..." />
    </div>
  )
}
