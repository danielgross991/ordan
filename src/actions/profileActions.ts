'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { requireUserSession } from '@/lib/security/authGuards'
import { isDbConfigured } from '@/lib/db/client'
import { upsertBuyerProfile, upsertSupplierProfile } from '@/lib/db/profiles'
import { markOnboardingComplete } from '@/lib/db/users'

const buyerSchema = z.object({
  businessName: z.string().trim().min(1, 'שם המסעדה נדרש').max(160),
  city: z.string().trim().max(120).optional().or(z.literal('')).transform(v => v || null),
  region: z.string().trim().max(120).optional().or(z.literal('')).transform(v => v || null),
  address: z.string().trim().max(400).optional().or(z.literal('')).transform(v => v || null),
  placeId: z.string().trim().max(200).optional().or(z.literal('')).transform(v => v || null),
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
})

const supplierSchema = z.object({
  businessName: z.string().trim().min(1, 'שם העסק נדרש').max(160),
  categories: z.array(z.string().trim().min(1).max(120)).min(1, 'בחר לפחות קטגוריה אחת').max(8),
})

type FormResult = { success: true } | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function saveBuyerProfileAction(input: z.infer<typeof buyerSchema>): Promise<FormResult> {
  const session = await requireUserSession()
  if (session.user.role !== 'buyer') return { success: false, error: 'תפקיד לא תואם' }
  if (!isDbConfigured()) return { success: false, error: 'מסד הנתונים לא מחובר' }

  const parsed = buyerSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'נתונים לא תקינים', fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    await upsertBuyerProfile({ userId: session.user.userId as string, ...parsed.data })
    await markOnboardingComplete(session.user.userId as string)
    revalidatePath('/')
    return { success: true }
  } catch {
    console.error('[saveBuyerProfileAction] failed')
    return { success: false, error: 'שגיאה בשמירת הפרופיל' }
  }
}

export async function saveSupplierProfileAction(input: z.infer<typeof supplierSchema>): Promise<FormResult> {
  const session = await requireUserSession()
  if (session.user.role !== 'supplier') return { success: false, error: 'תפקיד לא תואם' }
  if (!isDbConfigured()) return { success: false, error: 'מסד הנתונים לא מחובר' }

  const parsed = supplierSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'נתונים לא תקינים', fieldErrors: parsed.error.flatten().fieldErrors }
  }

  try {
    await upsertSupplierProfile({ userId: session.user.userId as string, ...parsed.data })
    await markOnboardingComplete(session.user.userId as string)
    revalidatePath('/')
    return { success: true }
  } catch {
    console.error('[saveSupplierProfileAction] failed')
    return { success: false, error: 'שגיאה בשמירת הפרופיל' }
  }
}

export async function skipProfileAction(): Promise<FormResult> {
  const session = await requireUserSession()
  try {
    await markOnboardingComplete(session.user.userId as string)
    revalidatePath('/')
    return { success: true }
  } catch {
    return { success: false, error: 'שגיאה' }
  }
}
