import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

const LOGO = 'https://upsidedown-retreat.com/images/UpsideDown%20Retreat%20-%20LOGO.png'

function buildHtml(toName: string, fromName: string, url: string, he: boolean) {
  return he
    ? `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif;direction:rtl">
<div style="max-width:560px;margin:32px auto;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1)">
  <div style="background:#0B1D2A;padding:32px 40px;text-align:center">
    <img src="${LOGO}" alt="UpsideDown Retreat" style="max-height:54px;max-width:180px"/>
    <p style="margin:10px 0 0;color:#D4A853;font-size:10px;letter-spacing:.15em;text-transform:uppercase">ריטריט צלילה חופשית</p>
  </div>
  <div style="background:#fff;padding:40px;direction:rtl;text-align:right">
    <h2 style="margin:0 0 14px;color:#0B1D2A;font-size:21px;font-weight:700">שלום ${toName},</h2>
    <p style="color:#555;line-height:1.85;margin:0 0 14px;font-size:15px">${fromName} הזמין/ה אותך להצטרף לריטריט ורוצה שתשלים/י את הפרטים שלך.</p>
    <p style="color:#555;line-height:1.85;margin:0 0 32px;font-size:15px">אנחנו מבקשים שתקדיש/י 2 דקות למילוי פרטים אישיים — מידות ציוד, העדפות תזונה ועוד.</p>
    <div style="text-align:center;margin-bottom:32px">
      <a href="${url}" style="display:inline-block;background:#D4A853;color:#0B1D2A;padding:15px 38px;text-decoration:none;font-weight:700;border-radius:5px;font-size:15px">→ מלא/י את הפרטים שלי</a>
    </div>
    <p style="font-size:12px;color:#aaa">הקישור אישי עבורך. אפשר לחזור ולעדכן בכל עת.</p>
  </div>
  <div style="background:#f8f8f8;padding:18px 40px;text-align:center;border-top:1px solid #eee">
    <p style="margin:0;font-size:12px;color:#bbb">UpsideDown Retreat &nbsp;·&nbsp; <a href="mailto:hi@upsidedown-retreat.com" style="color:#D4A853;text-decoration:none">hi@upsidedown-retreat.com</a></p>
  </div>
</div></body></html>`
    : `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:32px auto;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1)">
  <div style="background:#0B1D2A;padding:32px 40px;text-align:center">
    <img src="${LOGO}" alt="UpsideDown Retreat" style="max-height:54px;max-width:180px"/>
    <p style="margin:10px 0 0;color:#D4A853;font-size:10px;letter-spacing:.22em;text-transform:uppercase">FREEDIVING RETREAT</p>
  </div>
  <div style="background:#fff;padding:40px">
    <h2 style="margin:0 0 14px;color:#0B1D2A;font-size:21px;font-weight:700">Hi ${toName},</h2>
    <p style="color:#555;line-height:1.75;margin:0 0 14px;font-size:15px">${fromName} invited you to join the retreat and asked us to send you this form.</p>
    <p style="color:#555;line-height:1.75;margin:0 0 32px;font-size:15px">Please take 2 minutes to fill in your personal details — gear sizes, dietary needs, etc.</p>
    <div style="text-align:center;margin-bottom:32px">
      <a href="${url}" style="display:inline-block;background:#D4A853;color:#0B1D2A;padding:15px 38px;text-decoration:none;font-weight:700;border-radius:5px;font-size:15px">Fill in my details →</a>
    </div>
    <p style="font-size:12px;color:#aaa">This link is personal to you. You can return and update at any time.</p>
  </div>
  <div style="background:#f8f8f8;padding:18px 40px;text-align:center;border-top:1px solid #eee">
    <p style="margin:0;font-size:12px;color:#bbb">UpsideDown Retreat &nbsp;·&nbsp; <a href="mailto:hi@upsidedown-retreat.com" style="color:#D4A853;text-decoration:none">hi@upsidedown-retreat.com</a></p>
  </div>
</div></body></html>`
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const admin = createAdminClient()

  const { data: payer } = await admin
    .from('leads')
    .select('id, first_name, event_slug, locale')
    .eq('intake_token', token)
    .limit(1)
    .maybeSingle()

  if (!payer) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })

  const body = await req.json() as {
    type: 'fill' | 'invite'
    first_name: string; last_name: string; email?: string; locale?: string
    height?: number | null; weight?: number | null; shoe_size?: string | null
    has_dive_gear?: boolean; gear_items?: string[]; food_allergies?: string | null
  }
  const { type, first_name, last_name, email, locale = payer.locale ?? 'en', ...health } = body

  if (!first_name?.trim() || !last_name?.trim())
    return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const { data: existing } = await admin
    .from('leads')
    .select('id, intake_token')
    .eq('companion_of', payer.id)
    .eq('event_slug', payer.event_slug)
    .limit(1)
    .maybeSingle()

  const companionToken = existing?.intake_token ?? crypto.randomUUID()

  const record: Record<string, unknown> = {
    first_name: first_name.trim(), last_name: last_name.trim(),
    email: email?.trim() ?? '', phone: '', locale, notes: '',
    event_slug: payer.event_slug, status: 'paid', amount: '',
    companion_of: payer.id, receipt_issued: false, intake_token: companionToken,
  }
  if (type === 'fill') {
    Object.assign(record, { ...health, intake_submitted_at: new Date().toISOString() })
  }

  if (existing) {
    const { error } = await admin.from('leads').update(record).eq('id', existing.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { error } = await admin.from('leads').insert(record)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (type === 'invite' && email?.trim()) {
    const apiKey = process.env.BREVO_API_KEY
    const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'noreply@upsidedown-retreat.com'
    const formUrl = `https://upsidedown-retreat.com/intake/${companionToken}`
    if (apiKey) {
      const isHe = locale === 'he'
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({
          sender: { name: 'UpsideDown Retreat', email: senderEmail },
          replyTo: { email: 'hi@upsidedown-retreat.com', name: 'UpsideDown Retreat' },
          to: [{ email: email.trim(), name: first_name.trim() }],
          subject: isHe ? 'מלאו את הפרטים שלכם לריטריט' : 'Please fill in your details for the retreat',
          htmlContent: buildHtml(first_name.trim(), payer.first_name, formUrl, isHe),
        }),
      })
    }
  }

  return NextResponse.json({ ok: true, companion_token: companionToken })
}
