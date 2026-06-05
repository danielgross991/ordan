'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createRegion, updateRegion } from '@/lib/db/regions'
import type { Region } from '@/lib/domain/region'
import { assertAdminSession } from '@/lib/security/authGuards'
import { idSchema } from '@/lib/validation/supplierSchemas'

const regionSchema = z
  .object({
    slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),
    labelHe: z.string().trim().min(1).max(120),
    sortOrder: z.number().int().min(0).max(10000),
    active: z.boolean(),
  })
  .strict()

export async function createRegionAction(input: Omit<Region, 'id'>): Promise<Region> {
  await assertAdminSession()
  const parsed = regionSchema.parse(input)
  const region = await createRegion(parsed)
  revalidatePath('/admin/regions')
  revalidatePath('/')
  return region
}

export async function updateRegionAction(id: string, updates: Partial<Omit<Region, 'id'>>): Promise<void> {
  await assertAdminSession()
  const parsedId = idSchema.parse(id)
  const parsedUpdates = regionSchema.partial().parse(updates)
  await updateRegion(parsedId, parsedUpdates)
  revalidatePath('/admin/regions')
  revalidatePath('/')
}
