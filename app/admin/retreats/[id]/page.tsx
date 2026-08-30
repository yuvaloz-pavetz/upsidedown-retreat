import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import RetreatParticipants from '@/components/admin/RetreatParticipants'
import type { RetreatRow } from '@/lib/supabase/types'

interface Props {
  params: Promise<{ id: string }>
}

const STATUS_COLORS: Record<string, string> = {
  open: '#4ade80',
  'last-spots': '#D4A853',
  'coming-soon': '#60a5fa',
  'sold-out': '#f87171',
  past: 'rgba(226,232,240,0.3)',
}

const quickLinks = [
  { label: 'CRM', path: '/admin/crm' },
  { label: 'Waitlist', path: '/admin/customers' },
  { label: 'Budget', path: '/admin/budget' },
  { label: 'Equipment', path: '/admin/equipment' },
  { label: 'T-Shirts', path: '/admin/tshirt' },
  { label: 'Transfers', path: '/admin/transfers' },
]

export default async function RetreatHubPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('retreats')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()
  const retreat = data as RetreatRow

  return (
    <AdminShell>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/admin/retreats"
          style={{ color: 'rgba(212,168,83,0.6)', fontSize: '0.8rem', textDecoration: 'none' }}
        >
          ← Retreats
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#e2e8f0', margin: 0 }}>
            {retreat.title_en}
          </h1>
          <span style={{
            display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '99px',
            fontSize: '0.7rem', letterSpacing: '0.06em',
            background: `${STATUS_COLORS[retreat.status]}18`,
            color: STATUS_COLORS[retreat.status],
            border: `1px solid ${STATUS_COLORS[retreat.status]}40`,
          }}>
            {retreat.status}
          </span>
        </div>
        <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          {retreat.dates_en} · {retreat.location_en} · {retreat.spots_remaining} / {retreat.spots_total} spots
        </p>
        <Link
          href={`/admin/retreats/${id}/edit`}
          style={{
            display: 'inline-block', marginTop: '1rem',
            padding: '0.5rem 1.1rem', borderRadius: '4px',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(226,232,240,0.75)',
            fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none',
          }}
        >
          Edit details
        </Link>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem',
      }}>
        {quickLinks.map(({ label, path }) => (
          <Link
            key={path}
            href={`${path}?event=${retreat.slug}`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.5rem 1rem', borderRadius: '8px', textAlign: 'center',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none',
              transition: 'all 0.15s',
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontSize: '0.95rem', fontWeight: 500, color: '#e2e8f0', marginBottom: '1rem' }}>
          Registrations
        </h2>
        <RetreatParticipants slug={retreat.slug} />
      </div>
    </AdminShell>
  )
}
