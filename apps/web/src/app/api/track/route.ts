import { NextRequest, NextResponse } from 'next/server'

// Open endpoint — proxies web events to the telemetry backend.
// No auth required; clients call this from the browser.
// Rate limiting should be added at the Caddy / reverse-proxy layer.
export async function POST(req: NextRequest) {
  const telemetryURL = process.env.ANALYTICS_URL ?? 'http://localhost:7000'

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  // Attach server-side IP so the Go service sees the real address
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    ''

  try {
    const upstream = await fetch(`${telemetryURL}/api/v1/web/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...(body as object), ip_address: ip }),
    })
    return NextResponse.json({ status: 'ok' }, { status: upstream.ok ? 200 : 502 })
  } catch {
    // Silently drop — never block the user on analytics failures
    return NextResponse.json({ status: 'ok' })
  }
}
