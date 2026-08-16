import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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

function emailEn(firstName: string, url: string, retreatDesc?: string) {
  return {
    subject: 'Please fill in your details for the retreat',
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
    <p style="color:#555;line-height:1.75;margin:0 0 14px;font-size:15px">
      We're getting closer to the retreat${retreatDesc ? ` ${retreatDesc}` : ''}!
    </p>
    <p style="color:#555;line-height:1.75;margin:0 0 32px;font-size:15px">
      Please take 2&nbsp;minutes to fill in your personal details — gear sizes, dietary needs, and more — so we can prepare everything perfectly for you.
    </p>
    <div style="text-align:center;margin-bottom:32px">
      <a href="${url}" style="display:inline-block;background:#D4A853;color:#0B1D2A;padding:15px 38px;text-decoration:none;font-weight:700;border-radius:5px;font-size:15px;letter-spacing:0.03em">
        Fill in my details →
      </a>
    </div>
    <p style="font-size:12px;color:#aaa;line-height:1.6;margin:0">
      This link is personal to you. You can return and update your details at any time before the retreat.
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

function emailHe(firstName: string, url: string, retreatDesc?: string) {
  return {
    subject: 'מלאו את הפרטים שלכם לריטריט',
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
    <p style="color:#555;line-height:1.85;margin:0 0 14px;font-size:15px">
      אנחנו מתקרבים לריטריט${retreatDesc ? ` ${retreatDesc}` : ''}!
    </p>
    <p style="color:#555;line-height:1.85;margin:0 0 32px;font-size:15px">
      אנחנו מבקשים שתקדישו כ-2 דקות למילוי פרטים אישיים — מידות ציוד, העדפות תזונה ועוד — כדי שנוכל להכין הכול עבורכם.
    </p>
    <div style="text-align:center;margin-bottom:32px">
      <a href="${url}" style="display:inline-block;background:#D4A853;color:#0B1D2A;padding:15px 38px;text-decoration:none;font-weight:700;border-radius:5px;font-size:15px">
        → מלאו את הפרטים שלי
      </a>
    </div>
    <p style="font-size:12px;color:#aaa;line-height:1.6;margin:0">
      הקישור הזה אישי עבורכם. אפשר לחזור ולעדכן את הפרטים בכל עת לפני הריטריט.
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

export async function POST(req: NextRequest) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as {
    email: string; first_name: string; event_slug?: string
    locale?: string; sendEmail?: boolean
  }
  const { email, first_name, event_slug, locale = 'en', sendEmail = true } = body

  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

  const admin = createAdminClient()

  // Reuse existing token to avoid invalidating previously sent links
  const { data: existing } = await admin
    .from('leads')
    .select('intake_token')
    .eq('email', email)
    .not('intake_token', 'is', null)
    .limit(1)
    .maybeSingle()

  const token: string = existing?.intake_token ?? crypto.randomUUID()

  if (!existing?.intake_token) {
    const { error } = await admin.from('leads').update({ intake_token: token }).eq('email', email)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const url = `https://upsidedown-retreat.com/intake/${token}`

  // Look up retreat for human-readable description in email
  let retreatDescHe: string | undefined
  let retreatDescEn: string | undefined
  if (event_slug) {
    const { data: retreat } = await admin
      .from('retreats')
      .select('location_en, location_he, dates_en, dates_he')
      .eq('slug', event_slug)
      .maybeSingle()
    if (retreat) {
      const locHe = retreat.location_he?.split(',')[0]?.trim()
      const locEn = retreat.location_en?.split(',')[0]?.trim()
      retreatDescHe = locHe ? `ב${locHe}${retreat.dates_he ? `, ${retreat.dates_he}` : ''}` : undefined
      retreatDescEn = locEn ? `in ${locEn}${retreat.dates_en ? `, ${retreat.dates_en}` : ''}` : undefined
    }
  }

  if (sendEmail) {
    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'BREVO_API_KEY not configured' }, { status: 500 })

    const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'noreply@upsidedown-retreat.com'
    const isHe = locale === 'he'
    const { subject, html } = isHe
      ? emailHe(first_name, url, retreatDescHe)
      : emailEn(first_name, url, retreatDescEn)
    const replyToEmail = isHe ? 'gil@upsidedown-retreat.com' : 'yuval@upsidedown-retreat.com'
    const replyToName  = isHe ? 'Gil | UpsideDown Retreat'   : 'Yuval | UpsideDown Retreat'

    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        sender: { name: 'UpsideDown Retreat', email: senderEmail },
        replyTo: { email: replyToEmail, name: replyToName },
        to: [{ email, name: first_name }],
        subject,
        htmlContent: html,
      }),
    })

    if (!brevoRes.ok) {
      const text = await brevoRes.text()
      return NextResponse.json({ error: `Brevo: ${text}` }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, token, url })
}
