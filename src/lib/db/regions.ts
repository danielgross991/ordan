import { v4 as uuidv4 } from 'uuid'
import { getSql } from './client'
import type { Region } from '@/lib/domain/region'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRegion(row: any): Region {
  return {
    id: row.id,
    slug: row.slug,
    labelHe: row.label_he,
    sortOrder: row.sort_order,
    active: row.active,
  }
}

export async function getActiveRegions(): Promise<Region[]> {
  const sql = getSql()
  if (!sql) return []
  const rows = await sql`SELECT * FROM regions WHERE active = true ORDER BY sort_order`
  return rows.map(toRegion)
}

export async function getAllRegionsAdmin(): Promise<Region[]> {
  const sql = getSql()
  if (!sql) return []
  const rows = await sql`SELECT * FROM regions ORDER BY sort_order`
  return rows.map(toRegion)
}

export async function createRegion(input: Omit<Region, 'id'>): Promise<Region> {
  const sql = getSql()
  if (!sql) throw new Error('Database not configured')
  const id = uuidv4()
  await sql`
    INSERT INTO regions (id, slug, label_he, sort_order, active)
    VALUES (${id}, ${input.slug}, ${input.labelHe}, ${input.sortOrder}, ${input.active})
  `
  return { ...input, id }
}

export async function updateRegion(id: string, updates: Partial<Omit<Region, 'id'>>): Promise<void> {
  const sql = getSql()
  if (!sql) return
  const rows = await sql`SELECT * FROM regions WHERE id = ${id} LIMIT 1`
  if (rows.length === 0) return
  const m = { ...toRegion(rows[0]), ...updates }
  await sql`
    UPDATE regions SET
      slug = ${m.slug},
      label_he = ${m.labelHe},
      sort_order = ${m.sortOrder},
      active = ${m.active}
    WHERE id = ${id}
  `
}
