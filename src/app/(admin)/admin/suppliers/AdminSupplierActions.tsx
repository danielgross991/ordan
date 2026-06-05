'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { updateSupplierStatusAction } from '@/actions/supplierActions'
import type { SupplierStatus } from '@/lib/domain/supplier'

interface Props {
  id: string
  status: SupplierStatus
}

export function AdminSupplierActions({ id, status }: Props) {
  const [isPending, startTransition] = useTransition()

  const setStatus = (newStatus: SupplierStatus) => {
    startTransition(async () => {
      await updateSupplierStatusAction(id, newStatus)
    })
  }

  return (
    <div className="flex items-center justify-end gap-1 flex-wrap">
      <Link
        href={`/admin/suppliers/${id}`}
        className="px-2.5 py-1 text-xs font-medium bg-[var(--brand-light)] text-[var(--brand)] rounded-lg hover:bg-[var(--brand)] hover:text-white transition-colors"
      >
        עריכה
      </Link>
      {status !== 'published' && (
        <button
          onClick={() => setStatus('published')}
          disabled={isPending}
          className="px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50"
        >
          פרסם
        </button>
      )}
      {status === 'published' && (
        <button
          onClick={() => setStatus('hidden')}
          disabled={isPending}
          className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          הסתר
        </button>
      )}
    </div>
  )
}
