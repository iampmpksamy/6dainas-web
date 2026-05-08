'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin/dashboard')
      } else {
        setError('Wrong password. Try again.')
      }
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 700px 500px at 50% 40%, rgba(124,58,237,0.07) 0%, transparent 70%)' }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass rounded-3xl p-8 md:p-10"
             style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.06)' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-gradient mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg shadow-primary">
              6D
            </div>
            <h1 className="font-display font-bold text-xl text-white mb-1">Admin Access</h1>
            <p className="text-gray-500 text-sm">6DAiNAS-OS Analytics Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="field-input"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="btn-primary w-full py-3.5 text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-700 mt-6">
            Private admin area · 6DAiNAS-OS Analytics
          </p>
        </div>
      </div>
    </div>
  )
}
