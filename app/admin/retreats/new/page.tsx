import Link from 'next/link'
import AdminShell from '@/components/admin/AdminShell'
import RetreatForm from '@/components/admin/RetreatForm'

export default function NewRetreatPage() {
  return (
    <AdminShell>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/admin/retreats"
          style={{ color: 'rgba(212,168,83,0.6)', fontSize: '0.8rem', textDecoration: 'none' }}
        >
          ← Retreats
        </Link>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#e2e8f0', marginTop: '0.75rem' }}>
          New Retreat
        </h1>
      </div>
      <RetreatForm />
    </AdminShell>
  )
}
