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
    { label: 'Reservations this month', value: totalReservations.toString() },
    { label: 'Total covers this month', value: totalCovers.toString() },
    { label: 'Marketing consent rate', value: `${marketingRate}%` },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4"
        >
          <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
            {stat.label}
          </p>
          <p className="text-3xl font-bold mt-1.5 tabular-nums">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
