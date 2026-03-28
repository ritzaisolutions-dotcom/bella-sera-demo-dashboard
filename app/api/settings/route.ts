import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticatedFromRequest } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

const ENV_PATH = path.join(process.cwd(), '.env.local')

function readEnvFile(): string {
  try {
    return fs.readFileSync(ENV_PATH, 'utf-8')
  } catch {
    return ''
  }
}

function updateEnvValues(content: string, updates: Record<string, string>): string {
  const lines = content.split('\n')
  const updatedKeys = new Set<string>()

  const newLines = lines.map((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return line
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) return line
    const key = trimmed.slice(0, eqIdx).trim()
    if (key in updates) {
      updatedKeys.add(key)
      return `${key}=${updates[key]}`
    }
    return line
  })

  // Append any keys that weren't already in the file
  for (const [key, value] of Object.entries(updates)) {
    if (!updatedKeys.has(key)) {
      newLines.push(`${key}=${value}`)
    }
  }

  return newLines.join('\n')
}

function getEnvValue(content: string, key: string): string {
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const k = trimmed.slice(0, eqIdx).trim()
    if (k === key) return trimmed.slice(eqIdx + 1).trim()
  }
  return ''
}

export async function GET(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const content = readEnvFile()

  // Return masked versions of secrets for display
  const supabaseUrl = getEnvValue(content, 'NEXT_PUBLIC_SUPABASE_URL')
  const anonKey = getEnvValue(content, 'NEXT_PUBLIC_SUPABASE_ANON_KEY')
  const serviceKey = getEnvValue(content, 'SUPABASE_SERVICE_ROLE_KEY')

  function mask(val: string): string {
    if (!val || val.length < 10) return val
    return val.slice(0, 8) + '••••••••' + val.slice(-4)
  }

  return NextResponse.json({
    supabaseUrl,
    anonKeyMasked: mask(anonKey),
    serviceKeyMasked: mask(serviceKey),
    hasServiceKey: !!serviceKey,
  })
}

export async function POST(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { action } = body

    const content = readEnvFile()

    if (action === 'change-password') {
      const { currentPassword, newPassword } = body
      const storedPassword = getEnvValue(content, 'DASHBOARD_PASSWORD')

      if (currentPassword !== storedPassword) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
      }

      const updated = updateEnvValues(content, { DASHBOARD_PASSWORD: newPassword })
      fs.writeFileSync(ENV_PATH, updated, 'utf-8')

      return NextResponse.json({
        success: true,
        message: 'Password updated. Restart the dev server for the change to take effect.',
      })
    }

    if (action === 'update-api-keys') {
      const { supabaseUrl, anonKey, serviceKey } = body
      const updates: Record<string, string> = {}

      if (supabaseUrl) updates['NEXT_PUBLIC_SUPABASE_URL'] = supabaseUrl
      if (anonKey) updates['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = anonKey
      if (serviceKey) updates['SUPABASE_SERVICE_ROLE_KEY'] = serviceKey

      if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'No values provided' }, { status: 400 })
      }

      const updated = updateEnvValues(content, updates)
      fs.writeFileSync(ENV_PATH, updated, 'utf-8')

      return NextResponse.json({
        success: true,
        message: 'API keys updated. Restart the dev server for the changes to take effect.',
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
