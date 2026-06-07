import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { redirect } from 'next/navigation'
import { getActiveCategories } from '@/lib/db/categories'
import { OrdanLogo } from '@/components/public/OrdanLogo'
import { BuyerProfileForm } from './BuyerProfileForm'
import { SupplierProfileForm } from './SupplierProfileForm'

export const dynamic = 'force-dynamic'

export default async function OnboardingProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) redirect('/login')
  if (session.user.isAdmin) redirect('/admin')

  const role = session.user.role
  if (!role || role === 'pending') redirect('/onboarding/role')
  if (session.user.onboardingComplete) redirect('/')

  const categories = role === 'supplier' ? await getActiveCategories() : []

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4 py-8">
      <div className="mb-6 text-center">
        <div className="mb-3 flex justify-center">
          <OrdanLogo size="md" />
        </div>
        <p className="text-sm text-[var(--muted)]">
          כמעט סיימנו, {session.user.name?.split(' ')[0]}
        </p>
      </div>

      <div className="w-full max-w-md bg-[var(--surface-elevated)] rounded-3xl shadow-xl border border-[var(--border)] p-6 md:p-8">
        {role === 'buyer' ? (
          <BuyerProfileForm />
        ) : (
          <SupplierProfileForm
            categories={categories.map(c => c.labelHe)}
          />
        )}
      </div>
    </div>
  )
}
