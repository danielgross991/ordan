import Link from 'next/link'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { isDbConfigured } from '@/lib/db/client'
import { AdminSignOutButton } from './AdminSignOutButton'
import { AdminMobileNav } from './AdminMobileNav'
import { AdminSidebar } from './AdminSidebar'
import { OrdanLogo } from '@/components/public/OrdanLogo'

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  // Login page lives inside this layout segment but must not show admin chrome.
  // Middleware already redirects unauthenticated users away from all /admin/* except /admin/login,
  // so when there is no session here we are on the login page - render children only.
  if (!session?.user?.isAdmin) {
    return <div className="min-h-screen bg-[var(--background)]" dir="rtl">{children}</div>
  }

  const dbMissing = !isDbConfigured()

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col" dir="rtl">
      {dbMissing && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-4 py-1.5 text-center">
          DATABASE_URL לא מוגדר - מסד הנתונים לא מחובר. ראה{' '}
          <span className="font-mono">SETUP.md</span> לקביעת ההגדרות.
        </div>
      )}

      <header className="bg-[var(--brand)] text-white px-3 sm:px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <AdminMobileNav />
          <Link href="/admin" className="flex items-center gap-2 font-bold text-lg">
            <OrdanLogo size="sm" />
            <span className="hidden sm:inline">מנהל</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-sm flex-shrink-0">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="text-white/75 hover:text-white text-xs hidden sm:block">
            צפה באתר
          </Link>
          <AdminSignOutButton />
        </div>
      </header>

      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-3 sm:p-4 md:p-6 min-w-0 max-w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
