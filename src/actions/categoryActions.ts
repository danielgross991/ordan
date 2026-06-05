'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createCategory, updateCategory } from '@/lib/db/categories'
import type { Category } from '@/lib/domain/category'
import { assertAdminSession } from '@/lib/security/authGuards'
import { idSchema } from '@/lib/validation/supplierSchemas'

const categorySchema = z
  .object({
    slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
    labelHe: z.string().trim().min(1).max(120),
    description: z.string().trim().max(500).nullable().optional(),
    icon: z.string().trim().max(20).nullable().optional(),
    parentId: z.string().trim().uuid().nullable().optional(),
    sortOrder: z.number().int().min(0).max(10000),
    active: z.boolean(),
  })
  .strict()

export async function createCategoryAction(input: Omit<Category, 'id'>): Promise<Category> {
  await assertAdminSession()
  const parsed = categorySchema.parse(input)
  const cat = await createCategory({
    ...parsed,
    description: parsed.description ?? null,
    icon: parsed.icon ?? null,
    parentId: parsed.parentId ?? null,
  })
  revalidatePath('/admin/categories')
  revalidatePath('/')
  return cat
}

export async function updateCategoryAction(id: string, updates: Partial<Omit<Category, 'id'>>): Promise<void> {
  await assertAdminSession()
  const parsedId = idSchema.parse(id)
  const parsedUpdates = categorySchema.partial().parse(updates)
  await updateCategory(parsedId, parsedUpdates as Partial<Omit<Category, 'id'>>)
  revalidatePath('/admin/categories')
  revalidatePath('/')
}
