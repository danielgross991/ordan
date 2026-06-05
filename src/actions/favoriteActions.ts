'use server'

import { revalidatePath } from 'next/cache'
import { addFavorite, getFavoriteIds, removeFavorite } from '@/lib/db/favorites'
import { trackEvent } from '@/lib/db/events'
import { requireUserSession } from '@/lib/security/authGuards'
import { checkRateLimit, getRateLimitKey } from '@/lib/security/rateLimit'
import { idSchema } from '@/lib/validation/supplierSchemas'

export async function toggleFavoriteAction(supplierId: string): Promise<{
  success: boolean
  isFavorite?: boolean
  requiresLogin?: boolean
}> {
  let session
  try {
    session = await requireUserSession()
  } catch {
    return { success: false, requiresLogin: true }
  }

  const parsedId = idSchema.safeParse(supplierId)
  if (!parsedId.success) return { success: false }

  const userId = session.user.userId as string
  if (!checkRateLimit(getRateLimitKey('favorite', userId), 60, 60 * 1000)) return { success: false }

  try {
    const existing = await getFavoriteIds(userId)
    const alreadySaved = existing.includes(parsedId.data)

    if (alreadySaved) {
      await removeFavorite(userId, parsedId.data)
      await trackEvent({ supplierId: parsedId.data, userId, eventType: 'unsave' })
      revalidatePath('/my-suppliers')
      return { success: true, isFavorite: false }
    }

    await addFavorite(userId, parsedId.data)
    await trackEvent({ supplierId: parsedId.data, userId, eventType: 'save' })
    revalidatePath('/my-suppliers')
    return { success: true, isFavorite: true }
  } catch {
    console.error('[toggleFavoriteAction] failed')
    return { success: false }
  }
}

export async function getFavoriteIdsAction(): Promise<string[]> {
  try {
    const session = await requireUserSession()
    return getFavoriteIds(session.user.userId as string)
  } catch {
    return []
  }
}
