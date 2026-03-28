import type { ReservationStatus } from '@/lib/supabase'

interface StatusBadgeProps {
  status: ReservationStatus
}

const statusConfig: Record<ReservationStatus, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-green-400/10 text-green-400 border border-green-400/20',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-400/10 text-red-400 border border-red-400/20',
  },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
