// ============================================================
// NETRA AI — Root Layout
// Fonts, providers, global structure
// ============================================================
import type { Metadata, Viewport } from 'next'
import { Inter, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { QueryProvider } from '@/components/providers/QueryProvider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'NETRA AI — Crime Intelligence Platform',
    template: '%s | NETRA AI',
  },
  description:
    'Network Enhanced Threat Recognition & Analysis — AI-Powered Crime Intelligence Operating System for Karnataka State Police',
  keywords: ['crime intelligence', 'police', 'Karnataka', 'AI', 'NETRA'],
  robots: { index: false, follow: false }, // Government internal system
  icons: { icon: '/favicon.ico' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050A14',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-bg-base text-text-primary">
        <QueryProvider>
          <AuthGuard>{children}</AuthGuard>
        </QueryProvider>

        {/* Toast notification system */}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#0F1F3D',
              border: '1px solid rgba(56, 97, 170, 0.35)',
              color: '#E8EDF7',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
            },
          }}
          richColors
        />
      </body>
    </html>
  )
}
