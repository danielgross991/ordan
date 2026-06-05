interface Bucket {
  count: number
  resetAt: number
}

const MAX_BUCKETS = 10_000
const buckets = new Map<string, Bucket>()

function evictExpired(now: number) {
  if (buckets.size < MAX_BUCKETS) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
  if (buckets.size < MAX_BUCKETS) return
  const overflow = buckets.size - Math.floor(MAX_BUCKETS * 0.8)
  const iter = buckets.keys()
  for (let i = 0; i < overflow; i++) {
    const k = iter.next().value
    if (k) buckets.delete(k)
  }
}

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  evictExpired(now)
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (current.count >= limit) return false
  current.count += 1
  return true
}

export function getRateLimitKey(scope: string, identifier: string | null | undefined) {
  return `${scope}:${identifier || 'anonymous'}`
}

/**
 * Extract a best-effort client IP from request headers.
 * Order: x-forwarded-for (first hop), x-real-ip, cf-connecting-ip.
 * Used only for rate-limiting buckets — never trusted for auth.
 */
export function getClientIp(headers: Headers | Record<string, string | string[] | undefined>): string {
  const get = (name: string): string | null => {
    if (headers instanceof Headers) return headers.get(name)
    const v = headers[name] ?? headers[name.toLowerCase()]
    if (Array.isArray(v)) return v[0] ?? null
    return v ?? null
  }
  const xff = get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  return get('x-real-ip') ?? get('cf-connecting-ip') ?? 'unknown'
}
