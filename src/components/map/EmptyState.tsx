interface EmptyStateProps {
  title: string
  description?: string
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-light)] text-xl font-black text-[var(--brand)]">
        !
      </div>
      <h3 className="text-xl font-black text-[var(--foreground)]">{title}</h3>
      {description && <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>}
    </div>
  )
}
