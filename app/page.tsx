import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import StatsBar from '@/components/StatsBar'
import ReservationsTable from '@/components/ReservationsTable'
import Logo from '@/components/Logo'
import SignOutButton from '@/components/SignOutButton'
import type { Reservation } from '@/lib/supabase'

export const revalidate = 60

async function getReservations(): Promise<Reservation[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: false })

  if (error) {
    console.error('Failed to fetch reservations:', error)
    return []
  }

  return data || []
}

export default async function DashboardPage() {
  if (!isAuthenticated()) {
    redirect('/login')
  }

  const reservations = await getReservations()

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="border-b border-brand-border bg-brand-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size={32} />
          <nav className="flex items-center gap-1">
            <a
              href="/"
              className="px-4 py-2 text-xs uppercase tracking-widest text-brand-gold font-medium
                         border-b border-brand-gold"
            >
              Reservations
            </a>
            <a
              href="/settings"
              className="px-4 py-2 text-xs uppercase tracking-widest text-brand-muted hover:text-brand-text transition"
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
          <h2 className="font-serif text-2xl text-brand-text">Reservations</h2>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <StatsBar reservations={reservations} />
        <ReservationsTable reservations={reservations} />
      </main>
    </div>
  )
}
