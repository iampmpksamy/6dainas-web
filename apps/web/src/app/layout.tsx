import type { Metadata } from 'next'
import { Suspense } from 'react'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TelemetryScript from '@/components/TelemetryScript'

export const metadata: Metadata = {
  title: '6DAiNAS-OS — India\'s 1st Open Source AI NAS OS',
  description: 'Smart HomeLab storage OS powered by AI — file management, Docker apps, local analytics, and full data sovereignty. Built for India\'s HomeLab community.',
  keywords: ['NAS OS', 'HomeLab', 'AI NAS', 'open source', 'India', 'self-hosted', 'Docker'],
  openGraph: {
    title: '6DAiNAS-OS',
    description: 'India\'s 1st Open Source AI NAS Operating System',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
