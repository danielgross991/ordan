const SAFE_EXTERNAL_PROTOCOLS = new Set(['http:', 'https:'])

export function normalizeExternalUrl(raw: string | null | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed || /[\u0000-\u001F\u007F]/.test(trimmed)) return null

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(candidate)
    if (!SAFE_EXTERNAL_PROTOCOLS.has(url.protocol)) return null
    if (!url.hostname || url.username || url.password) return null
    return url.toString()
  } catch {
    return null
  }
}

export function normalizeImageUrl(raw: string | null | undefined): string | null {
  const url = normalizeExternalUrl(raw)
  if (!url) return null
  const parsed = new URL(url)
  if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost') return null
  return parsed.toString()
}

export function normalizeMailto(email: string | null | undefined): string | null {
  if (!email) return null
  const trimmed = email.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null
  return `mailto:${encodeURIComponent(trimmed)}`
}

export function normalizeTel(phone: string | null | undefined): string | null {
  if (!phone) return null
  const cleaned = phone.replace(/[^\d+]/g, '')
  if (!/^\+?\d{7,15}$/.test(cleaned)) return null
  return `tel:${cleaned}`
}

export function normalizeWhatsApp(phone: string | null | undefined): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (!/^\d{7,15}$/.test(digits)) return null
  const intl = digits.startsWith('0') ? `972${digits.slice(1)}` : digits
  if (!/^\d{7,15}$/.test(intl)) return null
  return `https://wa.me/${intl}`
}
