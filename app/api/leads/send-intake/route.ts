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

export async function POST(req: NextRequest) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email, first_name, event_slug } = await req.json() as {
    email: string
    first_name: string
    event_slug?: string
  }

  if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

  const token = crypto.randomUUID()
  const admin = createAdminClient()

  // Save token to all leads for this email
  const { error } = await admin.from('leads').update({ intake_token: token }).eq('email', email)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? 'noreply@upsidedown-retreat.com'
  const formUrl = `https://upsidedown-retreat.com/en/intake/${token}`

  if (apiKey) {
    const html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a2a3a">
        <h2 style="margin-bottom:8px">Hi ${first_name},</h2>
        <p style="color:#444;line-height:1.6">
          We're getting closer to the retreat${event_slug ? ` (${event_slug})` : ''}!
          Please take 2 minutes to fill out your personal details so we can prepare everything for you.
        </p>
        <p style="margin:28px 0">
          <a href="${formUrl}"
             style="display:inline-block;background:#D4A853;color:#0B1D2A;padding:14px 32px;text-decoration:none;font-weight:700;border-radius:4px;font-size:15px">
            Fill in my details
          </a>
        </p>
        <p style="font-size:12px;color:#888">
          This link is personal to you. You can fill in the form at any time before the retreat.
        </p>
      </div>
    `
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        sender: { name: 'UpsideDown Retreat', email: senderEmail },
        to: [{ email, name: first_name }],
        subject: 'Please fill in your details for the retreat',
        htmlContent: html,
      }),
    })
  }

  return NextResponse.json({ ok: true, token })
}
