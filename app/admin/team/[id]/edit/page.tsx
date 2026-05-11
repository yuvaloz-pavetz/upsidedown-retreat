import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import TeamMemberForm from '@/components/admin/TeamMemberForm'
import type { TeamMember } from '@/lib/supabase/types'

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('team_members').select('*').eq('id', id).single()
  if (!data) notFound()
  const member = data as TeamMember

  return (
    <AdminShell>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/admin/team"
          style={{ color: 'rgba(212,168,83,0.6)', fontSize: '0.8rem', textDecoration: 'none' }}
        >
          ← Team
        </Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#e2e8f0', marginTop: '0.75rem' }}>
          {member.name}
        </h1>
      </div>
      <TeamMemberForm initial={member} />
    </AdminShell>
  )
}
