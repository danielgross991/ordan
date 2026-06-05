export function safeRelativeRedirect(value: string | null | undefined, fallback = '/') {
  if (!value) return fallback
  if (!value.startsWith('/') || value.startsWith('//')) return fallback
  try {
    const parsed = new URL(value, 'https://ordan.local')
    if (parsed.origin !== 'https://ordan.local') return fallback
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallback
  }
}
