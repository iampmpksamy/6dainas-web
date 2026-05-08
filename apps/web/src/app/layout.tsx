import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TelemetryScript from '@/components/TelemetryScript'

const SITE_URL = 'https://6dainas.cloud'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '6DAiNAS-OS — India\'s 1st Open Source AI NAS OS',
    template: '%s | 6DAiNAS-OS',
  },
  description: 'Smart HomeLab storage OS powered by AI — file management, Docker apps, local analytics, and full data sovereignty. Built for India\'s HomeLab community.',
  keywords: ['NAS OS', 'HomeLab', 'AI NAS', 'open source', 'India', 'self-hosted', 'Docker', '6DAiNAS'],
  authors: [{ name: '6DAiNAS Team', url: SITE_URL }],
  creator: '6DAiNAS Team',
  robots: { index: true, follow: true },
  openGraph: {
    title: '6DAiNAS-OS — India\'s 1st Open Source AI NAS OS',
    description: 'Smart HomeLab storage OS powered by AI. Full data sovereignty, Docker apps, local analytics.',
    url: SITE_URL,
    siteName: '6DAiNAS-OS',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: '6DAiNAS-OS',
    description: 'India\'s 1st Open Source AI NAS Operating System',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="font-sans text-gray-100 antialiased">
        <Suspense fallback={null}>
          <TelemetryScript />
        </Suspense>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
