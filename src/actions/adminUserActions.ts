'use server'

import { revalidatePath } from 'next/cache'
import { assertAdminSession } from '@/lib/security/authGuards'
import { deleteUserById, resetUserOnboarding } from '@/lib/db/users'
import { idSchema } from '@/lib/validation/supplierSchemas'

export async function deleteUserAction(userId: string) {
  await assertAdminSession()
  const parsed = idSchema.safeParse(userId)
  if (!parsed.success) return { success: false, error: 'מזהה לא תקין' }

  try {
    await deleteUserById(parsed.data)
    revalidatePath('/admin/users')
    return { success: true }
  } catch {
    console.error('[deleteUserAction] failed')
    return { success: false, error: 'שגיאה במחיקה' }
  }
}

export async function resetUserOnboardingAction(userId: string) {
  await assertAdminSession()
  const parsed = idSchema.safeParse(userId)
  if (!parsed.success) return { success: false, error: 'מזהה לא תקין' }

  try {
    await resetUserOnboarding(parsed.data)
    revalidatePath('/admin/users')
    return { success: true }
  } catch {
    console.error('[resetUserOnboardingAction] failed')
    return { success: false, error: 'שגיאה באיפוס' }
  }
}
