import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { createOrUpdateUser, getUserByEmail } from '@/lib/db/users'
import { checkRateLimit, getClientIp, getRateLimitKey } from '@/lib/security/rateLimit'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const isProduction = process.env.NODE_ENV === 'production'
const isStrictProduction = isProduction && (process.env.VERCEL_ENV === 'production' || process.env.ORDAN_ENFORCE_PROD_ENV === 'true')
const hasGoogleOAuth = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)

if (isStrictProduction && !process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is required in production')
}

if (isStrictProduction && !process.env.NEXTAUTH_URL?.startsWith('https://')) {
  throw new Error('NEXTAUTH_URL must be configured with HTTPS in production')
}

if (isStrictProduction && (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH)) {
  throw new Error('Admin credentials must be configured in production')
}

export const authOptions: NextAuthOptions = {
  providers: [
    ...(hasGoogleOAuth
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'שם משתמש', type: 'text' },
        password: { label: 'סיסמה', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null
        if (credentials.username.length > 120 || credentials.password.length > 300) return null

        const ip = getClientIp(req?.headers ?? {})
        // Per-IP guard against username spraying (stricter than per-username)
        if (!checkRateLimit(getRateLimitKey('admin-login-ip', ip), 20, 15 * 60 * 1000)) {
          await sleep(800)
          return null
        }
        if (!checkRateLimit(getRateLimitKey('admin-login', credentials.username), 10, 15 * 60 * 1000)) {
          await sleep(800)
          return null
        }

        const expectedUsername = process.env.ADMIN_USERNAME
        const expectedHash = process.env.ADMIN_PASSWORD_HASH

        if (!expectedUsername || !expectedHash) {
          console.error('[Auth] ADMIN_USERNAME or ADMIN_PASSWORD_HASH not configured')
          return null
        }

        // Always run bcrypt to keep timing constant whether username matches or not.
        // Use a dummy hash of equivalent cost when the username is wrong.
        const dummyHash = '$2b$10$abcdefghijklmnopqrstuv1234567890abcdefghijklmnopqrstuvwxyz'
        const usernameMatches = credentials.username === expectedUsername
        const hashToCompare = usernameMatches ? expectedHash : dummyHash
        const valid = await bcrypt.compare(credentials.password, hashToCompare)
        if (!valid || !usernameMatches) {
          await sleep(300)
          return null
        }

        return { id: '1', name: 'Admin', email: 'admin@ordan.local' }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  useSecureCookies: isProduction,
  cookies: isProduction
    ? {
        sessionToken: {
          name: '__Secure-next-auth.session-token',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: true,
          },
        },
        callbackUrl: {
          name: '__Secure-next-auth.callback-url',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: true,
          },
        },
        csrfToken: {
          name: '__Host-next-auth.csrf-token',
          options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: true,
          },
        },
      }
    : undefined,

  pages: {
    signIn: '/login',
    error: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      try {
        const parsed = new URL(url)
        if (parsed.origin === baseUrl) return parsed.toString()
      } catch {}
      return baseUrl
    },

    async signIn({ user, account }) {
      // Google sign-in: create or update user in DB
      if (account?.provider === 'google' && user.email) {
        try {
          await createOrUpdateUser({
            email: user.email,
            name: user.name ?? '',
            avatarUrl: user.image ?? null,
          })
        } catch {
          console.error('[Auth] Failed to create/update Google user')
          if (isProduction) return false
        }
      }
      return true
    },

    async jwt({ token, account }) {
      if (account?.provider === 'google' && token.email) {
        // First sign-in: load role from DB
        try {
          const dbUser = await getUserByEmail(token.email)
          token.role = dbUser?.role ?? 'pending'
          token.userId = dbUser?.id ?? token.sub
          token.onboardingComplete = dbUser?.onboardingComplete ?? false
          token.isAdmin = false
        } catch {
          token.role = 'pending'
          token.isAdmin = false
        }
      } else if (account?.provider === 'credentials') {
        token.isAdmin = true
        token.role = 'admin'
        token.userId = '1'
        token.onboardingComplete = true
      }

      return token
    },

    async session({ session, token }) {
      session.user.isAdmin = !!(token.isAdmin)
      session.user.role = (token.role as string) ?? 'pending'
      session.user.userId = (token.userId as string) ?? (token.sub as string)
      session.user.onboardingComplete = !!(token.onboardingComplete)
      return session
    },
  },
}
