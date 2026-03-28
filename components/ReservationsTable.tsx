'use client'

import { useState, useMemo, useCallback } from 'react'
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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return '—'
  const [hours, minutes] = timeStr.split(':')
  const date = new Date()
  date.setHours(parseInt(hours, 10), parseInt(minutes, 10))
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function exportCsv(rows: Reservation[]) {
  const headers = ['Date', 'Time', 'Name', 'Email', 'Phone', 'Party Size', 'Notes', 'Status', 'Marketing Consent']
  const escape = (v: string | number | boolean | null | undefined) => {
    if (v == null) return ''
    const str = String(v)
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str
  }
  const csvRows = [
    headers.join(','),
    ...rows.map((r) =>
      [
        r.date ?? '',
        r.time ?? '',
        r.name ?? '',
        r.email ?? '',
        r.phone ?? '',
        r.party_size ?? '',
        r.notes ?? '',
        r.status ?? '',
        r.marketing_consent ? 'Yes' : 'No',
      ]
        .map(escape)
        .join(',')
    ),
  ]
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reservations-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ReservationsTable({ reservations }: ReservationsTableProps) {
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() => {
    let list = reservations
    if (statusFilter !== 'all') list = list.filter((r) => r.status === statusFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.phone?.toLowerCase().includes(q)
      )
    }
    if (dateFrom) list = list.filter((r) => r.date && r.date >= dateFrom)
    if (dateTo) list = list.filter((r) => r.date && r.date <= dateTo)
    return list
  }, [reservations, statusFilter, search, dateFrom, dateTo])

  const clearFilters = useCallback(() => {
    setStatusFilter('all')
    setSearch('')
    setDateFrom('')
    setDateTo('')
  }, [])

  const hasFilters = statusFilter !== 'all' || search.trim() || dateFrom || dateTo

  const inputClass =
    'bg-brand-surface border border-brand-border rounded-lg px-4 py-2 text-xs text-brand-text ' +
    'placeholder-brand-muted focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition'

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-brand-gold text-xs uppercase tracking-widest font-medium mb-0.5">Table</p>
          <h3 className="font-serif text-lg text-brand-text">
            All Reservations{' '}
            <span className="text-brand-muted font-sans text-sm font-normal">({filtered.length})</span>
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone…"
            className={`${inputClass} w-48`}
          />

          {/* Date from */}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="From date"
            className={`${inputClass} w-36 cursor-pointer`}
          />

          {/* Date to */}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            title="To date"
            className={`${inputClass} w-36 cursor-pointer`}
          />

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | 'all')}
            className={`${inputClass} uppercase tracking-widest cursor-pointer`}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-xs uppercase tracking-widest text-brand-muted border border-brand-border
                         rounded-lg hover:text-brand-text hover:border-brand-gold/40 transition"
            >
              Clear
            </button>
          )}

          {/* CSV export */}
          <button
            onClick={() => exportCsv(filtered)}
            disabled={filtered.length === 0}
            className="px-4 py-2 text-xs uppercase tracking-widest bg-brand-gold/10 text-brand-gold
                       border border-brand-gold/30 rounded-lg hover:bg-brand-gold/20 transition
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-brand-gold via-brand-gold/40 to-transparent opacity-30" />

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-brand-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-border bg-brand-surface">
              {['Date', 'Time', 'Name', 'Email', 'Phone', 'Party', 'Notes', 'Status', 'Marketing'].map((h) => (
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
                <td colSpan={9} className="px-4 py-20 text-center">
                  <EmptyState hasFilters={!!hasFilters} onClear={clearFilters} />
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-brand-surface/60 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap text-brand-text">{formatDate(r.date)}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-brand-muted">{formatTime(r.time)}</td>
                  <td className="px-4 py-3.5 font-medium text-brand-text whitespace-nowrap">{r.name || '—'}</td>
                  <td className="px-4 py-3.5 text-brand-muted whitespace-nowrap">{r.email || '—'}</td>
                  <td className="px-4 py-3.5 text-brand-muted whitespace-nowrap">{r.phone || '—'}</td>
                  <td className="px-4 py-3.5 text-center text-brand-text">{r.party_size ?? '—'}</td>
                  <td className="px-4 py-3.5 text-brand-muted max-w-[180px] truncate">
                    {r.notes || <span className="text-brand-border">—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    {r.status ? <StatusBadge status={r.status} /> : '—'}
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
          <div className="py-12 text-center">
            <EmptyState hasFilters={!!hasFilters} onClear={clearFilters} />
          </div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="bg-brand-surface border border-brand-border rounded-xl p-4 space-y-3 relative overflow-hidden">
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
                <span>{r.party_size ?? '—'} {r.party_size === 1 ? 'guest' : 'guests'}</span>
                {r.marketing_consent && (
                  <span className="text-brand-green text-xs font-medium">Marketing ✓</span>
                )}
              </div>
              {r.notes && (
                <p className="text-xs text-brand-muted border-t border-brand-border pt-2 italic">{r.notes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  if (hasFilters) {
    return (
      <div className="space-y-3">
        <p className="font-serif italic text-lg text-brand-muted">No reservations match your filters</p>
        <button
          onClick={onClear}
          className="text-brand-gold text-xs uppercase tracking-widest hover:text-brand-gold-light transition"
        >
          Clear filters
        </button>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      <p className="font-serif italic text-lg text-brand-muted">No reservations yet</p>
      <a
        href="https://bellaserademo.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-brand-gold text-xs uppercase tracking-widest border-b border-brand-gold/40
                   hover:border-brand-gold transition"
      >
        View booking form
      </a>
    </div>
  )
}
