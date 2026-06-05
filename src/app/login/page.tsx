import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { redirect } from 'next/navigation'
import { LoginClient } from './LoginClient'
import { OrdanLogo } from '@/components/public/OrdanLogo'
import { safeRelativeRedirect } from '@/lib/security/redirects'

interface PageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const [session, params] = await Promise.all([
    getServerSession(authOptions),
    searchParams,
  ])
  const callbackUrl = safeRelativeRedirect(params.callbackUrl)

  // Already signed in → redirect
  if (session?.user && !session.user.isAdmin) {
    redirect(callbackUrl)
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4 py-8 safe-bottom">
      {/* Brand */}
      <div className="mb-8 md:mb-10 text-center">
        <div className="mb-4 flex justify-center">
          <OrdanLogo size="lg" />
        </div>
        <p className="text-sm text-[var(--muted)]">פלטפורמת הספקים לתעשיית המזון והאירוח</p>
      </div>

      <div className="w-full max-w-sm bg-[var(--surface-elevated)] rounded-2xl md:rounded-3xl shadow-xl border border-[var(--border)] p-5 sm:p-8">
        <h1 className="text-xl font-bold text-[var(--foreground)] mb-2 text-center">
          כניסה לחשבון
        </h1>
        <p className="text-sm text-[var(--muted)] text-center mb-8 leading-relaxed">
          ספקים, מסעדות ובתי אירוח — הכניסה מאובטחת דרך גוגל
        </p>

        <LoginClient callbackUrl={callbackUrl} error={params.error} />

        <p className="text-xs text-[var(--muted)] text-center mt-6 leading-relaxed">
          בכניסה אתה מסכים לתנאי השימוש ומדיניות הפרטיות של הפלטפורמה
        </p>
      </div>

      <p className="text-xs text-[var(--muted)] mt-6">
        רוצה להציג את העסק שלך?{' '}
        <a href="/login" className="text-[var(--accent)] hover:underline font-medium">
          הירשם כספק
        </a>
      </p>
    </div>
  )
}
