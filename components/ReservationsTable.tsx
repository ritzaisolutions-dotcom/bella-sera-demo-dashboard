'use client'

import { useState, useMemo } from 'react'
import type { Reservation, ReservationStatus } from '@/lib/supabase'
import StatusBadge from './StatusBadge'

interface ReservationsTableProps {
  reservations: Reservation[]
}

const STATUS_OPTIONS: { value: ReservationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':')
  const date = new Date()
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10))
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export default function ReservationsTable({ reservations }: ReservationsTableProps) {
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all')

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return reservations
    return reservations.filter((r) => r.status === statusFilter)
  }, [reservations, statusFilter])

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-brand-gold text-xs uppercase tracking-widest font-medium mb-0.5">
            Table
          </p>
          <h3 className="font-serif text-lg text-brand-text">
            All Reservations{' '}
            <span className="text-brand-muted font-sans text-sm font-normal">
              ({filtered.length})
            </span>
          </h3>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | 'all')}
          className="bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-xs
                     text-brand-text uppercase tracking-widest focus:outline-none focus:border-brand-gold
                     focus:ring-1 focus:ring-brand-gold cursor-pointer transition"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-brand-gold via-brand-gold/40 to-transparent opacity-30" />

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-brand-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface">
              {['Date', 'Time', 'Name', 'Phone', 'Party', 'Notes', 'Status', 'Marketing'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-brand-gold uppercase tracking-widest whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center text-brand-muted font-serif italic text-lg">
                  No reservations found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-brand-surface/60 transition-colors group"
                >
                  <td className="px-4 py-3.5 whitespace-nowrap text-brand-text">{formatDate(r.date)}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-brand-muted">{formatTime(r.time)}</td>
                  <td className="px-4 py-3.5 font-medium text-brand-text whitespace-nowrap">{r.name}</td>
                  <td className="px-4 py-3.5 text-brand-muted whitespace-nowrap">{r.phone}</td>
                  <td className="px-4 py-3.5 text-center text-brand-text">{r.party_size}</td>
                  <td className="px-4 py-3.5 text-brand-muted max-w-[180px] truncate">
                    {r.notes || <span className="text-brand-border">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {r.marketing_consent ? (
                      <span className="text-brand-green text-xs font-medium tracking-wide">Yes</span>
                    ) : (
                      <span className="text-brand-border text-xs">No</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-brand-muted font-serif italic py-12">No reservations found</p>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="bg-brand-surface border border-brand-border rounded-xl p-4 space-y-3"
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-20" />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-brand-text">{r.name}</p>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {formatDate(r.date)} · {formatTime(r.time)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-muted">
                <span>{r.phone}</span>
                <span className="text-brand-border">·</span>
                <span>{r.party_size} {r.party_size === 1 ? 'guest' : 'guests'}</span>
                {r.marketing_consent && (
                  <span className="text-brand-green text-xs font-medium">Marketing ✓</span>
                )}
              </div>
              {r.notes && (
                <p className="text-xs text-brand-muted border-t border-brand-border pt-2 italic">
                  {r.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
