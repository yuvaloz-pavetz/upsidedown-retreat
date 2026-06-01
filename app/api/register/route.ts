import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

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
