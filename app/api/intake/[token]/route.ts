import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('leads')
    .select('id, first_name, last_name, email, event_slug, height, weight, shoe_size, has_dive_gear, gear_items, food_allergies, intake_submitted_at')
    .eq('intake_token', token)
    .limit(1)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'Invalid link' }, { status: 404 })
  return NextResponse.json({ lead: data })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = createAdminClient()

  // Verify token exists
  const { data: existing } = await admin
    .from('leads')
    .select('id, email')
    .eq('intake_token', token)
    .limit(1)
    .maybeSingle()

  if (!existing) return NextResponse.json({ error: 'Invalid link' }, { status: 404 })

  const body = await req.json() as {
    height?: number
    weight?: number
    shoe_size?: string
    has_dive_gear?: boolean
    gear_items?: string[]
    food_allergies?: string
  }

  // Update all leads for this email
  const { error } = await admin.from('leads').update({
    ...body,
    intake_submitted_at: new Date().toISOString(),
  }).eq('email', existing.email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
