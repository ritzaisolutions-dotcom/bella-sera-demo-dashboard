import { createClient } from '@supabase/supabase-js'

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Reservation {
  id: string
  created_at: string
  date: string
  time: string
  name: string
  phone: string
  party_size: number
  notes: string | null
  status: ReservationStatus
  marketing_consent: boolean
}

export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Use service role key (bypasses RLS) if available, otherwise fall back to anon key
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(url, key)
}
