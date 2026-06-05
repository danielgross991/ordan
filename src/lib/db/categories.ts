import { v4 as uuidv4 } from 'uuid'
import { getSql } from './client'
import type { Category } from '@/lib/domain/category'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toCategory(row: any): Category {
  return {
    id: row.id,
    slug: row.slug,
    labelHe: row.label_he,
    description: row.description ?? null,
    icon: row.icon ?? null,
    parentId: row.parent_id ?? null,
    sortOrder: row.sort_order,
    active: row.active,
  }
}

export async function getActiveCategories(): Promise<Category[]> {
  const sql = getSql()
  if (!sql) return []
  const rows = await sql`SELECT * FROM categories WHERE active = true ORDER BY sort_order`
  return rows.map(toCategory)
}

export async function getAllCategoriesAdmin(): Promise<Category[]> {
  const sql = getSql()
  if (!sql) return []
  const rows = await sql`SELECT * FROM categories ORDER BY sort_order`
  return rows.map(toCategory)
}

export async function createCategory(input: Omit<Category, 'id'>): Promise<Category> {
  const sql = getSql()
  if (!sql) throw new Error('Database not configured')
  const id = uuidv4()
  await sql`
    INSERT INTO categories (id, slug, label_he, description, icon, parent_id, sort_order, active)
    VALUES (${id}, ${input.slug}, ${input.labelHe}, ${input.description ?? null},
            ${input.icon ?? null}, ${input.parentId ?? null}, ${input.sortOrder}, ${input.active})
  `
  return { ...input, id }
}

export async function updateCategory(id: string, updates: Partial<Omit<Category, 'id'>>): Promise<void> {
  const sql = getSql()
  if (!sql) return
  const rows = await sql`SELECT * FROM categories WHERE id = ${id} LIMIT 1`
  if (rows.length === 0) return
  const m = { ...toCategory(rows[0]), ...updates }
  await sql`
    UPDATE categories SET
      slug = ${m.slug},
      label_he = ${m.labelHe},
      description = ${m.description ?? null},
      icon = ${m.icon ?? null},
      parent_id = ${m.parentId ?? null},
      sort_order = ${m.sortOrder},
      active = ${m.active}
    WHERE id = ${id}
  `
}
