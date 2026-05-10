import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import RetreatForm from '@/components/admin/RetreatForm'
import type { RetreatRow } from '@/lib/supabase/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditRetreatPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('retreats')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

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
          Edit: {(data as RetreatRow).title_en}
        </h1>
      </div>
      <RetreatForm retreat={data as RetreatRow} />
    </AdminShell>
  )
}
