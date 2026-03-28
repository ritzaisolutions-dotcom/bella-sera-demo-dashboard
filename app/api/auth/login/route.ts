import { NextRequest, NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth'
import { timingSafeEqual } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }

    const validPassword = process.env.DASHBOARD_PASSWORD

    if (!validPassword) {
      console.error('DASHBOARD_PASSWORD environment variable is not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    let passwordsMatch = false
    try {
      const a = Buffer.from(password)
      const b = Buffer.from(validPassword)
      passwordsMatch = a.length === b.length && timingSafeEqual(a, b)
    } catch {
      passwordsMatch = false
    }

    if (!passwordsMatch) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true }, { status: 200 })
    return setAuthCookie(response)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
