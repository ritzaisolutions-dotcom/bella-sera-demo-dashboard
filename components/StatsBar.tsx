import type { Reservation } from '@/lib/supabase'

interface StatsBarProps {
  reservations: Reservation[]
}

function getThisMonthReservations(reservations: Reservation[]): Reservation[] {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  return reservations.filter((r) => {
    const d = new Date(r.date + 'T00:00:00')
    return d.getFullYear() === year && d.getMonth() === month
  })
}

export default function StatsBar({ reservations }: StatsBarProps) {
  const thisMonth = getThisMonthReservations(reservations)
  const totalReservations = thisMonth.length
  const totalCovers = thisMonth.reduce((sum, r) => sum + r.party_size, 0)
  const marketingCount = thisMonth.filter((r) => r.marketing_consent).length
  const marketingRate =
    totalReservations > 0
      ? Math.round((marketingCount / totalReservations) * 100)
      : 0

  const stats = [
    {
      label: 'Reservations this month',
      value: totalReservations.toString(),
      sub: 'bookings',
    },
    {
      label: 'Total covers this month',
      value: totalCovers.toString(),
      sub: 'guests',
    },
    {
      label: 'Marketing consent rate',
      value: `${marketingRate}%`,
      sub: 'opted in',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-brand-surface border border-brand-border rounded-xl px-6 py-5 relative overflow-hidden group"
        >
          {/* Subtle gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-40" />

          <p className="text-brand-muted text-xs uppercase tracking-widest font-medium">
            {stat.label}
          </p>
          <p className="text-4xl font-serif font-semibold text-brand-gold mt-2 tabular-nums">
            {stat.value}
          </p>
          <p className="text-brand-muted text-xs mt-1 uppercase tracking-wider">{stat.sub}</p>
        </div>
      ))}
    </div>
  )
}
