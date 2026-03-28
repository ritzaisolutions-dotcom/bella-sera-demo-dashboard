import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { isAuthenticatedFromRequest } from '@/lib/auth'
import type { ReservationStatus } from '@/lib/supabase'

const VALID_STATUSES: ReservationStatus[] = ['pending', 'confirmed', 'cancelled']

export async function GET(request: NextRequest) {
  if (!isAuthenticatedFromRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const statusFilter = searchParams.get('status') as ReservationStatus | null

  if (statusFilter && !VALID_STATUSES.includes(statusFilter)) {
    return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 })
  }

  try {
    const supabase = createServerSupabaseClient()

    let query = supabase
      .from('reservations')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
