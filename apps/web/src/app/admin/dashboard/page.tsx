import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import DashboardClient, { type CombinedStats } from '@/components/admin/DashboardClient'
import type { Registration } from '@/components/admin/UsersTable'
import type { WebEvent } from '@/components/admin/WebEventsTable'
import type { WebLead } from '@/components/admin/LeadsTable'

export const metadata: Metadata = {
  title: 'Telemetry Dashboard — 6DAiNAS Admin',
  robots: { index: false, follow: false },
}

const DEFAULT_STATS: CombinedStats = {
  os:    { total: 0, this_week: 0, this_month: 0, by_source: {}, by_experience: {}, by_payment: {}, by_version: {} },
  web:   { total_events: 0, total_pageviews: 0, unique_sessions: 0, this_week: 0, by_page: {}, by_type: {} },
  leads: { total: 0, by_type: {}, this_week: 0 },
}

async function fetchTelemetry<T>(path: string): Promise<T | null> {
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
  const session = (await cookies()).get('__admin_session')
  if (!session) redirect('/admin/login')

  const [statsRaw, regsRaw, eventsRaw, leadsRaw] = await Promise.all([
    fetchTelemetry<CombinedStats>('stats'),
    fetchTelemetry<{ data: Registration[] }>('os/registrations'),
    fetchTelemetry<{ data: WebEvent[] }>('web/events'),
    fetchTelemetry<{ data: WebLead[] }>('web/leads'),
  ])

  const stats         = statsRaw ?? DEFAULT_STATS
  const registrations = regsRaw?.data  ?? []
  const events        = eventsRaw?.data ?? []
  const leads         = leadsRaw?.data  ?? []

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="badge-primary mb-2">Private · Admin Only</div>
          <h1 className="font-display font-bold text-2xl text-white">Telemetry Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            6DAiNAS-OS installs · 6dainas.cloud web analytics · leads — all on your HomeLab
          </p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="btn-ghost px-4 py-2 text-sm">Sign Out</button>
        </form>
      </div>

      {/* Client-side tabs + all content */}
      <DashboardClient
        stats={stats}
        registrations={registrations}
        events={events}
        leads={leads}
      />

      <p className="text-xs text-gray-700 text-center pb-4">
        All data stored on your HomeLab · telemetry.6dainas.cloud · never leaves your hardware
      </p>
    </div>
  )
}
