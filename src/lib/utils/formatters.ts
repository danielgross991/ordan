import { normalizeExternalUrl, normalizeMailto, normalizeTel, normalizeWhatsApp } from '@/lib/security/url'

/** Format an Israeli phone number for display */
export function formatPhone(phone: string | null): string {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

/** Build a validated tel: link */
export function telLink(phone: string | null): string | null {
  return normalizeTel(phone)
}

/** Build a validated WhatsApp link */
export function waLink(phone: string | null): string | null {
  return normalizeWhatsApp(phone)
}

/** Build a safe external website link */
export function websiteLink(url: string | null): string | null {
  return normalizeExternalUrl(url)
}

/** Build a validated mailto link */
export function mailtoLink(email: string | null): string | null {
  return normalizeMailto(email)
}

/** Format a date as dd/mm/yyyy */
export function formatDate(date: Date | null): string {
  if (!date) return ''
  return date.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/** Format ISO date string or Date to display */
export function formatDateStr(value: string | Date | null): string {
  if (!value) return ''
  const d = typeof value === 'string' ? new Date(value) : value
  return isNaN(d.getTime()) ? '' : formatDate(d)
}

/** Truncate text to max length with ellipsis */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max).trimEnd()}...`
}
