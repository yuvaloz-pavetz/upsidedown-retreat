import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function requireAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return null
  return user
}

export async function GET() {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.listUsers()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: profiles } = await admin.from('profiles').select('id, role, full_name')
    const profileMap = new Map((profiles ?? []).map((p: { id: string; role: string; full_name: string }) => [p.id, p]))

    const users = data.users.map(u => {
      const p = profileMap.get(u.id) as { role: string; full_name: string } | undefined
      return {
        id: u.id,
        email: u.email,
        full_name: p?.full_name ?? u.user_metadata?.full_name ?? '',
        role: p?.role ?? 'member',
        last_sign_in: u.last_sign_in_at,
        created_at: u.created_at,
        invited: !u.confirmed_at,
      }
    })

    return NextResponse.json({ users })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const caller = await requireAdmin()
  if (!caller) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { email, full_name, role } = await req.json() as { email: string; full_name: string; role: string }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
      data: { full_name },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    await admin.from('profiles').upsert({
      id: data.user.id,
      full_name: full_name ?? '',
      role: role === 'admin' ? 'admin' : 'member',
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Server error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
