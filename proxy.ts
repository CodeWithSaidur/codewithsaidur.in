import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      if (pathname === '/admin/login') {
        return NextResponse.next()
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const payload = verifyToken(token)
    if (!payload) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin-token')
      return response
    }

    if (pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
