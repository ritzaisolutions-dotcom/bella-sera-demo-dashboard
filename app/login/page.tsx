'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Logo from '@/components/Logo'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      const from = searchParams.get('from') || '/'
      router.push(from)
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Invalid password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #D4A847 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8B9E6B 0%, transparent 50%)',
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Logo size={52} showText={false} />
          <h1 className="font-serif text-3xl font-semibold text-brand-text mt-4 tracking-wide">
            Bella Sera
          </h1>
          <p className="text-brand-muted text-sm mt-1 tracking-widest uppercase text-xs">
            Reservations Dashboard
          </p>
          {/* Gold divider */}
          <div className="flex items-center gap-3 mt-4">
            <div className="h-px w-10 bg-brand-gold opacity-40" />
            <div className="w-1 h-1 rounded-full bg-brand-gold opacity-60" />
            <div className="h-px w-10 bg-brand-gold opacity-40" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-brand-gold uppercase tracking-widest mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-sm
                           text-brand-text placeholder-brand-muted focus:outline-none focus:border-brand-gold
                           focus:ring-1 focus:ring-brand-gold transition"
                placeholder="Enter password"
                required
                autoFocus
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-brand-bg rounded-lg py-3 text-sm font-semibold
                         uppercase tracking-widest hover:bg-brand-gold-light transition
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
