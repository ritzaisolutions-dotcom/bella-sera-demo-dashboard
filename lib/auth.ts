import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'bella-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function setAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: COOKIE_NAME,
    value: 'authenticated',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
  return response
}

export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}

// For use in Server Components and Route Handlers (next/headers)
export function isAuthenticated(): boolean {
  const cookieStore = cookies()
  const cookie = cookieStore.get(COOKIE_NAME)
  return cookie?.value === 'authenticated'
}

// For use in middleware (Edge Runtime — NextRequest only)
export function isAuthenticatedFromRequest(request: NextRequest): boolean {
  const cookie = request.cookies.get(COOKIE_NAME)
  return cookie?.value === 'authenticated'
}
