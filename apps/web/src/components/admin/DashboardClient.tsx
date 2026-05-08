'use client'

import { useState } from 'react'
import { OSCharts, WebCharts } from './DashboardCharts'
import UsersTable from './UsersTable'
import WebEventsTable, { type WebEvent } from './WebEventsTable'
import LeadsTable, { type WebLead } from './LeadsTable'
import type { Registration } from './UsersTable'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface OSStats {
  total:         number
  this_week:     number
  this_month:    number
  by_source:     Record<string, number>
  by_experience: Record<string, number>
  by_payment:    Record<string, number>
  by_version:    Record<string, number>
}

export interface WebStats {
  total_events:    number
  total_pageviews: number
  unique_sessions: number
  this_week:       number
  by_page:         Record<string, number>
  by_type:         Record<string, number>
}

export interface LeadStats {
  total:     number
  by_type:   Record<string, number>
  this_week: number
}

export interface CombinedStats {
  os:    OSStats
  web:   WebStats
  leads: LeadStats
}

interface Props {
  stats:         CombinedStats
  registrations: Registration[]
  events:        WebEvent[]
  leads:         WebLead[]
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

type Tab = 'overview' | 'os' | 'web' | 'leads'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview'       },
  { id: 'os',       label: 'OS Installs'    },
  { id: 'web',      label: 'Web Analytics'  },
  { id: 'leads',    label: 'Leads'          },
]

// ── Stat card ─────────────────────────────────────────────────────────────────

function Card({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color?: 'primary' | 'electric' | 'green' }) {
  const num = color === 'electric' ? 'text-gradient-electric' : color === 'green' ? 'text-emerald-400' : 'text-gradient-primary'
  const bg  = color === 'electric' ? 'glass-electric' : color === 'green' ? 'border border-emerald-400/20' : 'glass-primary'
  return (
    <div className={`glass p-5 text-center ${bg}`}>
      <div className={`font-display font-bold text-3xl mb-1 ${num}`}>{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-widest">{label}</div>
      {sub && <div className="text-xs text-gray-700 mt-1">{sub}</div>}
    </div>
  )
}

// ── Main client component ─────────────────────────────────────────────────────

export default function DashboardClient({ stats, registrations, events, leads }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const { os, web, leads: ls } = stats

  const expertCount  = (os.by_experience?.['Advanced (use regularly)'] ?? 0) + (os.by_experience?.['Expert (professional / homelab)'] ?? 0)
  const payingCount  = os.by_payment?.['Yes, definitely'] ?? 0
  const downloads    = web.by_type?.['download'] ?? 0
  const newsletters  = ls.by_type?.['newsletter'] ?? 0

  return (
    <div className="space-y-8">

      {/* ── Summary stat cards (always visible) ───────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card label="OS Installs"    value={os.total}              color="primary"  />
        <Card label="Installs / wk"  value={os.this_week}          color="primary"  />
        <Card label="Page Views"     value={web.total_pageviews}   color="electric" />
        <Card label="Sessions"       value={web.unique_sessions}   color="electric" />
        <Card label="Web Events"     value={web.total_events}      color="electric" />
        <Card label="Would Pay"      value={payingCount}           color="primary"  />
        <Card label="Downloads"      value={downloads}             color="green"    />
        <Card label="Newsletter"     value={newsletters}           color="green"    />
      </div>

      {/* ── Tab bar ────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 border-b border-white/[0.08]">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ────────────────────────────────────────────────────── */}

      {tab === 'overview' && (
        <div className="space-y-8">
          <OSCharts
            bySource={os.by_source}
            byExperience={os.by_experience}
            byPayment={os.by_payment}
            byVersion={os.by_version}
          />
          <WebCharts byPage={web.by_page} byType={web.by_type} />
        </div>
      )}

      {tab === 'os' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card label="Total Installs"  value={os.total}      color="primary"  />
            <Card label="This Week"       value={os.this_week}  color="primary"  />
            <Card label="This Month"      value={os.this_month} color="primary"  />
            <Card label="Expert Users"    value={expertCount}   color="electric" />
          </div>
          <OSCharts
            bySource={os.by_source}
            byExperience={os.by_experience}
            byPayment={os.by_payment}
            byVersion={os.by_version}
          />
          <UsersTable registrations={registrations} />
        </div>
      )}

      {tab === 'web' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card label="Total Events"   value={web.total_events}    color="electric" />
            <Card label="Page Views"     value={web.total_pageviews} color="electric" />
            <Card label="Sessions"       value={web.unique_sessions} color="primary"  />
            <Card label="This Week"      value={web.this_week}       color="primary"  />
          </div>
          <WebCharts byPage={web.by_page} byType={web.by_type} />
          <WebEventsTable events={events} />
        </div>
      )}

      {tab === 'leads' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card label="Total Leads"   value={ls.total}                       color="primary"  />
            <Card label="Newsletter"    value={ls.by_type?.['newsletter'] ?? 0} color="electric" />
            <Card label="Contact"       value={ls.by_type?.['contact'] ?? 0}   color="electric" />
            <Card label="This Week"     value={ls.this_week}                   color="green"    />
          </div>
          <LeadsTable leads={leads} />
        </div>
      )}

    </div>
  )
}
