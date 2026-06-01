import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { retreat_slug, retreat_title, retreat_dates, retreat_link } = await req.json() as {
      retreat_slug: string
      retreat_title: string
      retreat_dates: string
      retreat_link: string
    }

    if (!retreat_slug) {
      return NextResponse.json({ error: 'Missing retreat_slug' }, { status: 400 })
    }

    const { data: entries, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('retreat_slug', retreat_slug)
      .is('notified_at', null)

    if (error || !entries) {
      return NextResponse.json({ error: 'Could not fetch waitlist' }, { status: 500 })
    }

    if (entries.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 })
    }

    const apiKey = process.env.BREVO_API_KEY
    const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'noreply@upsidedown-retreat.com'
    const senderName = 'UpsideDown Retreat'

    if (!apiKey) {
      return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
    }

    let sent = 0
    for (const entry of entries) {
      const isHe = entry.locale === 'he'
      const subject = isHe
        ? `התפנה מקום — ${retreat_title}`
        : `A spot just opened — ${retreat_title}`
      const htmlContent = isHe
        ? `<p>שלום ${entry.name},</p>
<p>התפנה מקום בריטריט <strong>${retreat_title}</strong> (${retreat_dates}).</p>
<p>הרישום הוא על בסיס כל הקודם זוכה — לחצו כאן להירשם:</p>
<p><a href="${retreat_link}" style="display:inline-block;background:#D4A853;color:#0B1D2A;padding:12px 28px;text-decoration:none;font-weight:bold;border-radius:4px">להרשמה</a></p>
<p style="color:#999;font-size:12px">קיבלתם מייל זה כי נרשמתם לרשימת ההמתנה של UpsideDown Retreat.</p>`
        : `<p>Hi ${entry.name},</p>
<p>A spot just opened up in <strong>${retreat_title}</strong> (${retreat_dates}).</p>
<p>Registration is first-come, first-served — click below to secure your place:</p>
<p><a href="${retreat_link}" style="display:inline-block;background:#D4A853;color:#0B1D2A;padding:12px 28px;text-decoration:none;font-weight:bold;border-radius:4px">Register Now</a></p>
<p style="color:#999;font-size:12px">You received this because you joined the UpsideDown Retreat waitlist.</p>`

      const emailRes = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: entry.email, name: entry.name }],
          subject,
          htmlContent,
        }),
      })

      if (emailRes.ok) {
        sent++
        await supabase
          .from('waitlist')
          .update({ notified_at: new Date().toISOString() })
          .eq('id', entry.id)
      }
    }

    await supabase
      .from('retreats')
      .update({ status: 'last-spots' })
      .eq('slug', retreat_slug)

    return NextResponse.json({ ok: true, sent })
  } catch (err) {
    console.error('Waitlist notify error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
