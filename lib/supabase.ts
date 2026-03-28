import { createClient } from '@supabase/supabase-js'

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Reservation {
  id: string
  created_at: string
  date: string | null
  time: string | null
  name: string | null
  email: string | null
  phone: string | null
  party_size: number | null
  notes: string | null
  status: ReservationStatus | null
  marketing_consent: boolean | null
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
