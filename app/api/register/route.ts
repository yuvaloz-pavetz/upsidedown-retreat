import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const LOGO = 'https://upsidedown-retreat.com/images/UpsideDown%20Retreat%20-%20LOGO.png'
const REPLY_TO = 'upsidedownretreat@gmail.com'

function buildConfirmationEmail(firstName: string, locale: string): string {
  const isHe = locale === 'he'
  if (isHe) {
    return `<!DOCTYPE html><html lang="he" dir="rtl"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif;direction:rtl">
<div style="max-width:560px;margin:32px auto;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1)">
  <div style="background:#0B1D2A;padding:32px 40px;text-align:center">
    <img src="${LOGO}" alt="UpsideDown Retreat" style="max-height:54px;max-width:180px"/>
    <p style="margin:10px 0 0;color:#D4A853;font-size:10px;letter-spacing:.15em;text-transform:uppercase">ריטריט צלילה חופשית</p>
  </div>
  <div style="background:#fff;padding:40px;direction:rtl;text-align:right">
    <h2 style="margin:0 0 14px;color:#0B1D2A;font-size:21px;font-weight:700">שלום ${firstName},</h2>
    <p style="color:#555;line-height:1.85;margin:0 0 14px;font-size:15px">קיבלנו את הרשמתך — תודה!</p>
    <p style="color:#555;line-height:1.85;margin:0 0 32px;font-size:15px">ניצור קשר בקרוב עם פרטים נוספים על הריטריט ולגבי המשך התהליך.</p>
    <p style="color:#555;line-height:1.85;margin:0;font-size:15px">לשאלות — פשוט השב/י למייל הזה.</p>
  </div>
  <div style="background:#f8f8f8;padding:18px 40px;text-align:center;border-top:1px solid #eee">
    <p style="margin:0;font-size:12px;color:#bbb">UpsideDown Retreat &nbsp;·&nbsp; <a href="mailto:${REPLY_TO}" style="color:#D4A853;text-decoration:none">${REPLY_TO}</a></p>
  </div>
</div></body></html>`
  }
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif">
<div style="max-width:560px;margin:32px auto;border-radius:10px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1)">
  <div style="background:#0B1D2A;padding:32px 40px;text-align:center">
    <img src="${LOGO}" alt="UpsideDown Retreat" style="max-height:54px;max-width:180px"/>
    <p style="margin:10px 0 0;color:#D4A853;font-size:10px;letter-spacing:.22em;text-transform:uppercase">FREEDIVING RETREAT</p>
  </div>
  <div style="background:#fff;padding:40px">
    <h2 style="margin:0 0 14px;color:#0B1D2A;font-size:21px;font-weight:700">Hi ${firstName},</h2>
    <p style="color:#555;line-height:1.75;margin:0 0 14px;font-size:15px">We've received your registration — thank you!</p>
    <p style="color:#555;line-height:1.75;margin:0 0 32px;font-size:15px">We'll be in touch soon with more details about the retreat and next steps.</p>
    <p style="color:#555;line-height:1.75;margin:0;font-size:15px">Any questions? Just reply to this email.</p>
  </div>
  <div style="background:#f8f8f8;padding:18px 40px;text-align:center;border-top:1px solid #eee">
    <p style="margin:0;font-size:12px;color:#bbb">UpsideDown Retreat &nbsp;·&nbsp; <a href="mailto:${REPLY_TO}" style="color:#D4A853;text-decoration:none">${REPLY_TO}</a></p>
  </div>
</div></body></html>`
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ found: false })

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('leads')
    .select('first_name, last_name, phone')
    .eq('email', email)
    .limit(1)
    .maybeSingle()

  if (data) {
    return NextResponse.json({ found: true, first_name: data.first_name, last_name: data.last_name, phone: data.phone })
  }
  return NextResponse.json({ found: false })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      first_name: string
      last_name: string
      email: string
      phone?: string
      event_slug: string
      locale?: string
      default_amount?: string
      tier_name?: string
    }

    const { first_name, last_name, email, phone = '', event_slug, locale = 'en', default_amount = '', tier_name = '' } = body

    if (!first_name || !last_name || !email || !event_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error: dbError } = await supabase
      .from('leads')
      .insert({ first_name, last_name, email, phone, status: 'interested', amount: default_amount, event_slug, locale, notes: tier_name ? `Room: ${tier_name}` : '' })

    if (dbError) {
      if (dbError.code === '23505') {
        return NextResponse.json({ ok: true, duplicate: true })
      }
      console.error('Register DB error:', dbError)
      return NextResponse.json({ error: 'Could not save' }, { status: 500 })
    }

    const apiKey = process.env.BREVO_API_KEY
    const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'noreply@upsidedown-retreat.com'

    if (!apiKey) {
      console.error('Register: BREVO_API_KEY not set — email not sent')
    }

    if (apiKey) {
      const html = `
        <h2 style="margin-bottom:12px">New registration — ${event_slug}</h2>
        <table style="border-collapse:collapse;font-size:14px">
          <tr><td style="padding:6px 16px 6px 0;color:#666">Name</td><td style="padding:6px 0"><strong>${first_name} ${last_name}</strong></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Phone</td><td style="padding:6px 0">${phone || '—'}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Event</td><td style="padding:6px 0">${event_slug}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Room</td><td style="padding:6px 0">${tier_name || '—'}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Price</td><td style="padding:6px 0">${default_amount || '—'}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#666">Locale</td><td style="padding:6px 0">${locale}</td></tr>
        </table>
      `
      const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({
          sender: { name: 'UpsideDown Retreat', email: senderEmail },
          to: [{ email: 'yuvaloz@gmail.com' }, { email: 'Gilfox93@gmail.com' }],
          replyTo: { email, name: `${first_name} ${last_name}` },
          subject: `New registration: ${first_name} ${last_name} — ${event_slug}`,
          htmlContent: html,
        }),
      })
      if (!brevoRes.ok) {
        const brevoBody = await brevoRes.text()
        console.error('Register: Brevo error', brevoRes.status, brevoBody)
      }

      // Confirmation email to registrant
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({
          sender: { name: 'UpsideDown Retreat', email: senderEmail },
          to: [{ email, name: `${first_name} ${last_name}` }],
          replyTo: { email: REPLY_TO, name: 'UpsideDown Retreat' },
          subject: locale === 'he' ? 'קיבלנו את הרשמתך!' : 'Registration received!',
          htmlContent: buildConfirmationEmail(first_name, locale),
        }),
      }).catch(e => console.error('Register: confirmation email error', e))
    }

    // CAPI — Lead event (fire and forget, never block registration)
    if (process.env.META_CAPI_TOKEN) {
      const origin = req.headers.get('origin') ?? 'https://upsidedown-retreat.com'
      void fetch(`${origin}/api/meta/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'Lead',
          event_source_url: `${origin}/${locale}/events/${event_slug}`,
          email,
          phone,
          first_name,
          last_name,
          client_ip: req.headers.get('x-forwarded-for')?.split(',')[0] ?? undefined,
          client_user_agent: req.headers.get('user-agent') ?? undefined,
          custom_data: { event_slug, tier_name, currency: 'ILS', value: default_amount },
        }),
      }).catch((e) => console.error('CAPI Lead error:', e))
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Register route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
