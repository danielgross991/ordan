import { getSql } from './client'

export interface BuyerProfile {
  userId: string
  businessName: string | null
  city: string | null
  region: string | null
  address: string | null
  placeId: string | null
  lat: number | null
  lng: number | null
}

export interface SupplierProfile {
  userId: string
  businessName: string | null
  categories: string[]
  linkedSupplierId: string | null
  linkedAt: Date | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBuyer(row: any): BuyerProfile {
  return {
    userId: row.user_id,
    businessName: row.business_name ?? null,
    city: row.city ?? null,
    region: row.region ?? null,
    address: row.address ?? null,
    placeId: row.place_id ?? null,
    lat: row.lat !== null && row.lat !== undefined ? Number(row.lat) : null,
    lng: row.lng !== null && row.lng !== undefined ? Number(row.lng) : null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSupplier(row: any): SupplierProfile {
  return {
    userId: row.user_id,
    businessName: row.business_name ?? null,
    categories: row.categories ?? [],
    linkedSupplierId: row.linked_supplier_id ?? null,
    linkedAt: row.linked_at ? new Date(row.linked_at) : null,
  }
}

export async function getBuyerProfile(userId: string): Promise<BuyerProfile | null> {
  const sql = getSql()
  if (!sql) return null
  const rows = await sql`SELECT * FROM buyer_profiles WHERE user_id = ${userId} LIMIT 1`
  return rows[0] ? toBuyer(rows[0]) : null
}

export async function upsertBuyerProfile(input: {
  userId: string
  businessName: string
  city?: string | null
  region?: string | null
  address?: string | null
  placeId?: string | null
  lat?: number | null
  lng?: number | null
}): Promise<BuyerProfile> {
  const sql = getSql()
  if (!sql) throw new Error('Database not configured')
  const rows = await sql`
    INSERT INTO buyer_profiles (
      user_id, business_name, city, region, address, place_id, lat, lng, updated_at
    ) VALUES (
      ${input.userId}, ${input.businessName}, ${input.city ?? null}, ${input.region ?? null},
      ${input.address ?? null}, ${input.placeId ?? null}, ${input.lat ?? null}, ${input.lng ?? null}, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      business_name = EXCLUDED.business_name,
      city          = EXCLUDED.city,
      region        = EXCLUDED.region,
      address       = EXCLUDED.address,
      place_id      = EXCLUDED.place_id,
      lat           = EXCLUDED.lat,
      lng           = EXCLUDED.lng,
      updated_at    = NOW()
    RETURNING *
  `
  return toBuyer(rows[0])
}

export async function getSupplierProfile(userId: string): Promise<SupplierProfile | null> {
  const sql = getSql()
  if (!sql) return null
  const rows = await sql`SELECT * FROM supplier_profiles WHERE user_id = ${userId} LIMIT 1`
  return rows[0] ? toSupplier(rows[0]) : null
}

export async function upsertSupplierProfile(input: {
  userId: string
  businessName: string
  categories: string[]
}): Promise<SupplierProfile> {
  const sql = getSql()
  if (!sql) throw new Error('Database not configured')
  const rows = await sql`
    INSERT INTO supplier_profiles (user_id, business_name, categories, updated_at)
    VALUES (${input.userId}, ${input.businessName}, ${input.categories}, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      business_name = EXCLUDED.business_name,
      categories    = EXCLUDED.categories,
      updated_at    = NOW()
    RETURNING *
  `
  return toSupplier(rows[0])
}
