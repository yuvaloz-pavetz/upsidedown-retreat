'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/AdminShell'

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'member'
  last_sign_in: string | null
  created_at: string
  invited: boolean
}

const cell: React.CSSProperties = {
  padding: '0.65rem 0.9rem',
  fontSize: '0.82rem',
  color: 'rgba(226,232,240,0.75)',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
  verticalAlign: 'middle',
}
const head: React.CSSProperties = {
  ...cell,
  color: 'rgba(226,232,240,0.3)',
  fontSize: '0.62rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: 500,
  paddingBottom: '0.5rem',
}
const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '4px',
  padding: '0.45rem 0.65rem',
  fontSize: '0.82rem',
  color: '#e2e8f0',
  outline: 'none',
  fontFamily: 'inherit',
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentId, setCurrentId] = useState<string | null>(null)

  const [showInvite, setShowInvite] = useState(false)
  const [invEmail, setInvEmail] = useState('')
  const [invName, setInvName] = useState('')
  const [invRole, setInvRole] = useState<'admin' | 'member'>('member')
  const [inviting, setInviting] = useState(false)
  const [invErr, setInvErr] = useState('')
  const [invOk, setInvOk] = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError('')
    const res = await fetch('/api/admin/users')
    const json = await res.json() as { users?: AdminUser[]; error?: string }
    if (json.error) { setError(json.error); setLoading(false); return }
    setUsers(json.users ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
    const supabase = createClient()
    void supabase.auth.getUser().then(({ data }) => setCurrentId(data.user?.id ?? null))
  }, [load])

  async function updateRole(id: string, role: 'admin' | 'member') {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
  }

  async function invite() {
    if (!invEmail) { setInvErr('Email required'); return }
    setInviting(true); setInvErr(''); setInvOk(false)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: invEmail, full_name: invName, role: invRole }),
    })
    const json = await res.json() as { ok?: boolean; error?: string }
    setInviting(false)
    if (json.error) { setInvErr(json.error); return }
    setInvOk(true)
    setInvEmail(''); setInvName(''); setInvRole('member')
    void load()
  }

  if (loading) return <AdminShell><p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.85rem' }}>Loading...</p></AdminShell>

  return (
    <AdminShell>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#e2e8f0', marginBottom: '0.3rem' }}>Users</h1>
        <p style={{ fontSize: '0.8rem', color: 'rgba(226,232,240,0.3)' }}>Manage admin access and roles</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: '#f87171' }}>
          {error.includes('SERVICE_ROLE_KEY') ? (
            <>Add <code style={{ background: 'rgba(255,255,255,0.08)', padding: '0 4px', borderRadius: 3 }}>SUPABASE_SERVICE_ROLE_KEY</code> to your environment variables (Vercel + .env.local), then redeploy.</>
          ) : error}
        </div>
      )}

      {/* Invite form */}
      <div style={{ marginBottom: '2rem' }}>
        {!showInvite ? (
          <button
            onClick={() => { setShowInvite(true); setInvOk(false) }}
            style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.25)', borderRadius: '6px', padding: '0.4rem 1rem', fontSize: '0.72rem', color: '#D4A853', cursor: 'pointer', letterSpacing: '0.06em' }}
          >
            + Invite user
          </button>
        ) : (
          <div style={{ background: '#0d1526', borderRadius: 8, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', maxWidth: '520px' }}>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.3)' }}>Invite new user</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <input value={invEmail} onChange={e => setInvEmail(e.target.value)} placeholder="Email *" type="email" style={{ ...inp }} />
              <input value={invName} onChange={e => setInvName(e.target.value)} placeholder="Full name" style={{ ...inp }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select value={invRole} onChange={e => setInvRole(e.target.value as 'admin' | 'member')} style={{ ...inp, cursor: 'pointer', color: invRole === 'admin' ? '#D4A853' : 'rgba(226,232,240,0.6)' }}>
                <option value="member" style={{ background: '#0d1526', color: '#e2e8f0' }}>Member</option>
                <option value="admin" style={{ background: '#0d1526', color: '#e2e8f0' }}>Admin</option>
              </select>
              <button onClick={invite} disabled={inviting} style={{ background: '#D4A853', border: 'none', borderRadius: 4, padding: '0.45rem 1.1rem', fontSize: '0.72rem', fontWeight: 600, color: '#0d1520', cursor: 'pointer' }}>
                {inviting ? '…' : 'Send invite'}
              </button>
              <button onClick={() => { setShowInvite(false); setInvErr(''); setInvOk(false) }} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '0.45rem 0.85rem', fontSize: '0.72rem', color: 'rgba(226,232,240,0.35)', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
            {invErr && <p style={{ fontSize: '0.72rem', color: '#f87171' }}>{invErr}</p>}
            {invOk && <p style={{ fontSize: '0.72rem', color: '#5A9A6F' }}>Invite sent. They&apos;ll get an email to set their password.</p>}
          </div>
        )}
      </div>

      {/* Users table */}
      {users.length > 0 && (
        <div style={{ background: '#0d1526', borderRadius: 8, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
            <thead>
              <tr>
                {['Name', 'Email', 'Role', 'Last sign-in', 'Status'].map(h => (
                  <th key={h} style={{ ...head, textAlign: 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={cell}>{u.full_name || '—'}</td>
                  <td style={cell}>
                    <span style={{ color: u.id === currentId ? '#D4A853' : 'rgba(226,232,240,0.75)' }}>{u.email}</span>
                    {u.id === currentId && <span style={{ fontSize: '0.6rem', color: 'rgba(212,168,83,0.5)', marginLeft: '0.4rem' }}>(you)</span>}
                  </td>
                  <td style={cell}>
                    {u.id === currentId ? (
                      <span style={{ fontSize: '0.72rem', color: '#D4A853', background: 'rgba(212,168,83,0.1)', borderRadius: 4, padding: '0.15rem 0.5rem' }}>Admin</span>
                    ) : (
                      <select
                        value={u.role}
                        onChange={e => updateRole(u.id, e.target.value as 'admin' | 'member')}
                        style={{ ...inp, padding: '0.25rem 0.5rem', fontSize: '0.72rem', cursor: 'pointer', color: u.role === 'admin' ? '#D4A853' : 'rgba(226,232,240,0.55)' }}
                      >
                        <option value="member" style={{ background: '#0d1526', color: '#e2e8f0' }}>Member</option>
                        <option value="admin" style={{ background: '#0d1526', color: '#e2e8f0' }}>Admin</option>
                      </select>
                    )}
                  </td>
                  <td style={{ ...cell, color: 'rgba(226,232,240,0.35)', fontSize: '0.75rem' }}>
                    {u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString() : '—'}
                  </td>
                  <td style={cell}>
                    {u.invited
                      ? <span style={{ fontSize: '0.68rem', color: '#D4A853', background: 'rgba(212,168,83,0.08)', borderRadius: 4, padding: '0.15rem 0.45rem' }}>Pending invite</span>
                      : <span style={{ fontSize: '0.68rem', color: '#5A9A6F', background: 'rgba(90,154,111,0.08)', borderRadius: 4, padding: '0.15rem 0.45rem' }}>Active</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  )
}
