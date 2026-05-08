'use client'

import { useState } from 'react'

interface Registration {
  id:           number
  device_id:    string
  name:         string
  email:        string
  profession:   string
  experience:   string
  source:       string
  usage:        string
  payment:      string
  feature:      string
  version:      string
  ip_address:   string
  installed_at: string
}

interface Props { registrations: Registration[] }

export default function UsersTable({ registrations }: Props) {
  const [search, setSearch] = useState('')

  const filtered = registrations.filter(r => {
    const q = search.toLowerCase()
    return !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.source.toLowerCase().includes(q)
  })

  return (
    <div className="glass">
      {/* Table header */}
      <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
        <div>
          <h2 className="font-display font-semibold text-white">Registered Users</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} of {registrations.length} installs</p>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, email, source…"
          className="field-input w-60 py-2 text-xs"
        />
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['#', 'Name', 'Email', 'Profession', 'Experience', 'Source', 'Payment', 'Version', 'Registered'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-widest text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-5 py-10 text-center text-gray-700 text-sm">
                  {search ? 'No results for your search.' : 'No registrations yet. Install 6DAiNAS-OS to start collecting data.'}
                </td>
              </tr>
            )}
            {filtered.map((r, i) => (
              <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 text-gray-600 font-mono text-xs">{i + 1}</td>
                <td className="px-5 py-3.5 text-white font-medium whitespace-nowrap">{r.name}</td>
                <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">{r.email}</td>
                <td className="px-5 py-3.5 text-gray-400 max-w-[160px] truncate" title={r.profession}>{r.profession || '—'}</td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <span className="badge-primary text-xs">{r.experience || '—'}</span>
                </td>
                <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">{r.source || '—'}</td>
                <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap max-w-[130px] truncate" title={r.payment}>{r.payment || '—'}</td>
                <td className="px-5 py-3.5 text-gray-600 font-mono text-xs whitespace-nowrap">{r.version || '—'}</td>
                <td className="px-5 py-3.5 text-gray-600 text-xs whitespace-nowrap">
                  {r.installed_at ? new Date(r.installed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
