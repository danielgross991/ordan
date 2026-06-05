export type SupplierStatus = 'draft' | 'published' | 'hidden'

export type SupplierType =
  | 'יצרן'
  | 'יבואן'
  | 'סיטונאי'
  | 'מפיץ'
  | 'ספק שירות'
  | 'אחר'

export const SUPPLIER_TYPES: SupplierType[] = [
  'יצרן',
  'יבואן',
  'סיטונאי',
  'מפיץ',
  'ספק שירות',
  'אחר',
]

export const BUSINESS_FIT_OPTIONS = [
  'מסעדות',
  'בתי קפה',
  'בתי מלון',
  'קייטרינג',
  'מאפיות',
  'מטבחים מוסדיים',
  'בריאות ואשפוז',
  'אירועים',
  'בתי ספר וגני ילדים',
  'כל העסקים',
]

export interface Supplier {
  id: string
  slug: string
  businessName: string
  shortDescription: string
  fullDescription: string
  primaryCategory: string
  subcategories: string[]
  supplierType: SupplierType | null
  businessFit: string[]
  phone: string | null
  whatsapp: string | null
  email: string | null
  website: string | null
  address: string | null
  city: string | null
  region: string | null
  serviceAreas: string[]
  openingHours: string | null
  logoUrl: string | null
  coverImageUrl: string | null
  galleryUrls: string[]
  keywords: string[]
  status: SupplierStatus
  featured: boolean
  /** Admin override: make supplier publicly visible even if readiness check fails */
  forcePublish: boolean
  // Future-ready — not rendered in V1 public UI
  kashrut: string | null
  catalogEnabled: boolean
  catalogSummary: string | null
  // Internal / admin only — never exposed to public
  sourceType: string | null
  sourceUrl: string | null
  lastVerifiedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/** Lightweight projection for listing cards */
export type SupplierCard = Pick<
  Supplier,
  | 'id'
  | 'slug'
  | 'businessName'
  | 'shortDescription'
  | 'primaryCategory'
  | 'supplierType'
  | 'businessFit'
  | 'city'
  | 'region'
  | 'serviceAreas'
  | 'logoUrl'
  | 'featured'
  | 'phone'
  | 'whatsapp'
  | 'lastVerifiedAt'
>

/** All fields that must be filled for a supplier to appear publicly */
export const PUBLIC_REQUIRED_FIELDS: Readonly<Record<string, string>> = {
  businessName: 'שם עסק',
  primaryCategory: 'קטגוריה ראשית',
  shortDescription: 'תיאור קצר',
  fullDescription: 'תיאור מלא',
  supplierType: 'סוג ספק',
  businessFit: 'מתאים ל (לפחות 1)',
  phone: 'טלפון',
  whatsapp: 'WhatsApp',
  email: 'מייל',
  website: 'אתר אינטרנט',
  address: 'כתובת',
  city: 'עיר',
  region: 'אזור',
  serviceAreas: 'אזורי שירות (לפחות 1)',
  openingHours: 'שעות פעילות',
  logoUrl: 'לוגו',
  keywords: 'מילות מפתח (לפחות 1)',
  lastVerifiedAt: 'תאריך אימות אחרון',
}

export interface PublicReadiness {
  isReady: boolean
  score: number // 0–100
  missingFields: { key: string; label: string }[]
}

function isFieldFilled(val: unknown): boolean {
  if (val === null || val === undefined) return false
  if (typeof val === 'string') return val.trim().length > 0
  if (Array.isArray(val)) return val.length > 0
  if (val instanceof Date) return true
  return Boolean(val)
}

export function getPublicReadiness(supplier: Partial<Supplier>): PublicReadiness {
  const missingFields = Object.entries(PUBLIC_REQUIRED_FIELDS)
    .filter(([key]) => !isFieldFilled(supplier[key as keyof Supplier]))
    .map(([key, label]) => ({ key, label }))

  const total = Object.keys(PUBLIC_REQUIRED_FIELDS).length
  const score = Math.round(((total - missingFields.length) / total) * 100)

  return { isReady: missingFields.length === 0, score, missingFields }
}

/**
 * A supplier is publicly visible when published AND either:
 *  - passes the full quality gate (all required fields filled), OR
 *  - an admin has explicitly force-published it
 */
export function isPubliclyVisible(supplier: Partial<Supplier>): boolean {
  return !!(supplier.forcePublish || getPublicReadiness(supplier).isReady)
}

export interface SupplierFilters {
  query?: string
  category?: string
  region?: string
  supplierType?: string
  businessFit?: string
}

export interface CreateSupplierInput
  extends Omit<Supplier, 'id' | 'slug' | 'createdAt' | 'updatedAt'> {
  slug?: string
}

export type UpdateSupplierInput = Partial<Omit<Supplier, 'id' | 'createdAt'>>
