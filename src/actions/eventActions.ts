'use server'

import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth/options'
import { trackEvent, type EventType } from '@/lib/db/events'
import { checkRateLimit, getRateLimitKey } from '@/lib/security/rateLimit'
import { idSchema } from '@/lib/validation/supplierSchemas'

const eventTypeSchema = z.enum(['view', 'card_click', 'phone_click', 'wa_click', 'website_click', 'email_click', 'save', 'unsave'])

export async function trackSupplierEvent(supplierId: string, eventType: EventType) {
  const parsedId = idSchema.safeParse(supplierId)
  const parsedType = eventTypeSchema.safeParse(eventType)
  if (!parsedId.success || !parsedType.success) return

  const session = await getServerSession(authOptions)
  const userId = session?.user?.userId && !session.user.isAdmin ? session.user.userId : null
  const rateId = userId ?? parsedId.data
  if (!checkRateLimit(getRateLimitKey('event', rateId), 120, 60 * 1000)) return

  try {
    await trackEvent({ supplierId: parsedId.data, userId, eventType: parsedType.data })
  } catch {
    console.warn('[trackSupplierEvent] failed')
  }
}
