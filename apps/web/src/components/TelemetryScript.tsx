'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

// Generates or reuses a session ID stored in sessionStorage.
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  const key = '__6das_sid'
  let sid = sessionStorage.getItem(key)
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(key, sid)
  }
  return sid
}

// TelemetryScript fires a "pageview" event on every route change.
// Drop this into the root layout (inside <Suspense>) to track all pages.
export default function TelemetryScript() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lastPath = useRef('')

  useEffect(() => {
    const page = pathname + (searchParams.toString() ? `?${searchParams}` : '')
    if (page === lastPath.current) return
    lastPath.current = page

    // Best-effort — never throw
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'pageview',
        page,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        session_id: getSessionId(),
      }),
    }).catch(() => {})
  }, [pathname, searchParams])

  return null
}
