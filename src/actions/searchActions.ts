'use server'

import { z } from 'zod'
import { getSql } from '@/lib/db/client'

const querySchema = z.string().trim().min(1).max(80)

export interface SearchSuggestions {
  suppliers: { id: string; slug: string; name: string; category: string }[]
  categories: { slug: string; label: string }[]
  regions: { slug: string; label: string }[]
}

export async function searchSuggestionsAction(query: string): Promise<SearchSuggestions> {
  const parsed = querySchema.safeParse(query)
  if (!parsed.success) return { suppliers: [], categories: [], regions: [] }
  const q = parsed.data
  const sql = getSql()
  if (!sql) return { suppliers: [], categories: [], regions: [] }

  const like = `%${q}%`
  try {
    const [suppliers, categories, regions] = await Promise.all([
      sql`
        SELECT id, slug, business_name, primary_category
        FROM suppliers
        WHERE status = 'published'
          AND (business_name ILIKE ${like} OR primary_category ILIKE ${like})
        ORDER BY featured DESC, business_name ASC
        LIMIT 5
      `,
      sql`
        SELECT slug, label_he
        FROM categories
        WHERE active = true AND label_he ILIKE ${like}
        ORDER BY sort_order
        LIMIT 5
      `,
      sql`
        SELECT slug, label_he
        FROM regions
        WHERE active = true AND label_he ILIKE ${like}
        ORDER BY sort_order
        LIMIT 5
      `,
    ])

    return {
      suppliers: suppliers.map(r => ({
        id: r.id as string,
        slug: r.slug as string,
        name: r.business_name as string,
        category: (r.primary_category ?? '') as string,
      })),
      categories: categories.map(r => ({ slug: r.slug as string, label: r.label_he as string })),
      regions: regions.map(r => ({ slug: r.slug as string, label: r.label_he as string })),
    }
  } catch {
    return { suppliers: [], categories: [], regions: [] }
  }
}
