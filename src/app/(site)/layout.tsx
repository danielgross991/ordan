import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { SearchBar } from '@/components/public/SearchBar'
import { UserMenu } from '@/components/public/UserMenu'
import { OrdanLogo } from '@/components/public/OrdanLogo'
import { MobileHeaderSearch } from '@/components/public/MobileHeaderSearch'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

async function Header() {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const isLoggedIn = !!user && !user.isAdmin
  const role = user?.role

  return (
    <header className="relative bg-white/95 backdrop-blur border-b border-[var(--border)] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 md:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6">

          {/* Logo */}
          <Link href="/" className="group flex-shrink-0" aria-label="Ordan">
            <OrdanLogo size="sm" />
          </Link>

          {/* Search — desktop */}
          <div className="hidden md:block w-full max-w-sm mx-auto">
            <SearchBar placeholder="חפש ספקים, קטגוריות..." />
          </div>

          {/* Nav */}
          <nav className="flex flex-shrink-0 items-center gap-1 justify-end min-w-0">
            <MobileHeaderSearch />

            <Link
              href="/map"
              className="md:hidden p-2 rounded-lg text-[var(--muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)] transition-colors"
              aria-label="מפה"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v15M15 6v15" />
              </svg>
            </Link>

            <Link
              href="/my-suppliers"
              className="md:hidden p-2 rounded-lg text-[var(--muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)] transition-colors"
              aria-label="הספקים שלי"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3-7 3V5z" />
              </svg>
            </Link>

            {/* Desktop: all suppliers link */}
            <Link
              href="/suppliers"
              className="hidden md:block px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)] transition-colors"
            >
              כל הספקים
            </Link>

            <Link
              href="/map"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v15M15 6v15" />
              </svg>
              מפה
            </Link>

            <Link
              href="/my-suppliers"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3-7 3V5z" />
              </svg>
              הספקים שלי
            </Link>

            {/* Desktop: Dashboard (suppliers) */}
            {isLoggedIn && role === 'supplier' && (
              <Link
                href="/dashboard"
                className="hidden md:block px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--muted)] hover:text-[var(--brand)] hover:bg-[var(--brand-light)] transition-colors"
              >
                הלוח שלי
              </Link>
            )}

            {/* Sign in button (logged out) */}
            {!isLoggedIn && (
              <Link
                href="/login"
                className="px-3 py-2 rounded-xl text-sm font-semibold bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)] transition-colors"
              >
                <span className="hidden sm:inline">כניסה</span>
                <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Link>
            )}

            {/* User menu (logged in) */}
            {isLoggedIn && (
              <UserMenu
                name={user.name ?? ''}
                image={user.image ?? null}
                role={role ?? 'pending'}
              />
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-[var(--brand-dark)] text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xs">
            <div className="mb-3">
              <OrdanLogo size="md" />
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              פלטפורמת הספקים לתעשיית המזון, המסעדנות, והאירוח בישראל.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-10 text-sm">
            <div>
              <div className="font-semibold mb-3 text-blue-100">גלישה</div>
              <div className="space-y-2">
                <div><Link href="/suppliers" className="text-blue-300 hover:text-white transition-colors">כל הספקים</Link></div>
                <div><Link href="/" className="text-blue-300 hover:text-white transition-colors">דף הבית</Link></div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-3 text-blue-100">חשבון</div>
              <div className="space-y-2">
                <div><Link href="/login" className="text-blue-300 hover:text-white transition-colors">כניסה</Link></div>
                <div><Link href="/my-suppliers" className="text-blue-300 hover:text-white transition-colors">הספקים שלי</Link></div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-blue-400">
          <span>© {new Date().getFullYear()} כל הזכויות שמורות.</span>
          <span className="text-blue-500">פלטפורמת ספקים B2B לתעשיית המזון והאירוח</span>
        </div>
      </div>
    </footer>
  )
}
