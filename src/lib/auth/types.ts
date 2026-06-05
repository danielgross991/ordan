import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      email?: string | null
      name?: string | null
      image?: string | null
      isAdmin?: boolean
      role?: string        // 'pending' | 'buyer' | 'supplier' | 'admin'
      userId?: string
      onboardingComplete?: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isAdmin?: boolean
    role?: string
    userId?: string
    onboardingComplete?: boolean
  }
}
