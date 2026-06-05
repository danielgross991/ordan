import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

export async function requireAdminSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) redirect('/admin/login')
  return session
}

export async function assertAdminSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) throw new Error('Unauthorized')
  return session
}

export async function requireUserSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.userId || session.user.isAdmin) throw new Error('Unauthorized')
  return session
}
