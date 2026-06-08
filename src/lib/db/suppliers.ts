import { v4 as uuidv4 } from 'uuid'
import { getSql } from './client'
import { generateSlug } from '@/lib/utils/slugify'
import {
  type Supplier,
  type SupplierCard,
  type SupplierFilters,
  type CreateSupplierInput,
  type SupplierType,
  type SupplierStatus,
  isPubliclyVisible,
} from '@/lib/domain/supplier'
import { slugSchema } from '@/lib/validation/supplierSchemas'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSupplier(row: any): Supplier {
  return {
    id: row.id,
    slug: row.slug,
    businessName: row.business_name,
    shortDescription: row.short_description ?? '',
    fullDescription: row.full_description ?? '',
    primaryCategory: row.primary_category ?? '',
    subcategories: row.subcategories ?? [],
    supplierType: (row.supplier_type ?? null) as SupplierType | null,
    businessFit: row.business_fit ?? [],
    phone: row.phone ?? null,
    whatsapp: row.whatsapp ?? null,
    email: row.email ?? null,
    website: row.website ?? null,
    address: row.address ?? null,
    city: row.city ?? null,
    region: row.region ?? null,
    serviceAreas: row.service_areas ?? [],
    openingHours: row.opening_hours ?? null,
    logoUrl: row.logo_url ?? null,
    coverImageUrl: row.cover_image_url ?? null,
    galleryUrls: row.gallery_urls ?? [],
    keywords: row.keywords ?? [],
    status: (row.status ?? 'draft') as SupplierStatus,
    featured: row.featured ?? false,
    forcePublish: row.force_publish ?? false,
    kashrut: row.kashrut ?? null,
    catalogEnabled: row.catalog_enabled ?? false,
    catalogSummary: row.catalog_summary ?? null,
    sourceType: row.source_type ?? null,
    sourceUrl: row.source_url ?? null,
    lastVerifiedAt: row.last_verified_at ? new Date(row.last_verified_at) : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

function toCard(s: Supplier): SupplierCard {
  return {
    id: s.id,
    slug: s.slug,
    businessName: s.businessName,
    shortDescription: s.shortDescription,
    primaryCategory: s.primaryCategory,
    supplierType: s.supplierType,
    businessFit: s.businessFit,
    city: s.city,
    region: s.region,
    serviceAreas: s.serviceAreas,
    logoUrl: s.logoUrl,
    featured: s.featured,
    phone: s.phone,
    whatsapp: s.whatsapp,
    lastVerifiedAt: s.lastVerifiedAt,
  }
}

function matchesFilters(s: Supplier, filters: SupplierFilters): boolean {
  if (filters.category && s.primaryCategory !== filters.category && !s.subcategories.includes(filters.category)) {
    return false
  }
  if (filters.region && s.region !== filters.region && !s.serviceAreas.includes(filters.region)) {
    return false
  }
  if (filters.supplierType && s.supplierType !== filters.supplierType) return false
  if (filters.businessFit && !s.businessFit.includes(filters.businessFit)) return false
  if (filters.query) {
    const q = filters.query.toLowerCase().slice(0, 120)
    const searchable = [
      s.businessName, s.shortDescription, s.fullDescription,
      s.primaryCategory, ...s.subcategories, ...s.keywords,
      s.city ?? '', s.region ?? '', ...s.serviceAreas,
    ].join(' ').toLowerCase()
    if (!searchable.includes(q)) return false
  }
  return true
}

/** Get published suppliers for public listing, with optional filters */
export async function getPublishedSuppliers(filters?: SupplierFilters): Promise<SupplierCard[]> {
  const sql = getSql()
  if (!sql) return []
  const rows = await sql`
    SELECT * FROM suppliers
    WHERE status = 'published'
    ORDER BY featured DESC, business_name ASC
  `
  const suppliers = rows.map(toSupplier)
  const filtered = (filters ? suppliers.filter(s => matchesFilters(s, filters)) : suppliers)
    .filter(isPubliclyVisible)
    .slice(0, 100)
  return filtered.map(toCard)
}

/** Get a single published supplier by slug */
export async function getSupplierBySlug(rawSlug: string): Promise<Supplier | null> {
  const sql = getSql()
  if (!sql) return null
  let slug = ''
  try {
    slug = decodeURIComponent(rawSlug).trim()
  } catch {
    return null
  }
  const parsedSlug = slugSchema.safeParse(slug)
  if (!parsedSlug.success) return null
  const rows = await sql`
    SELECT * FROM suppliers WHERE slug = ${parsedSlug.data} AND status = 'published' LIMIT 1
  `
  if (rows.length === 0) return null
  const supplier = toSupplier(rows[0])
  if (!isPubliclyVisible(supplier)) return null
  // Strip internal-only provenance fields. This object is rendered on the public
  // detail page and passed to Client Components (e.g. SupplierContactButtons), so
  // every field on it is serialized into the public RSC/HTML payload. source_type
  // and source_url must never reach the browser.
  return { ...supplier, sourceType: null, sourceUrl: null }
}

/** Admin: get all suppliers regardless of status */
export async function getAllSuppliersAdmin(): Promise<Supplier[]> {
  const sql = getSql()
  if (!sql) return []
  const rows = await sql`SELECT * FROM suppliers ORDER BY created_at DESC`
  return rows.map(toSupplier)
}

/** Admin: get supplier by ID */
export async function getSupplierByIdAdmin(id: string): Promise<Supplier | null> {
  const sql = getSql()
  if (!sql) return null
  const rows = await sql`SELECT * FROM suppliers WHERE id = ${id} LIMIT 1`
  return rows.length > 0 ? toSupplier(rows[0]) : null
}

/** Admin: create a new supplier */
export async function createSupplier(input: CreateSupplierInput): Promise<Supplier> {
  const sql = getSql()
  if (!sql) throw new Error('Database not configured')
  const now = new Date()
  const id = uuidv4()
  const slug = input.slug || generateSlug(input.businessName, id)

  await sql`
    INSERT INTO suppliers (
      id, slug, business_name, short_description, full_description,
      primary_category, subcategories, supplier_type, business_fit,
      phone, whatsapp, email, website, address, city, region,
      service_areas, opening_hours, logo_url, cover_image_url,
      gallery_urls, keywords, status, featured, force_publish, kashrut,
      catalog_enabled, catalog_summary, source_type, source_url,
      last_verified_at, created_at, updated_at
    ) VALUES (
      ${id}, ${slug}, ${input.businessName}, ${input.shortDescription}, ${input.fullDescription},
      ${input.primaryCategory}, ${input.subcategories}, ${input.supplierType ?? null}, ${input.businessFit},
      ${input.phone ?? null}, ${input.whatsapp ?? null}, ${input.email ?? null}, ${input.website ?? null},
      ${input.address ?? null}, ${input.city ?? null}, ${input.region ?? null},
      ${input.serviceAreas}, ${input.openingHours ?? null}, ${input.logoUrl ?? null}, ${input.coverImageUrl ?? null},
      ${input.galleryUrls}, ${input.keywords}, ${input.status}, ${input.featured}, ${input.forcePublish ?? false}, ${input.kashrut ?? null},
      ${input.catalogEnabled}, ${input.catalogSummary ?? null}, ${input.sourceType ?? null}, ${input.sourceUrl ?? null},
      ${input.lastVerifiedAt?.toISOString() ?? null}, ${now.toISOString()}, ${now.toISOString()}
    )
  `
  return { ...input, id, slug, createdAt: now, updatedAt: now }
}

/** Admin: update a supplier (full replace) */
export async function updateSupplier(
  id: string,
  updates: Partial<Omit<Supplier, 'id' | 'createdAt'>>
): Promise<Supplier | null> {
  const sql = getSql()
  if (!sql) return null
  const existing = await getSupplierByIdAdmin(id)
  if (!existing) return null
  const m = { ...existing, ...updates }
  const now = new Date()

  await sql`
    UPDATE suppliers SET
      slug = ${m.slug},
      business_name = ${m.businessName},
      short_description = ${m.shortDescription},
      full_description = ${m.fullDescription},
      primary_category = ${m.primaryCategory},
      subcategories = ${m.subcategories},
      supplier_type = ${m.supplierType ?? null},
      business_fit = ${m.businessFit},
      phone = ${m.phone ?? null},
      whatsapp = ${m.whatsapp ?? null},
      email = ${m.email ?? null},
      website = ${m.website ?? null},
      address = ${m.address ?? null},
      city = ${m.city ?? null},
      region = ${m.region ?? null},
      service_areas = ${m.serviceAreas},
      opening_hours = ${m.openingHours ?? null},
      logo_url = ${m.logoUrl ?? null},
      cover_image_url = ${m.coverImageUrl ?? null},
      gallery_urls = ${m.galleryUrls},
      keywords = ${m.keywords},
      status = ${m.status},
      featured = ${m.featured},
      force_publish = ${m.forcePublish},
      kashrut = ${m.kashrut ?? null},
      catalog_enabled = ${m.catalogEnabled},
      catalog_summary = ${m.catalogSummary ?? null},
      source_type = ${m.sourceType ?? null},
      source_url = ${m.sourceUrl ?? null},
      last_verified_at = ${m.lastVerifiedAt?.toISOString() ?? null},
      updated_at = ${now.toISOString()}
    WHERE id = ${id}
  `
  return { ...m, id, createdAt: existing.createdAt, updatedAt: now }
}

/** Admin: update just the status of a supplier */
export async function updateSupplierStatus(id: string, status: Supplier['status']): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`UPDATE suppliers SET status = ${status}, updated_at = NOW() WHERE id = ${id}`
}

export interface BulkImportResult {
  created: number
  errors: number
  errorDetails: { businessName: string; message: string }[]
}

/** Admin: bulk insert suppliers (for CSV import) */
export async function bulkCreateSuppliers(inputs: CreateSupplierInput[]): Promise<BulkImportResult> {
  let created = 0
  let errors = 0
  const errorDetails: { businessName: string; message: string }[] = []

  for (const input of inputs) {
    try {
      await createSupplier(input)
      created++
    } catch (err) {
      errors++
      errorDetails.push({
        businessName: input.businessName,
        message: err instanceof Error ? err.message : 'שגיאה לא ידועה',
      })
      console.error(`[bulkCreateSuppliers] Failed for "${input.businessName}":`, err)
    }
  }
  return { created, errors, errorDetails }
}
