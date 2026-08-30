import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { ELIGIBLE_LEAD_STATUSES, getTransferSchedule, formatTransferDateTime } from '@/lib/transfer-config'
import crypto from 'crypto'

async function requireAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

const LOGO = 'https://upsidedown-retreat.com/images/UpsideDown%20Retreat%20-%20LOGO.png'

type Kind = 'initial' | 'reminder' | 'test'

function scheduleLine(eventSlug: string, locale: string): string {
  const schedule = getTransferSchedule(eventSlug)
  if (!schedule) return ''
  const arrival = formatTransferDateTime(schedule.arrivalDateTime, locale)
  const departure = formatTransferDateTime(schedule.departureDateTime, locale)
  return locale === 'he'
    ? `הסעת הגעה — ${schedule.airport} ← החווה — ${arrival} (המיקום המדויק יישלח בקבוצת הוואטסאפ). הסעת עזיבה — החווה ← ${schedule.airport} — ${departure}`
    : `Arrival transfer — ${schedule.airport} → the farm — ${arrival} (exact meeting point shared in the WhatsApp group). Departure transfer — the farm → ${schedule.airport} — ${departure}`
}

function emailEn(firstName: string, url: string, kind: Kind, eventSlug: string) {
  const heading = kind === 'reminder' ? "Reminder — let us know about your airport transfer" : 'Need a lift to or from the airport?'
  const body = kind === 'reminder'
    ? `We haven't heard back from you yet about the airport transfer. Let us know if you need a seat — it only takes a minute.`
    : `We run a group transfer to and from the airport for the retreat. ${scheduleLine(eventSlug, 'en')}. Let us know if you'd like a seat on either ride — it only takes a minute.`
  return {
    subject: kind === 'reminder' ? 'Reminder: airport transfer for the retreat' : 'Airport transfer for the retreat',
    html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:32px auto;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10)">
  <div style="background:#0B1D2A;padding:36px 40px 28px;text-align:center">
    <div style="display:inline-block;background:#fff;padding:8px 14px;border-radius:6px">
      <img src="${LOGO}" alt="UpsideDown Retreat" style="max-height:48px;max-width:170px;display:block" />
    </div>
    <p style="margin:10px 0 0;color:#D4A853;font-size:13px;letter-spacing:0.18em;text-transform:uppercase">THE UPSIDE DOWN RETREAT</p>
  </div>
  <div style="background:#ffffff;padding:40px">
    <h2 style="margin:0 0 14px;color:#0B1D2A;font-size:21px;font-weight:700">Hi ${firstName},</h2>
    <p style="color:#555;line-height:1.75;margin:0 0 14px;font-size:15px">${heading}</p>
    <p style="color:#555;line-height:1.75;margin:0 0 32px;font-size:15px">${body}</p>
    <div style="text-align:center;margin-bottom:32px">
      <a href="${url}" style="display:inline-block;background:#D4A853;color:#0B1D2A;padding:15px 38px;text-decoration:none;font-weight:700;border-radius:5px;font-size:15px;letter-spacing:0.03em">
        Tell us your plans →
      </a>
    </div>
    <p style="font-size:12px;color:#aaa;line-height:1.6;margin:0">
      This link is personal to you. You can return and update your answer at any time before the retreat.
    </p>
  </div>
  <div style="background:#f8f8f8;padding:18px 40px;text-align:center;border-top:1px solid #eee">
    <p style="margin:0;font-size:12px;color:#bbb">UpsideDown Retreat &nbsp;·&nbsp;
      <a href="mailto:hi@upsidedown-retreat.com" style="color:#D4A853;text-decoration:none">hi@upsidedown-retreat.com</a>
    </p>
  </div>
</div>
</body></html>`,
  }
}

function emailHe(firstName: string, url: string, kind: Kind, eventSlug: string) {
  const heading = kind === 'reminder' ? 'תזכורת — נשמח לדעת לגבי ההסעה שלכם' : 'צריכים הסעה משדה התעופה?'
  const body = kind === 'reminder'
    ? 'עדיין לא קיבלנו תשובה מכם לגבי ההסעה משדה התעופה. ספרו לנו אם תרצו מקום — זה לוקח דקה.'
    : `אנחנו מפעילים הסעה קבוצתית משדה התעופה ובחזרה אליו לריטריט. ${scheduleLine(eventSlug, 'he')}. ספרו לנו אם תרצו מקום באחת הנסיעות או בשתיהן — זה לוקח דקה.`
  return {
    subject: kind === 'reminder' ? 'תזכורת: הסעה משדה התעופה לריטריט' : 'הסעה משדה התעופה לריטריט',
    html: `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif;direction:rtl">
<div style="max-width:560px;margin:32px auto;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10)">
  <div style="background:#0B1D2A;padding:36px 40px 28px;text-align:center">
    <div style="display:inline-block;background:#fff;padding:8px 14px;border-radius:6px">
      <img src="${LOGO}" alt="UpsideDown Retreat" style="max-height:48px;max-width:170px;display:block" />
    </div>
    <p style="margin:10px 0 0;color:#D4A853;font-size:13px;letter-spacing:0.12em">הריטריט ההפוך</p>
  </div>
  <div style="background:#ffffff;padding:40px;direction:rtl;text-align:right">
    <h2 style="margin:0 0 14px;color:#0B1D2A;font-size:21px;font-weight:700">שלום ${firstName},</h2>
    <p style="color:#555;line-height:1.85;margin:0 0 14px;font-size:15px">${heading}</p>
    <p style="color:#555;line-height:1.85;margin:0 0 32px;font-size:15px">${body}</p>
    <div style="text-align:center;margin-bottom:32px">
      <a href="${url}" style="display:inline-block;background:#D4A853;color:#0B1D2A;padding:15px 38px;text-decoration:none;font-weight:700;border-radius:5px;font-size:15px">
        → שליחת התוכניות שלי
      </a>
    </div>
    <p style="font-size:12px;color:#aaa;line-height:1.6;margin:0">
      הקישור הזה אישי עבורכם. אפשר לחזור ולעדכן את התשובה בכל עת לפני הריטריט.
    </p>
  </div>
  <div style="background:#f8f8f8;padding:18px 40px;text-align:center;border-top:1px solid #eee">
    <p style="margin:0;font-size:12px;color:#bbb">UpsideDown Retreat &nbsp;·&nbsp;
      <a href="mailto:hi@upsidedown-retreat.com" style="color:#D4A853;text-decoration:none">hi@upsidedown-retreat.com</a>
    </p>
  </div>
</div>
</body></html>`,
  }
}

interface TargetLead {
  id: string; first_name: string; last_name: string; email: string; locale: string
  event_slug: string; status: string; person_type: string | null
  intake_token: string | null; transfer_submitted_at: string | null
}

async function ensureToken(admin: ReturnType<typeof createAdminClient>, lead: TargetLead): Promise<string> {
  if (lead.intake_token) return lead.intake_token
  const token = crypto.randomUUID()
  await admin.from('leads').update({ intake_token: token }).eq('id', lead.id)
  return token
}

export async function POST(req: NextRequest) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({})) as {
    kind?: Kind
    eventSlug?: string
    leadIds?: string[]
    confirm?: boolean
    testEmail?: string
    testLeadId?: string
  }
  const kind: Kind = body.kind ?? 'initial'
  const confirm = body.confirm === true
  const admin = createAdminClient()

  // Test send: render for one chosen person (or a sample), always to testEmail, never touches submission status.
  if (kind === 'test') {
    if (!body.testEmail) return NextResponse.json({ error: 'Missing testEmail' }, { status: 400 })

    let sample: { first_name: string; locale: string; intake_token: string | null; event_slug: string } = {
      first_name: 'Alex', locale: 'en', intake_token: null, event_slug: body.eventSlug ?? '',
    }
    if (body.testLeadId) {
      const { data } = await admin.from('leads').select('first_name, locale, intake_token, event_slug').eq('id', body.testLeadId).maybeSingle()
      if (data) sample = data
    }
    const token = sample.intake_token ?? 'preview-token'
    const url = `https://upsidedown-retreat.com/transfer/${token}`
    const { subject, html } = sample.locale === 'he' ? emailHe(sample.first_name, url, 'initial', sample.event_slug) : emailEn(sample.first_name, url, 'initial', sample.event_slug)

    if (!confirm) {
      return NextResponse.json({ preview: { to: body.testEmail, subject, html, url } })
    }

    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'BREVO_API_KEY not configured' }, { status: 500 })
    const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'noreply@upsidedown-retreat.com'

    let status: 'sent' | 'failed' = 'sent'
    let errText: string | undefined
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({
          sender: { name: 'UpsideDown Retreat', email: senderEmail },
          replyTo: { email: 'hi@upsidedown-retreat.com', name: 'UpsideDown Retreat' },
          to: [{ email: body.testEmail }],
          subject: `[TEST] ${subject}`,
          htmlContent: html,
        }),
      })
      if (!res.ok) { status = 'failed'; errText = await res.text() }
    } catch (e) {
      status = 'failed'; errText = String(e)
    }

    await admin.from('transfer_email_log').insert({
      lead_id: body.testLeadId ?? null, email: body.testEmail, kind: 'test', status, error: errText ?? null, sent_by: caller.id,
    })

    return NextResponse.json({ ok: status === 'sent', error: errText })
  }

  // initial / reminder — bulk send to eligible people
  let query = admin
    .from('leads')
    .select('id, first_name, last_name, email, locale, event_slug, status, person_type, intake_token, transfer_submitted_at')
  if (body.eventSlug) query = query.eq('event_slug', body.eventSlug)
  if (body.leadIds?.length) query = query.in('id', body.leadIds)

  const { data: leads, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Explicit leadIds bypass the eligibility filter — same convention as the T-shirt send route.
  const eligible = (body.leadIds?.length ? (leads ?? []) : (leads ?? []).filter(l =>
    l.person_type === 'staff' || (ELIGIBLE_LEAD_STATUSES as readonly string[]).includes(l.status)
  )) as TargetLead[]

  // Reminders only go to people who have not yet submitted.
  const targets = kind === 'reminder' ? eligible.filter(l => !l.transfer_submitted_at) : eligible

  if (!confirm) {
    // Dry-run: no emails sent, no tokens minted, no log rows written.
    const preview = targets.slice(0, 3).map(l => {
      const url = `https://upsidedown-retreat.com/transfer/${l.intake_token ?? '(token generated on send)'}`
      const { subject, html } = l.locale === 'he' ? emailHe(l.first_name, url, kind, l.event_slug) : emailEn(l.first_name, url, kind, l.event_slug)
      return { name: `${l.first_name} ${l.last_name}`, email: l.email, url, subject, html }
    })
    return NextResponse.json({
      dryRun: true,
      recipientCount: targets.length,
      recipients: targets.map(l => ({ id: l.id, name: `${l.first_name} ${l.last_name}`, email: l.email, personType: l.person_type ?? 'participant' })),
      preview,
    })
  }

  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'BREVO_API_KEY not configured' }, { status: 500 })
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'noreply@upsidedown-retreat.com'

  const results: { email: string; ok: boolean; error?: string }[] = []
  for (const lead of targets) {
    const token = await ensureToken(admin, lead)
    const url = `https://upsidedown-retreat.com/transfer/${token}`
    const { subject, html } = lead.locale === 'he' ? emailHe(lead.first_name, url, kind, lead.event_slug) : emailEn(lead.first_name, url, kind, lead.event_slug)

    let status: 'sent' | 'failed' = 'sent'
    let errText: string | undefined
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({
          sender: { name: 'UpsideDown Retreat', email: senderEmail },
          replyTo: { email: 'hi@upsidedown-retreat.com', name: 'UpsideDown Retreat' },
          to: [{ email: lead.email, name: lead.first_name }],
          subject,
          htmlContent: html,
        }),
      })
      if (!res.ok) { status = 'failed'; errText = await res.text() }
    } catch (e) {
      status = 'failed'; errText = String(e)
    }

    await admin.from('transfer_email_log').insert({
      lead_id: lead.id, email: lead.email, kind, status, error: errText ?? null, sent_by: caller.id,
    })
    results.push({ email: lead.email, ok: status === 'sent', error: errText })
  }

  return NextResponse.json({ sent: results.filter(r => r.ok).length, total: results.length, results })
}

export async function GET() {
  // Read-only: recent delivery log for the admin UI.
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('transfer_email_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ logs: data ?? [] })
}
