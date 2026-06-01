import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function getOrCreateBrevoList(apiKey: string, name: string): Promise<number | null> {
  const listRes = await fetch('https://api.brevo.com/v3/contacts/lists', {
    headers: { 'api-key': apiKey, Accept: 'application/json' },
  })
  if (!listRes.ok) return null

  const { lists } = await listRes.json() as { lists: { id: number; name: string }[] }
  const existing = lists?.find((l) => l.name === name)
  if (existing) return existing.id

  const createRes = await fetch('https://api.brevo.com/v3/contacts/lists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({ name, folderId: 1 }),
  })
  if (!createRes.ok) return null
  const { id } = await createRes.json() as { id: number }
  return id
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, retreat_slug, locale } = await req.json() as {
      name: string; email: string; retreat_slug: string; locale: string
    }

    if (!name || !email || !retreat_slug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error: dbError } = await supabase
      .from('waitlist')
      .insert({ retreat_slug, name, email, locale: locale ?? 'en' })

    if (dbError) {
      if (dbError.code === '23505') {
        return NextResponse.json({ ok: true, duplicate: true })
      }
      console.error('Waitlist DB error:', dbError)
      return NextResponse.json({ error: 'Could not save' }, { status: 500 })
    }

    const apiKey = process.env.BREVO_API_KEY
    if (apiKey) {
      const listName = `Waitlist - ${retreat_slug}`
      const listId = await getOrCreateBrevoList(apiKey, listName)
      if (listId) {
        await fetch('https://api.brevo.com/v3/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
          body: JSON.stringify({
            email,
            attributes: { FIRSTNAME: name },
            listIds: [listId],
            updateEnabled: true,
          }),
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Waitlist route error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
