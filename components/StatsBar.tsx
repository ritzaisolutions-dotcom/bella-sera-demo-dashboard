import type { Reservation } from '@/lib/supabase'

interface StatsBarProps {
  reservations: Reservation[]
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function startOfWeek(d: Date): Date {
  const day = d.getDay() // 0=Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Mon start
  return new Date(d.getFullYear(), d.getMonth(), diff)
}

export default function StatsBar({ reservations }: StatsBarProps) {
  const now = new Date()
  const todayStart = startOfDay(now)
  const weekStart = startOfWeek(now)

  const todayCovers = reservations
    .filter((r) => {
      if (!r.date) return false
      const d = new Date(r.date + 'T00:00:00')
      return d >= todayStart && d < new Date(todayStart.getTime() + 86400000)
    })
    .reduce((sum, r) => sum + (r.party_size ?? 0), 0)

  const thisWeekCount = reservations.filter((r) => {
    if (!r.date) return false
    const d = new Date(r.date + 'T00:00:00')
    return d >= weekStart && d <= now
  }).length

  const pendingCount = reservations.filter((r) => r.status === 'pending').length

  const stats = [
    {
      label: "Today's covers",
      value: todayCovers.toString(),
      sub: 'guests booked today',
    },
    {
      label: 'This week',
      value: thisWeekCount.toString(),
      sub: 'reservations',
    },
    {
      label: 'Awaiting confirmation',
      value: pendingCount.toString(),
      sub: 'pending',
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
