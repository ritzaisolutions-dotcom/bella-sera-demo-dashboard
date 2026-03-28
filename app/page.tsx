import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase'
import StatsBar from '@/components/StatsBar'
import ReservationsTable from '@/components/ReservationsTable'
import type { Reservation } from '@/lib/supabase'

async function getReservations(): Promise<Reservation[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('date', { ascending: true })
    .order('time', { ascending: true })

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
    <div className="min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Bella Sera</h1>
          <a
            href="/api/auth/logout"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition"
          >
            Sign out
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <StatsBar reservations={reservations} />
        <ReservationsTable reservations={reservations} />
      </main>
    </div>
  )
}
