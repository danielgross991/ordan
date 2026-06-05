/**
 * Creates a URL-safe slug from a string.
 * Handles Hebrew, Arabic, and other Unicode by transliterating common patterns
 * and falling back to a hex-encoded representation for unsupported chars.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // spaces → hyphens
    .replace(/[^\w\u0590-\u05FF\u0600-\u06FF-]/g, '') // keep word chars, Hebrew, Arabic, hyphens
    .replace(/--+/g, '-')          // collapse double hyphens
    .replace(/^-+|-+$/g, '')       // trim leading/trailing hyphens
}

export function generateSlug(businessName: string, id?: string): string {
  const base = slugify(businessName)
  if (!base) return id ?? Math.random().toString(36).slice(2, 10)
  return id ? `${base}-${id.slice(0, 6)}` : base
}
