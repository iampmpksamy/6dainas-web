'use client'

import { useState } from 'react'

export interface WebLead {
  id:         number
  lead_type:  string
  name:       string
  email:      string
  message:    string
  ip_address: string
  created_at: string
}

const TYPE_COLORS: Record<string, string> = {
  newsletter: 'badge-primary',
  contact:    'badge-electric',
  waitlist:   'text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded px-2 py-0.5 text-xs',
  demo:       'text-pink-400 bg-pink-400/10 border border-pink-400/20 rounded px-2 py-0.5 text-xs',
}

function typeClass(t: string) {
  return TYPE_COLORS[t] ?? 'text-gray-400 bg-white/[0.05] rounded px-2 py-0.5 text-xs border border-white/[0.08]'
}

interface Props { leads: WebLead[] }

export default function LeadsTable({ leads }: Props) {
  const [search, setSearch] = useState('')

  const filtered = leads.filter(l => {
    const q = search.toLowerCase()
    return !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.lead_type.toLowerCase().includes(q)
  })

  return (
    <div className="glass">
      <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
        <div>
          <h2 className="font-display font-semibold text-white">Leads</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} of {leads.length} leads</p>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, type…"
          className="field-input w-60 py-2 text-xs"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['#', 'Type', 'Name', 'Email', 'Message', 'Date'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-700 text-sm">
                  {search ? 'No results.' : 'No leads captured yet.'}
                </td>
              </tr>
            )}
            {filtered.map((l, i) => (
              <tr key={l.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{i + 1}</td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className={typeClass(l.lead_type)}>{l.lead_type}</span>
                </td>
                <td className="px-5 py-3.5 text-white font-medium whitespace-nowrap">{l.name || '—'}</td>
                <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">{l.email}</td>
                <td className="px-5 py-3.5 text-gray-600 max-w-[200px] truncate text-xs" title={l.message}>{l.message || '—'}</td>
                <td className="px-5 py-3.5 text-gray-600 text-xs whitespace-nowrap">
                  {l.created_at ? new Date(l.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
