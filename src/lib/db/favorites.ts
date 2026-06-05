import { v4 as uuidv4 } from 'uuid'
import { getSql } from './client'
import type { SupplierCard } from '@/lib/domain/supplier'

export interface Favorite {
  id: string
  userId: string
  supplierId: string
  createdAt: Date
}

export async function getFavoriteIds(userId: string): Promise<string[]> {
  const sql = getSql()
  if (!sql) return []
  const rows = await sql`SELECT supplier_id FROM favorites WHERE user_id = ${userId}`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rows.map((r: any) => r.supplier_id as string)
}

export async function getFavoriteSuppliers(userId: string): Promise<SupplierCard[]> {
  const sql = getSql()
  if (!sql) return []
  const rows = await sql`
    SELECT s.id, s.slug, s.business_name, s.short_description, s.primary_category,
           s.supplier_type, s.business_fit, s.city, s.region, s.service_areas, s.logo_url,
           s.phone, s.whatsapp, s.featured, s.last_verified_at
    FROM favorites f
    JOIN suppliers s ON s.id = f.supplier_id
    WHERE f.user_id = ${userId}
      AND s.status = 'published'
    ORDER BY f.created_at DESC
  `
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rows.map((r: any) => ({
    id: r.id,
    slug: r.slug,
    businessName: r.business_name,
    shortDescription: r.short_description,
    primaryCategory: r.primary_category,
    supplierType: r.supplier_type ?? null,
    businessFit: r.business_fit ?? [],
    city: r.city ?? null,
    region: r.region ?? null,
    serviceAreas: r.service_areas ?? [],
    logoUrl: r.logo_url ?? null,
    phone: r.phone ?? null,
    whatsapp: r.whatsapp ?? null,
    featured: r.featured ?? false,
    lastVerifiedAt: r.last_verified_at ? new Date(r.last_verified_at) : null,
  }))
}

export async function addFavorite(userId: string, supplierId: string): Promise<void> {
  const sql = getSql()
  if (!sql) return
  const id = uuidv4()
  await sql`
    INSERT INTO favorites (id, user_id, supplier_id)
    VALUES (${id}, ${userId}, ${supplierId})
    ON CONFLICT (user_id, supplier_id) DO NOTHING
  `
}

export async function removeFavorite(userId: string, supplierId: string): Promise<void> {
  const sql = getSql()
  if (!sql) return
  await sql`DELETE FROM favorites WHERE user_id = ${userId} AND supplier_id = ${supplierId}`
}

export async function isFavorite(userId: string, supplierId: string): Promise<boolean> {
  const sql = getSql()
  if (!sql) return false
  const rows = await sql`
    SELECT 1 FROM favorites WHERE user_id = ${userId} AND supplier_id = ${supplierId} LIMIT 1
  `
  return rows.length > 0
}
