import * as cheerio from 'cheerio'
import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'
import { normalizeExternalUrl } from '@/lib/security/url'

export interface ExtractedFields {
  businessName?: string
  shortDescription?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  city?: string
  logoUrl?: string
  keywords?: string[]
  categoryHints?: string[]
  extractionNotes: string[]
  extractionError?: string
}

const PHONE_REGEX = /(?:\+972|972|0)(?:[-\s]?\d){8,9}/g
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g
const IL_CITIES = [
  'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'נתניה', 'ראשון לציון',
  'פתח תקווה', 'אשדוד', 'רמת גן', 'בני ברק', 'הרצליה', 'חולון',
  'בת ים', 'רחובות', 'אשקלון', 'רמלה', 'לוד', 'נס ציונה', 'מודיעין',
  'כפר סבא', 'רעננה', 'הוד השרון', 'גבעתיים', 'קריית גת', 'עכו',
  'נהריה', 'חדרה', 'טבריה', 'צפת', 'קריית ים', 'קריית אתא',
  'קריית ביאליק', 'קריית מוצקין', 'אילת', 'אריאל', 'מעלה אדומים',
]

const MAX_HTML_BYTES = 1_000_000
const BLOCKED_HOSTS = new Set(['localhost', '0.0.0.0'])

function isPrivateAddress(address: string): boolean {
  if (address === '127.0.0.1' || address === '::1') return true
  if (address.startsWith('10.') || address.startsWith('192.168.')) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(address)) return true
  if (address.startsWith('169.254.')) return true
  if (address.startsWith('fc') || address.startsWith('fd') || address.startsWith('fe80')) return true
  return false
}

async function assertPublicHttpUrl(rawUrl: string): Promise<string> {
  const normalized = normalizeExternalUrl(rawUrl)
  if (!normalized) throw new Error('כתובת URL לא תקינה')

  const url = new URL(normalized)
  const hostname = url.hostname.toLowerCase()
  if (BLOCKED_HOSTS.has(hostname) || hostname.endsWith('.local')) throw new Error('לא ניתן לייבא מכתובת פנימית')

  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new Error('לא ניתן לייבא מכתובת פנימית')
    return normalized
  }

  const addresses = await lookup(hostname, { all: true, verbatim: true })
  if (addresses.some(item => isPrivateAddress(item.address))) throw new Error('לא ניתן לייבא מכתובת פנימית')
  return normalized
}

async function readLimitedResponse(res: Response): Promise<string> {
  const reader = res.body?.getReader()
  if (!reader) return res.text()

  const chunks: Uint8Array[] = []
  let received = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (!value) continue
    received += value.byteLength
    if (received > MAX_HTML_BYTES) throw new Error('הדף גדול מדי לייבוא בטוח')
    chunks.push(value)
  }

  return new TextDecoder().decode(Buffer.concat(chunks))
}

function extractPhones(text: string): string[] {
  const matches = text.match(PHONE_REGEX) ?? []
  return [...new Set(matches.map(p => p.replace(/[-\s]/g, '')))]
}

function extractEmails(text: string): string[] {
  const matches = text.match(EMAIL_REGEX) ?? []
  return [...new Set(matches)]
}

function detectCity(text: string): string | undefined {
  for (const city of IL_CITIES) {
    if (text.includes(city)) return city
  }
  return undefined
}

export async function extractFromUrl(url: string): Promise<ExtractedFields> {
  const notes: string[] = []
  let html = ''

  try {
    const safeUrl = await assertPublicHttpUrl(url)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch(safeUrl, {
      signal: controller.signal,
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OrdanBot/1.0; +https://ordan.co.il)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'he,en-US;q=0.9',
      },
    })
    clearTimeout(timeout)

    if (res.status >= 300 && res.status < 400) {
      return {
        extractionNotes: [],
        extractionError: 'האתר מפנה לכתובת אחרת. מטעמי אבטחה יש להזין את הכתובת הסופית ישירות.',
      }
    }

    if (!res.ok) {
      return {
        extractionNotes: [],
        extractionError: `שגיאת HTTP ${res.status}: ${res.statusText}`,
      }
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('html')) {
      return {
        extractionNotes: [],
        extractionError: 'הדף אינו HTML — לא ניתן לחלץ נתונים',
      }
    }

    html = await readLimitedResponse(res)
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return { extractionNotes: [], extractionError: 'הדף לא הגיב בזמן (timeout)' }
    }
    return { extractionNotes: [], extractionError: err instanceof Error ? err.message : 'שגיאת רשת' }
  }

  const $ = cheerio.load(html)
  const result: ExtractedFields = { extractionNotes: notes }

  // 1. JSON-LD structured data
  const jsonLdScripts = $('script[type="application/ld+json"]')
  jsonLdScripts.each((_, el) => {
    try {
      const data = JSON.parse($(el).html() ?? '{}')
      const items = Array.isArray(data) ? data : [data]
      for (const item of items) {
        if (item.name && !result.businessName) {
          result.businessName = item.name
          notes.push('שם עסק חולץ מ-JSON-LD')
        }
        if (item.description && !result.shortDescription) {
          result.shortDescription = item.description
        }
        if (item.telephone && !result.phone) {
          result.phone = item.telephone
          notes.push('טלפון חולץ מ-JSON-LD')
        }
        if (item.email && !result.email) {
          result.email = item.email
        }
        if (item.url && !result.website) {
          result.website = item.url
        }
        if (item.address) {
          const addr = typeof item.address === 'string'
            ? item.address
            : [item.address.streetAddress, item.address.addressLocality].filter(Boolean).join(', ')
          if (addr && !result.address) result.address = addr
          if (item.address.addressLocality && !result.city) result.city = item.address.addressLocality
        }
        if (item.image && !result.logoUrl) {
          result.logoUrl = typeof item.image === 'string' ? item.image : item.image?.url
        }
      }
    } catch {}
  })

  // 2. Open Graph / meta tags
  const ogTitle = $('meta[property="og:title"]').attr('content')
  const ogDesc = $('meta[property="og:description"]').attr('content')
  const ogImage = $('meta[property="og:image"]').attr('content')
  const metaDesc = $('meta[name="description"]').attr('content')
  const pageTitle = $('title').text()

  if (ogTitle && !result.businessName) {
    result.businessName = ogTitle
    notes.push('שם עסק חולץ מ-og:title')
  } else if (pageTitle && !result.businessName) {
    result.businessName = pageTitle.split('|')[0].split('-')[0].trim()
    notes.push('שם עסק חולץ מכותרת הדף')
  }

  if ((ogDesc || metaDesc) && !result.shortDescription) {
    result.shortDescription = ogDesc ?? metaDesc ?? undefined
    notes.push('תיאור חולץ מ-meta')
  }

  if (ogImage && !result.logoUrl) {
    result.logoUrl = ogImage
  }

  // 3. Heuristic extraction from full page text
  const bodyText = $('body').text()

  if (!result.phone) {
    const phones = extractPhones(bodyText)
    if (phones.length > 0) {
      result.phone = phones[0]
      notes.push('טלפון זוהה בטקסט הדף')
    }
  }

  if (!result.email) {
    const emails = extractEmails(bodyText)
    const filtered = emails.filter(e => !e.includes('example') && !e.includes('sentry'))
    if (filtered.length > 0) {
      result.email = filtered[0]
      notes.push('מייל זוהה בטקסט הדף')
    }
  }

  if (!result.city) {
    const city = detectCity(bodyText)
    if (city) {
      result.city = city
      notes.push(`עיר זוהתה: ${city}`)
    }
  }

  // Clean up
  if (!result.website) result.website = url

  if (notes.length === 0) notes.push('לא ניתן לחלץ נתונים מובנים — בדוק ידנית')

  return result
}
