import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const PIXEL_ID = '430648098492875'

function hash(value: string) {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

export async function POST(req: NextRequest) {
  const accessToken = process.env.META_CAPI_TOKEN
  if (!accessToken) {
    return NextResponse.json({ ok: false, error: 'META_CAPI_TOKEN not set' }, { status: 500 })
  }

  const body = await req.json() as {
    event_name: string
    event_time?: number
    event_source_url?: string
    email?: string
    phone?: string
    first_name?: string
    last_name?: string
    client_ip?: string
    client_user_agent?: string
    fbc?: string
    fbp?: string
    custom_data?: Record<string, unknown>
  }

  const ip = body.client_ip ?? req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? undefined
  const ua = body.client_user_agent ?? req.headers.get('user-agent') ?? undefined

  const userData: Record<string, string | undefined> = {
    client_ip_address: ip,
    client_user_agent: ua,
    fbc: body.fbc,
    fbp: body.fbp,
  }
  if (body.email) userData.em = hash(body.email)
  if (body.phone) userData.ph = hash(body.phone.replace(/\D/g, ''))
  if (body.first_name) userData.fn = hash(body.first_name)
  if (body.last_name) userData.ln = hash(body.last_name)

  const payload = {
    data: [{
      event_name: body.event_name,
      event_time: body.event_time ?? Math.floor(Date.now() / 1000),
      event_source_url: body.event_source_url,
      action_source: 'website',
      user_data: userData,
      custom_data: body.custom_data,
    }],
  }

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  )

  const json = await res.json()
  if (!res.ok) {
    console.error('Meta CAPI error:', json)
    return NextResponse.json({ ok: false, error: json }, { status: 500 })
  }

  return NextResponse.json({ ok: true, result: json })
}
