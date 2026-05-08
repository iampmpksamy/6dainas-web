'use client'

import { useState } from 'react'

export interface WebEvent {
  id:         number
  event_type: string
  page:       string
  referrer:   string
  session_id: string
  country:    string
  ip_address: string
  user_agent: string
  props:      string
  created_at: string
}

const TYPE_COLORS: Record<string, string> = {
  pageview:  'badge-primary',
  download:  'badge-electric',
  click:     'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded px-2 py-0.5 text-xs',
  signup:    'text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded px-2 py-0.5 text-xs',
  purchase:  'text-pink-400 bg-pink-400/10 border border-pink-400/20 rounded px-2 py-0.5 text-xs',
}

function typeClass(t: string) {
  return TYPE_COLORS[t] ?? 'text-gray-400 bg-white/[0.05] rounded px-2 py-0.5 text-xs border border-white/[0.08]'
}

interface Props { events: WebEvent[] }

export default function WebEventsTable({ events }: Props) {
  const [search, setSearch] = useState('')

  const filtered = events.filter(e => {
    const q = search.toLowerCase()
    return !q || e.page.toLowerCase().includes(q) || e.event_type.toLowerCase().includes(q) || e.session_id.toLowerCase().includes(q)
  })

  return (
    <div className="glass">
      <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
        <div>
          <h2 className="font-display font-semibold text-white">Web Events</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} of {events.length} events (latest 500)</p>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search page, type, session…"
          className="field-input w-60 py-2 text-xs"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['#', 'Type', 'Page', 'Session', 'Referrer', 'Time'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-700 text-sm">
                  {search ? 'No results.' : 'No events yet — TelemetryScript fires on first page load.'}
                </td>
              </tr>
            )}
            {filtered.map((e, i) => (
              <tr key={e.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{i + 1}</td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className={typeClass(e.event_type)}>{e.event_type}</span>
                </td>
                <td className="px-5 py-3.5 text-gray-300 max-w-[220px] truncate font-mono text-xs" title={e.page}>{e.page || '/'}</td>
                <td className="px-5 py-3.5 text-gray-600 font-mono text-xs whitespace-nowrap">{e.session_id ? e.session_id.slice(0, 10) + '…' : '—'}</td>
                <td className="px-5 py-3.5 text-gray-600 max-w-[180px] truncate text-xs" title={e.referrer}>{e.referrer || '—'}</td>
                <td className="px-5 py-3.5 text-gray-600 text-xs whitespace-nowrap">
                  {e.created_at ? new Date(e.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
