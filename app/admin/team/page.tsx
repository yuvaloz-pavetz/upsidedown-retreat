import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import type { TeamMember } from '@/lib/supabase/types'

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: members } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true })

  const rows = (members as TeamMember[]) ?? []

  return (
    <AdminShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#e2e8f0', margin: 0 }}>Team</h1>
        <Link
          href="/admin/team/new"
          style={{
            padding: '0.6rem 1.4rem',
            background: '#D4A853',
            color: '#0B1D2A',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          + Add Member
        </Link>
      </div>

      {rows.length === 0 ? (
        <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.9rem' }}>
          No team members yet. Add your first one.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {rows.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {m.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.photo_url}
                  alt={m.name}
                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                />
              )}
              {!m.photo_url && (
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.05)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(226,232,240,0.2)',
                    fontSize: '1.2rem',
                  }}
                >
                  ◈
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 500, margin: 0 }}>{m.name}</p>
                <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.78rem', margin: '0.15rem 0 0' }}>{m.role}</p>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  letterSpacing: '0.06em',
                  color: m.active ? '#4ade80' : 'rgba(226,232,240,0.3)',
                  textTransform: 'uppercase',
                }}
              >
                {m.active ? 'Active' : 'Hidden'}
              </span>
              <Link
                href={`/admin/team/${m.id}/edit`}
                style={{
                  padding: '0.4rem 0.9rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '5px',
                  color: 'rgba(226,232,240,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}
