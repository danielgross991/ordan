'use server'

import { revalidatePath } from 'next/cache'
import { createSupplier, updateSupplier, updateSupplierStatus } from '@/lib/db/suppliers'
import { isDbConfigured } from '@/lib/db/client'
import type { CreateSupplierInput, SupplierStatus, UpdateSupplierInput } from '@/lib/domain/supplier'
import { requireAdminSession } from '@/lib/security/authGuards'
import { idSchema, supplierInputSchema, supplierStatusSchema, supplierUpdateSchema } from '@/lib/validation/supplierSchemas'

export async function createSupplierAction(input: CreateSupplierInput) {
  await requireAdminSession()
  if (!isDbConfigured()) return { success: false, error: 'מסד הנתונים לא מחובר' }

  try {
    const parsed = supplierInputSchema.safeParse(input)
    if (!parsed.success) return { success: false, error: 'נתוני הספק אינם תקינים' }

    const supplier = await createSupplier({
      ...parsed.data,
      sourceType: parsed.data.sourceType ?? 'manual',
    } as CreateSupplierInput)

    revalidatePath('/admin/suppliers')
    revalidatePath('/suppliers')
    revalidatePath('/')
    return { success: true, id: supplier.id, slug: supplier.slug }
  } catch {
    console.error('[createSupplierAction] failed')
    return { success: false, error: 'שגיאה ביצירת הספק' }
  }
}

export async function updateSupplierAction(id: string, updates: UpdateSupplierInput) {
  await requireAdminSession()
  if (!isDbConfigured()) return { success: false, error: 'מסד הנתונים לא מחובר' }

  try {
    const parsedId = idSchema.safeParse(id)
    const parsedUpdates = supplierUpdateSchema.safeParse(updates)
    if (!parsedId.success || !parsedUpdates.success) return { success: false, error: 'נתוני הספק אינם תקינים' }

    const updated = await updateSupplier(parsedId.data, parsedUpdates.data as UpdateSupplierInput)
    if (!updated) return { success: false, error: 'הספק לא נמצא' }

    revalidatePath('/admin/suppliers')
    revalidatePath(`/admin/suppliers/${parsedId.data}`)
    revalidatePath(`/suppliers/${updated.slug}`)
    revalidatePath('/suppliers')
    return { success: true }
  } catch {
    console.error('[updateSupplierAction] failed')
    return { success: false, error: 'שגיאה בעדכון הספק' }
  }
}

export async function updateSupplierStatusAction(id: string, status: SupplierStatus) {
  await requireAdminSession()
  if (!isDbConfigured()) return { success: false, error: 'מסד הנתונים לא מחובר' }

  try {
    const parsedId = idSchema.safeParse(id)
    const parsedStatus = supplierStatusSchema.safeParse(status)
    if (!parsedId.success || !parsedStatus.success) return { success: false, error: 'נתונים לא תקינים' }

    await updateSupplierStatus(parsedId.data, parsedStatus.data)
    revalidatePath('/admin/suppliers')
    revalidatePath('/suppliers')
    return { success: true }
  } catch {
    console.error('[updateSupplierStatusAction] failed')
    return { success: false, error: 'שגיאה בעדכון סטטוס' }
  }
}
