import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('leads')
    .select('id, first_name, last_name, locale, event_slug, transfer_arrival, transfer_departure, transfer_large_luggage, transfer_flight_info, transfer_submitted_at')
    .eq('intake_token', token)
    .limit(1)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'Invalid link' }, { status: 404 })
  return NextResponse.json({ person: data })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = createAdminClient()

  const { data: existing } = await admin
    .from('leads')
    .select('id')
    .eq('intake_token', token)
    .limit(1)
    .maybeSingle()

  if (!existing) return NextResponse.json({ error: 'Invalid link' }, { status: 404 })

  const body = await req.json() as {
    transfer_arrival?: boolean | null
    transfer_departure?: boolean | null
    transfer_large_luggage?: boolean | null
    transfer_flight_info?: string | null
  }
  const { transfer_arrival, transfer_departure, transfer_large_luggage, transfer_flight_info } = body

  if (typeof transfer_arrival !== 'boolean' || typeof transfer_departure !== 'boolean') {
    return NextResponse.json({ error: 'Invalid selection' }, { status: 400 })
  }

  // Unlike T-shirt size, a transfer answer is specific to this retreat —
  // update only this lead row, never every row sharing the person's email.
  const { error } = await admin.from('leads').update({
    transfer_arrival,
    transfer_departure,
    transfer_large_luggage: (transfer_arrival || transfer_departure) ? (transfer_large_luggage ?? null) : null,
    transfer_flight_info: transfer_flight_info || null,
    transfer_submitted_at: new Date().toISOString(),
    transfer_source: 'participant',
  }).eq('id', existing.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
