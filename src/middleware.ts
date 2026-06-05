import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

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

  // ── User routes: require any non-admin login ─────────────────────────────
  const userRoutes = ['/my-suppliers', '/dashboard', '/onboarding']
  const isUserRoute = userRoutes.some(r => pathname.startsWith(r))

  if (isUserRoute) {
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`)
      return NextResponse.redirect(loginUrl)
    }
    // Admins shouldn't access user routes
    if (token.isAdmin) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/((?!login$).*)',
    '/my-suppliers',
    '/my-suppliers/(.*)',
    '/dashboard',
    '/dashboard/(.*)',
    '/onboarding/(.*)',
  ],
}
