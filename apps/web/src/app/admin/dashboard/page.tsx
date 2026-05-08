import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import DashboardCharts from '@/components/admin/DashboardCharts'
import UsersTable      from '@/components/admin/UsersTable'

export const metadata: Metadata = {
  title: 'Analytics Dashboard — 6DAiNAS-OS Admin',
  robots: { index: false, follow: false },
}

// Server-side data fetch — ANALYTICS_KEY never sent to browser
async function fetchAnalytics<T>(path: string): Promise<T | null> {
  const base   = process.env.ANALYTICS_URL ?? 'http://localhost:7000'
  const apiKey = process.env.ANALYTICS_KEY ?? ''
  try {
    const res = await fetch(`${base}/api/v1/${path}`, {
      headers: { ...(apiKey ? { 'X-API-Key': apiKey } : {}) },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function DashboardPage() {
  // Double-check session server-side (middleware already guards this route,
  // but we check here too so SSR data fetch is safe)
  const session = (await cookies()).get('__admin_session')
  if (!session) redirect('/admin/login')

  const [statsRaw, regsRaw] = await Promise.all([
    fetchAnalytics<{
      total: number
      by_source: Record<string, number>
      by_experience: Record<string, number>
      by_payment: Record<string, number>
    }>('stats'),
    fetchAnalytics<{ data: unknown[]; total: number }>('registrations'),
  ])

  const stats = statsRaw ?? { total: 0, by_source: {}, by_experience: {}, by_payment: {} }
  const registrations = (regsRaw?.data ?? []) as Parameters<typeof UsersTable>[0]['registrations']

  // Derived quick stats
  const expertCount = (stats.by_experience?.['Advanced (use regularly)'] ?? 0)
                    + (stats.by_experience?.['Expert (professional / homelab)'] ?? 0)
  const payingCount = stats.by_payment?.['Yes, definitely'] ?? 0

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="badge-primary mb-2">Private · Admin Only</div>
          <h1 className="font-display font-bold text-2xl text-white">Analytics Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">6DAiNAS-OS install registrations — HomeLab data</p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="btn-ghost px-4 py-2 text-sm">Sign Out</button>
        </form>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: 'Total Installs',         value: stats.total,                      color: 'primary' },
          { label: 'Unique Sources',          value: Object.keys(stats.by_source ?? {}).length, color: 'electric' },
          { label: 'Expert / Advanced Users', value: expertCount,                      color: 'primary' },
          { label: 'Would Pay',               value: payingCount,                      color: 'electric' },
        ].map(card => (
          <div key={card.label} className={`glass p-5 text-center ${card.color === 'primary' ? 'glass-primary' : 'glass-electric'}`}>
            <div className={`font-display font-bold text-3xl mb-1 ${card.color === 'primary' ? 'text-gradient-primary' : 'text-gradient-electric'}`}>
              {card.value}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts
        bySource={stats.by_source ?? {}}
        byExperience={stats.by_experience ?? {}}
        byPayment={stats.by_payment ?? {}}
      />

      {/* Users table */}
      <UsersTable registrations={registrations} />

      {/* Footer note */}
      <p className="text-xs text-gray-700 text-center pb-4">
        Data sourced from the 6DAiNAS-OS analytics backend on your HomeLab ·
        All data stays on your hardware
      </p>
    </div>
  )
}
