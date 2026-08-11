import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('leads')
    .select('id, first_name, last_name, email, event_slug, locale, height, weight, shoe_size, has_dive_gear, gear_items, food_allergies, dob, emergency_contact_name, emergency_contact_phone, photo_consent, intake_submitted_at')
    .eq('intake_token', token)
    .limit(1)
    .maybeSingle()

  if (error || !data) return NextResponse.json({ error: 'Invalid link' }, { status: 404 })
  return NextResponse.json({ lead: data })
}

const CONDITION_LABELS: Record<string, string> = {
  asthma: 'Asthma or respiratory condition',
  heart: 'Heart or cardiovascular condition',
  epilepsy: 'Epilepsy, seizures, or history of loss of consciousness',
  diabetes: 'Diabetes',
  surgery: 'Recent surgery or significant injury',
  pregnancy: 'Pregnancy',
  anxiety: 'Anxiety, panic disorder, or other condition that may affect participation',
  other: 'Other medical condition',
}

async function sendMedicalAlert(
  lead: { first_name: string; last_name: string; email: string; event_slug: string },
  yesKeys: string[],
  details: string,
) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) return
  const condList = yesKeys.map(k => `<li>${CONDITION_LABELS[k] ?? k}</li>`).join('')
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({
      sender: { name: 'UpsideDown System', email: process.env.BREVO_SENDER_EMAIL ?? 'noreply@upsidedown-retreat.com' },
      replyTo: { email: 'hi@upsidedown-retreat.com', name: 'UpsideDown Retreat' },
      to: [{ email: process.env.ADMIN_ALERT_EMAIL ?? 'hi@upsidedown-retreat.com' }],
      subject: `⚠️ Medical Note — ${lead.first_name} ${lead.last_name} (${lead.event_slug})`,
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto">
          <div style="background:#0B1D2A;padding:20px 28px;border-radius:8px 8px 0 0">
            <p style="color:#D4A853;margin:0;font-size:11px;letter-spacing:0.15em;text-transform:uppercase">UpsideDown Retreat — Medical Alert</p>
          </div>
          <div style="background:#fff;padding:24px 28px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none">
            <p style="margin:0 0 12px"><strong>${lead.first_name} ${lead.last_name}</strong> (${lead.email}) submitted their intake form for <strong>${lead.event_slug}</strong> and indicated <strong>Yes</strong> to the following:</p>
            <ul style="margin:0 0 16px;padding-left:20px;color:#b91c1c">${condList}</ul>
            ${details ? `<p style="margin:0 0 8px;font-weight:600">Details provided:</p><blockquote style="margin:0 0 16px;padding:10px 14px;background:#fef2f2;border-left:3px solid #f87171;border-radius:4px">${details}</blockquote>` : ''}
            <p style="margin:0;font-size:13px;color:#6b7280">Please review and follow up with the participant before the retreat.</p>
          </div>
        </div>`,
    }),
  })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = createAdminClient()

  const { data: existing } = await admin
    .from('leads')
    .select('id, email, first_name, last_name, event_slug')
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
    medical_notes?: string
    waiver_name?: string
    waiver_signature?: string
    dob?: string
    emergency_contact_name?: string
    emergency_contact_phone?: string
    photo_consent?: boolean
  }

  const { waiver_name, waiver_signature, ...rest } = body
  const now = new Date().toISOString()

  const { error } = await admin.from('leads').update({
    ...rest,
    intake_submitted_at: now,
    ...(waiver_name ? { waiver_name, waiver_signed_at: now } : {}),
    ...(waiver_signature ? { waiver_signature } : {}),
  }).eq('email', existing.email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Non-blocking medical alert
  if (body.medical_notes) {
    try {
      const med = JSON.parse(body.medical_notes) as { conditions?: Record<string, boolean>; details?: string }
      const yesKeys = Object.entries(med.conditions ?? {})
        .filter(([, v]) => v === true)
        .map(([k]) => k)
      if (yesKeys.length > 0) {
        void sendMedicalAlert(existing, yesKeys, med.details ?? '')
      }
    } catch { /* non-critical */ }
  }

  return NextResponse.json({ ok: true })
}
