'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import SignOutButton from '@/components/SignOutButton'

type Tab = 'password' | 'api-keys'

interface ApiInfo {
  supabaseUrl: string
  anonKeyMasked: string
  serviceKeyMasked: string
  hasServiceKey: boolean
}

function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div
      className={`rounded-lg px-4 py-3 text-sm border ${
        type === 'success'
          ? 'bg-brand-green/10 border-brand-green/25 text-brand-green'
          : 'bg-red-400/10 border-red-400/25 text-red-400'
      }`}
    >
      {message}
    </div>
  )
}

function PasswordTab() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (next !== confirm) {
      setStatus({ type: 'error', message: 'New passwords do not match' })
      return
    }
    setLoading(true)
    setStatus(null)

    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'change-password', currentPassword: current, newPassword: next }),
    })

    const data = await res.json()
    setStatus({ type: res.ok ? 'success' : 'error', message: data.message || data.error })
    if (res.ok) { setCurrent(''); setNext(''); setConfirm('') }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <div>
        <label className="block text-xs uppercase tracking-widest text-brand-gold mb-2">
          Current Password
        </label>
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
          className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm
                     text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold
                     focus:ring-1 focus:ring-brand-gold transition"
          placeholder="Enter current password"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-brand-gold mb-2">
          New Password
        </label>
        <input
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
          minLength={6}
          className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm
                     text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold
                     focus:ring-1 focus:ring-brand-gold transition"
          placeholder="Minimum 6 characters"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-brand-gold mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm
                     text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold
                     focus:ring-1 focus:ring-brand-gold transition"
          placeholder="Repeat new password"
        />
      </div>

      {status && <Alert type={status.type} message={status.message} />}

      <button
        type="submit"
        disabled={loading}
        className="bg-brand-gold text-brand-bg px-6 py-2.5 rounded-lg text-xs font-semibold
                   uppercase tracking-widest hover:bg-brand-gold-light transition
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>

      <p className="text-brand-muted text-xs">
        After changing the password, restart the dev server for it to take effect.
      </p>
    </form>
  )
}

function ApiKeysTab() {
  const [info, setInfo] = useState<ApiInfo | null>(null)
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [anonKey, setAnonKey] = useState('')
  const [serviceKey, setServiceKey] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((data) => {
      setInfo(data)
      setSupabaseUrl(data.supabaseUrl || '')
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update-api-keys',
        supabaseUrl: supabaseUrl || undefined,
        anonKey: anonKey || undefined,
        serviceKey: serviceKey || undefined,
      }),
    })

    const data = await res.json()
    setStatus({ type: res.ok ? 'success' : 'error', message: data.message || data.error })
    if (res.ok) { setAnonKey(''); setServiceKey('') }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      <div>
        <label className="block text-xs uppercase tracking-widest text-brand-gold mb-2">
          Supabase Project URL
        </label>
        <input
          type="url"
          value={supabaseUrl}
          onChange={(e) => setSupabaseUrl(e.target.value)}
          className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm
                     text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold
                     focus:ring-1 focus:ring-brand-gold transition font-mono"
          placeholder="https://your-project.supabase.co"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-brand-gold mb-2">
          Anon / Public Key
        </label>
        {info && (
          <p className="text-brand-muted text-xs mb-2 font-mono">
            Current: {info.anonKeyMasked || '—'}
          </p>
        )}
        <input
          type="password"
          value={anonKey}
          onChange={(e) => setAnonKey(e.target.value)}
          className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm
                     text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold
                     focus:ring-1 focus:ring-brand-gold transition font-mono"
          placeholder="Paste new key to update (leave blank to keep current)"
        />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-brand-gold mb-2">
          Service Role Key{' '}
          <span className="text-brand-muted normal-case tracking-normal font-normal">
            (bypasses RLS)
          </span>
        </label>
        {info && (
          <p className="text-brand-muted text-xs mb-2 font-mono">
            Current: {info.hasServiceKey ? info.serviceKeyMasked : 'Not set'}
          </p>
        )}
        <input
          type="password"
          value={serviceKey}
          onChange={(e) => setServiceKey(e.target.value)}
          className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm
                     text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold
                     focus:ring-1 focus:ring-brand-gold transition font-mono"
          placeholder="Paste new key to update (leave blank to keep current)"
        />
      </div>

      {status && <Alert type={status.type} message={status.message} />}

      <button
        type="submit"
        disabled={loading}
        className="bg-brand-gold text-brand-bg px-6 py-2.5 rounded-lg text-xs font-semibold
                   uppercase tracking-widest hover:bg-brand-gold-light transition
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Save API Keys'}
      </button>

      <p className="text-brand-muted text-xs">
        Changes take effect after restarting the dev server.
      </p>
    </form>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('password')
  const router = useRouter()

  useEffect(() => {
    // Verify auth client-side as a belt-and-suspenders check
    fetch('/api/reservations').then((r) => {
      if (r.status === 401) router.push('/login')
    })
  }, [router])

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="border-b border-brand-border bg-brand-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size={32} />
          <nav className="flex items-center gap-1">
            <a
              href="/"
              className="px-4 py-2 text-xs uppercase tracking-widest text-brand-muted hover:text-brand-text transition"
            >
              Reservations
            </a>
            <a
              href="/settings"
              className="px-4 py-2 text-xs uppercase tracking-widest text-brand-gold font-medium
                         border-b border-brand-gold"
            >
              Settings
            </a>
            <div className="w-px h-4 bg-brand-border mx-2" />
            <SignOutButton />
          </nav>
        </div>
      </header>

      {/* Page title */}
      <div className="border-b border-brand-border bg-brand-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-brand-gold text-xs uppercase tracking-widest font-medium mb-1">
            Admin Dashboard
          </p>
          <h2 className="font-serif text-2xl text-brand-text">Settings</h2>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar tabs */}
          <aside className="w-48 flex-shrink-0">
            <nav className="space-y-1">
              {[
                { id: 'password' as Tab, label: 'Change Password' },
                { id: 'api-keys' as Tab, label: 'API Keys' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs uppercase tracking-widest transition ${
                    tab === item.id
                      ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                      : 'text-brand-muted hover:text-brand-text hover:bg-brand-surface'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 bg-brand-surface border border-brand-border rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-30" />
            <h3 className="font-serif text-xl text-brand-text mb-2">
              {tab === 'password' ? 'Change Password' : 'API Configuration'}
            </h3>
            <p className="text-brand-muted text-sm mb-8">
              {tab === 'password'
                ? 'Update the dashboard login password stored in your .env.local file.'
                : 'Update your Supabase connection keys stored in your .env.local file.'}
            </p>
            <div className="h-px bg-brand-border mb-8" />
            {tab === 'password' ? <PasswordTab /> : <ApiKeysTab />}
          </div>
        </div>
      </main>
    </div>
  )
}
