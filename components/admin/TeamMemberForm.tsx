'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { TeamMember, TeamMemberInsert } from '@/lib/supabase/types'

interface TeamMemberFormProps {
  initial?: TeamMember
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.9rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  color: '#e2e8f0',
  fontSize: '0.88rem',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'rgba(226,232,240,0.5)',
  marginBottom: '0.4rem',
  fontWeight: 500,
}

export default function TeamMemberForm({ initial }: TeamMemberFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: initial?.name ?? '',
    role: initial?.role ?? '',
    bio: initial?.bio ?? '',
    photo_url: initial?.photo_url ?? '',
    display_order: initial?.display_order ?? 0,
    active: initial?.active ?? true,
  })

  function set(field: string, value: string | number | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.role.trim()) {
      setError('Name and role are required.')
      return
    }
    setSaving(true)
    setError('')
    const supabase = createClient()
    const payload: TeamMemberInsert = {
      name: form.name.trim(),
      role: form.role.trim(),
      bio: form.bio.trim(),
      photo_url: form.photo_url.trim() || null,
      display_order: Number(form.display_order),
      active: form.active,
    }
    if (initial) {
      const { error: err } = await supabase.from('team_members').update(payload).eq('id', initial.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('team_members').insert(payload)
      if (err) { setError(err.message); setSaving(false); return }
    }
    router.push('/admin/team')
    router.refresh()
  }

  async function handleDelete() {
    if (!initial) return
    if (!confirm(`Delete ${initial.name}? This cannot be undone.`)) return
    setDeleting(true)
    const supabase = createClient()
    const { error: err } = await supabase.from('team_members').delete().eq('id', initial.id)
    if (err) { setError(err.message); setDeleting(false); return }
    router.push('/admin/team')
    router.refresh()
  }

  return (
    <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label style={labelStyle}>Name *</label>
        <input
          style={fieldStyle}
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="e.g. Sarah Cohen"
        />
      </div>

      <div>
        <label style={labelStyle}>Role *</label>
        <input
          style={fieldStyle}
          value={form.role}
          onChange={e => set('role', e.target.value)}
          placeholder="e.g. Freediving Instructor"
        />
      </div>

      <div>
        <label style={labelStyle}>Bio</label>
        <textarea
          style={{ ...fieldStyle, minHeight: '120px', resize: 'vertical', lineHeight: 1.6 }}
          value={form.bio}
          onChange={e => set('bio', e.target.value)}
          placeholder="Short description about this person…"
        />
      </div>

      <div>
        <label style={labelStyle}>Photo URL</label>
        <input
          style={fieldStyle}
          value={form.photo_url}
          onChange={e => set('photo_url', e.target.value)}
          placeholder="https://…"
          type="url"
        />
        <p style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.3)', marginTop: '0.35rem' }}>
          Upload your photo to any image host and paste the URL here.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Display Order</label>
          <input
            style={fieldStyle}
            type="number"
            value={form.display_order}
            onChange={e => set('display_order', e.target.value)}
            min={0}
          />
        </div>
        <div>
          <label style={labelStyle}>Status</label>
          <select
            style={{ ...fieldStyle, cursor: 'pointer' }}
            value={form.active ? 'active' : 'hidden'}
            onChange={e => set('active', e.target.value === 'active')}
          >
            <option value="active">Active (visible)</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: '0.82rem' }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '0.65rem 1.6rem',
            background: '#D4A853',
            color: '#0B1D2A',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Member'}
        </button>

        {initial && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: '0.65rem 1.2rem',
              background: 'none',
              color: '#f87171',
              border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: '6px',
              fontSize: '0.82rem',
              cursor: deleting ? 'not-allowed' : 'pointer',
              opacity: deleting ? 0.6 : 1,
            }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  )
}
