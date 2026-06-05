import Papa from 'papaparse'
import { z } from 'zod'
import { SUPPLIER_TYPES, type CreateSupplierInput, type SupplierStatus, type SupplierType } from '@/lib/domain/supplier'

/** Flexible header → field mapping */
const HEADER_MAP: Record<string, string> = {
  // English
  business_name: 'businessName',
  businessname: 'businessName',
  name: 'businessName',
  short_description: 'shortDescription',
  shortdescription: 'shortDescription',
  description: 'shortDescription',
  full_description: 'fullDescription',
  fulldescription: 'fullDescription',
  primary_category: 'primaryCategory',
  primarycategory: 'primaryCategory',
  category: 'primaryCategory',
  subcategories: 'subcategories',
  supplier_type: 'supplierType',
  suppliertype: 'supplierType',
  type: 'supplierType',
  business_fit: 'businessFit',
  businessfit: 'businessFit',
  phone: 'phone',
  whatsapp: 'whatsapp',
  email: 'email',
  website: 'website',
  address: 'address',
  city: 'city',
  region: 'region',
  service_areas: 'serviceAreas',
  serviceareas: 'serviceAreas',
  opening_hours: 'openingHours',
  openinghours: 'openingHours',
  logo_url: 'logoUrl',
  logourl: 'logoUrl',
  keywords: 'keywords',
  status: 'status',
  featured: 'featured',
  // Hebrew
  'שם עסק': 'businessName',
  'תיאור קצר': 'shortDescription',
  'תיאור מלא': 'fullDescription',
  'קטגוריה': 'primaryCategory',
  'סוג ספק': 'supplierType',
  'מתאים ל': 'businessFit',
  'טלפון': 'phone',
  'ווצאפ': 'whatsapp',
  'מייל': 'email',
  'אתר': 'website',
  'כתובת': 'address',
  'עיר': 'city',
  'אזור': 'region',
  'אזורי שירות': 'serviceAreas',
  'שעות פעילות': 'openingHours',
  'לוגו': 'logoUrl',
  'מילות מפתח': 'keywords',
  'סטטוס': 'status',
  'מוצג': 'featured',
}

function normalizeHeader(h: string): string {
  return HEADER_MAP[h.trim()] ?? HEADER_MAP[h.trim().toLowerCase()] ?? h.trim()
}

function parsePipeOrComma(val: string): string[] {
  if (!val) return []
  const sep = val.includes('|') ? '|' : ','
  return val.split(sep).map(s => s.trim()).filter(Boolean)
}

const rowSchema = z.object({
  businessName: z.string().min(1, 'שם עסק נדרש'),
  primaryCategory: z.string().min(1, 'קטגוריה נדרשת'),
  shortDescription: z.string().default(''),
  fullDescription: z.string().default(''),
  supplierType: z.string().default(''),
  businessFit: z.string().default(''),
  subcategories: z.string().default(''),
  phone: z.string().default(''),
  whatsapp: z.string().default(''),
  email: z.string().default(''),
  website: z.string().default(''),
  address: z.string().default(''),
  city: z.string().default(''),
  region: z.string().default(''),
  serviceAreas: z.string().default(''),
  openingHours: z.string().default(''),
  logoUrl: z.string().default(''),
  keywords: z.string().default(''),
  status: z.string().default('draft'),
  featured: z.string().default('false'),
  slug: z.string().default(''),
})

export interface CsvParseResult {
  rows: ParsedCsvRow[]
  totalRows: number
  validRows: number
  errorRows: number
}

export interface ParsedCsvRow {
  index: number
  data: CreateSupplierInput | null
  rawData: Record<string, string>
  errors: string[]
  status: 'valid' | 'warning' | 'error'
}

export function parseCsvText(csvText: string): CsvParseResult {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: normalizeHeader,
  })

  const rows: ParsedCsvRow[] = result.data.map((rawRow, i) => {
    const parsed = rowSchema.safeParse(rawRow)
    if (!parsed.success) {
      return {
        index: i,
        data: null,
        rawData: rawRow,
        errors: parsed.error.issues.map((e: { message: string }) => e.message),
        status: 'error' as const,
      }
    }

    const d = parsed.data
    const input: CreateSupplierInput = {
      slug: d.slug || undefined,
      businessName: d.businessName,
      shortDescription: d.shortDescription,
      fullDescription: d.fullDescription,
      primaryCategory: d.primaryCategory,
      subcategories: parsePipeOrComma(d.subcategories),
      supplierType: SUPPLIER_TYPES.includes(d.supplierType as SupplierType) ? (d.supplierType as SupplierType) : null,
      businessFit: parsePipeOrComma(d.businessFit),
      phone: d.phone || null,
      whatsapp: d.whatsapp || null,
      email: d.email || null,
      website: d.website || null,
      address: d.address || null,
      city: d.city || null,
      region: d.region || null,
      serviceAreas: parsePipeOrComma(d.serviceAreas),
      openingHours: d.openingHours || null,
      logoUrl: d.logoUrl || null,
      coverImageUrl: null,
      galleryUrls: [],
      keywords: parsePipeOrComma(d.keywords),
      status: (['draft', 'published', 'hidden'].includes(d.status) ? d.status : 'draft') as SupplierStatus,
      featured: ['true', '1', 'yes', 'כן'].includes(d.featured.toLowerCase()),
      kashrut: null,
      catalogEnabled: false,
      catalogSummary: null,
      sourceType: 'csv_import',
      sourceUrl: null,
      forcePublish: false,
      lastVerifiedAt: null,
    }

    const warnings: string[] = []
    if (!d.phone && !d.email && !d.website) warnings.push('אין פרטי קשר')
    if (!d.city && !d.region) warnings.push('אין מיקום')

    return {
      index: i,
      data: input,
      rawData: rawRow,
      errors: warnings,
      status: warnings.length > 0 ? ('warning' as const) : ('valid' as const),
    }
  })

  return {
    rows,
    totalRows: rows.length,
    validRows: rows.filter(r => r.status !== 'error').length,
    errorRows: rows.filter(r => r.status === 'error').length,
  }
}
