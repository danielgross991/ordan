import { cn } from '@/lib/utils/cn'

type BadgeVariant = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'muted'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  brand: 'bg-[var(--brand)] text-white',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  muted: 'bg-gray-50 text-[var(--muted)]',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

/** Status badge for supplier status */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeVariant }> = {
    published: { label: 'פעיל', variant: 'success' },
    draft: { label: 'טיוטה', variant: 'warning' },
    hidden: { label: 'מוסתר', variant: 'danger' },
    new: { label: 'חדש', variant: 'brand' },
    reviewed: { label: 'נבדק', variant: 'default' },
    resolved: { label: 'טופל', variant: 'success' },
    dismissed: { label: 'נדחה', variant: 'muted' },
  }

  const { label, variant } = map[status] ?? { label: status, variant: 'default' as BadgeVariant }
  return <Badge variant={variant}>{label}</Badge>
}
