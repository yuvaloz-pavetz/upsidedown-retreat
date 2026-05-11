import Link from 'next/link'
import AdminShell from '@/components/admin/AdminShell'
import TeamMemberForm from '@/components/admin/TeamMemberForm'

export default function NewTeamMemberPage() {
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
          Add Team Member
        </h1>
      </div>
      <TeamMemberForm />
    </AdminShell>
  )
}
