'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { updateUserRole, markOnboardingComplete } from '@/lib/db/users'
import { requireUserSession } from '@/lib/security/authGuards'

const userRoleSchema = z.enum(['buyer', 'supplier'])

export async function selectRoleAction(role: 'buyer' | 'supplier') {
  const session = await requireUserSession()
  const parsed = userRoleSchema.safeParse(role)
  if (!parsed.success) return { success: false, error: 'תפקיד לא תקין' }

  try {
    await updateUserRole(session.user.userId as string, parsed.data)
    revalidatePath('/')
    return { success: true, role: parsed.data }
  } catch {
    console.error('[selectRoleAction] failed')
    return { success: false, error: 'שגיאה בעדכון הפרופיל' }
  }
}

export async function completeOnboardingAction() {
  const session = await requireUserSession()

  try {
    await markOnboardingComplete(session.user.userId as string)
    return { success: true }
  } catch {
    console.error('[completeOnboardingAction] failed')
    return { success: false }
  }
}
