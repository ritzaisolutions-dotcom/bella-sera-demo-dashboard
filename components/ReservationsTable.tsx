'use client'

import { useState, useMemo } from 'react'
import type { Reservation, ReservationStatus } from '@/lib/supabase'
import StatusBadge from './StatusBadge'

interface ReservationsTableProps {
  reservations: Reservation[]
}

const STATUS_OPTIONS: { value: ReservationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
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
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
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
        <h2 className="text-base font-semibold">
          Reservations
          <span className="ml-2 text-zinc-500 font-normal text-sm">({filtered.length})</span>
        </h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | 'all')}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm
                     text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 cursor-pointer"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {['Date', 'Time', 'Name', 'Phone', 'Party', 'Notes', 'Status', 'Marketing'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-500">
                  No reservations found
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.date)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{formatTime(r.time)}</td>
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{r.name}</td>
                  <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{r.phone}</td>
                  <td className="px-4 py-3 text-center">{r.party_size}</td>
                  <td className="px-4 py-3 text-zinc-400 max-w-[200px] truncate">
                    {r.notes || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.marketing_consent ? (
                      <span className="text-green-400 text-xs font-medium">Yes</span>
                    ) : (
                      <span className="text-zinc-500 text-xs">No</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-zinc-500 py-12">No reservations found</p>
        ) : (
          filtered.map((r) => (
            <div
              key={r.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {formatDate(r.date)} at {formatTime(r.time)}
                  </p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
                <span>{r.phone}</span>
                <span>
                  {r.party_size} {r.party_size === 1 ? 'person' : 'people'}
                </span>
                {r.marketing_consent && (
                  <span className="text-green-400 text-xs font-medium">Marketing: Yes</span>
                )}
              </div>
              {r.notes && (
                <p className="text-xs text-zinc-500 border-t border-zinc-800 pt-2">{r.notes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
