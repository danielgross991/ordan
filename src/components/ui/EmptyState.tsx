interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: string
}

export function EmptyState({ title, description, action, icon = '🔍' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-sm text-[var(--muted)] max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  )
}
