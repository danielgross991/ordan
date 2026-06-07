import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const EXEMPT_FOR_PENDING = [
  '/onboarding',
  '/login',
  '/api',
  '/_next',
  '/icon.png',
  '/favicon.ico',
]

function isExempt(pathname: string): boolean {
  return EXEMPT_FOR_PENDING.some(p => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p))
}

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  // ── Admin routes: require admin credentials ──────────────────────────────
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token || !token.isAdmin) {
      const loginUrl = new URL('/admin/login', req.url)
      loginUrl.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // ── User-only routes: require any non-admin login ────────────────────────
  const userRoutes = ['/my-suppliers', '/dashboard', '/onboarding']
  const isUserRoute = userRoutes.some(r => pathname.startsWith(r))

  if (isUserRoute) {
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`)
      return NextResponse.redirect(loginUrl)
    }
    if (token.isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  // ── Force logged-in non-admin users through onboarding ───────────────────
  if (token && !token.isAdmin && !isExempt(pathname)) {
    const role = token.role as string | undefined
    const onboardingComplete = !!token.onboardingComplete

    if (!role || role === 'pending') {
      return NextResponse.redirect(new URL('/onboarding/role', req.url))
    }
    if (!onboardingComplete) {
      return NextResponse.redirect(new URL('/onboarding/profile', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  // Run on everything except API routes, static files, and image optimizer
  matcher: [
    '/((?!api/auth|_next/static|_next/image|icon.png|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)',
  ],
}
