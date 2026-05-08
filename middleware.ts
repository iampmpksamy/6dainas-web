import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const PROTECTED = ['/admin/dashboard']
const LOGIN_PATH = '/admin/login'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get('__admin_session')?.value
  if (!token) return NextResponse.redirect(new URL(LOGIN_PATH, req.url))

  try {
    const secret = new TextEncoder().encode(process.env.ADMIN_SECRET ?? 'fallback-dev-secret')
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL(LOGIN_PATH, req.url))
    res.cookies.delete('__admin_session')
    return res
  }
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
}
