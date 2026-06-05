'use client'

import { signOut } from 'next-auth/react'

export function AdminSignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="text-blue-200 hover:text-white text-xs transition-colors"
    >
      יציאה
    </button>
  )
}
