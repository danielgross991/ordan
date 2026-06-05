import type { Metadata, Viewport } from 'next'
import { Assistant } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const assistant = Assistant({
  subsets: ['latin', 'hebrew'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'אורדן | פלטפורמת ספקים לתעשיית המזון והאירוח',
  description: 'מצא ספקים מקצועיים לתעשיית המסעדנות, האירוח, והמזון בישראל',
  openGraph: {
    locale: 'he_IL',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#172745',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={assistant.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
