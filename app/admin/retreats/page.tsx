import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import type { RetreatRow } from '@/lib/supabase/types'

const STATUS_COLORS: Record<string, string> = {
  open: '#4ade80',
  'last-spots': '#D4A853',
  'coming-soon': '#60a5fa',
  'sold-out': '#f87171',
  past: 'rgba(226,232,240,0.3)',
}

export default async function RetreatsListPage() {
  const supabase = await createClient()
  const { data: retreats } = await supabase
    .from('retreats')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('year', { ascending: false })

  return (
    <AdminShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#e2e8f0', margin: 0 }}>Retreats</h1>
        <Link
          href="/admin/retreats/new"
          style={{
            padding: '0.6rem 1.4rem',
            background: '#D4A853',
            color: '#0d1520',
            borderRadius: '4px',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          + New Retreat
        </Link>
      </div>

      {!retreats || retreats.length === 0 ? (
        <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.9rem' }}>
          No retreats yet. Create your first one.
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Name', 'Location', 'Dates', 'Spots', 'Status', ''].map(h => (
                <th key={h} style={{
                  textAlign: 'left',
                  padding: '0.6rem 1rem',
                  color: 'rgba(226,232,240,0.35)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 400,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(retreats as RetreatRow[]).map((r) => (
              <tr
                key={r.id}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <td style={{ padding: '1rem', color: '#e2e8f0' }}>
                  <div style={{ fontWeight: 500 }}>{r.title_en}</div>
                  <div style={{ color: 'rgba(226,232,240,0.35)', fontSize: '0.78rem', marginTop: '2px' }}>{r.slug}</div>
                </td>
                <td style={{ padding: '1rem', color: 'rgba(226,232,240,0.65)' }}>{r.location_en}</td>
                <td style={{ padding: '1rem', color: 'rgba(226,232,240,0.65)' }}>{r.dates_en}</td>
                <td style={{ padding: '1rem', color: 'rgba(226,232,240,0.65)' }}>
                  {r.spots_remaining} / {r.spots_total}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '99px',
                    fontSize: '0.7rem',
                    letterSpacing: '0.06em',
                    background: `${STATUS_COLORS[r.status]}18`,
                    color: STATUS_COLORS[r.status],
                    border: `1px solid ${STATUS_COLORS[r.status]}40`,
                  }}>
                    {r.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link
                    href={`/admin/retreats/${r.id}/edit`}
                    style={{
                      color: 'rgba(212,168,83,0.7)',
                      fontSize: '0.78rem',
                      textDecoration: 'none',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AdminShell>
  )
}
