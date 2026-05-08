import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('__admin_session')?.value
  if (!token) return false
  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET ?? 'fallback-dev-secret')
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  if (!(await isAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const analyticsURL = process.env.ANALYTICS_URL ?? 'http://localhost:7000'
  const apiKey       = process.env.ANALYTICS_KEY  ?? ''
  const subpath      = params.path.join('/')
  const target       = `${analyticsURL}/api/v1/${subpath}`

  try {
    const upstream = await fetch(target, {
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'X-API-Key': apiKey } : {}),
      },
      cache: 'no-store',
    })
    const data = await upstream.json()
    return NextResponse.json(data, { status: upstream.status })
  } catch {
    return NextResponse.json({ error: 'Analytics backend unreachable' }, { status: 502 })
  }
}
