import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { redirect } from 'next/navigation'
import { RoleSelectClient } from './RoleSelectClient'
import { OrdanLogo } from '@/components/public/OrdanLogo'

export default async function OnboardingRolePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) redirect('/login')
  if (session.user.isAdmin) redirect('/admin')
  // Already picked a role: jump to profile step if incomplete, otherwise home
  if (session.user.role && session.user.role !== 'pending') {
    redirect(session.user.onboardingComplete ? '/' : '/onboarding/profile')
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <OrdanLogo size="lg" />
        </div>
        <p className="text-sm text-[var(--muted)]">ברוך הבא, {session.user.name?.split(' ')[0]}</p>
      </div>

      <div className="w-full max-w-md bg-[var(--surface-elevated)] rounded-3xl shadow-xl border border-[var(--border)] p-8">
        <h1 className="text-xl font-bold text-[var(--foreground)] mb-2 text-center">
          מה מתאר אותך?
        </h1>
        <p className="text-sm text-[var(--muted)] text-center mb-8">
          נתאים את החוויה לסוג העסק שלך
        </p>

        <RoleSelectClient />
      </div>
    </div>
  )
}
