'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  fontFamily: 'inherit',
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
  const fileRef = useRef<HTMLInputElement>(null)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [lang, setLang] = useState<'en' | 'he'>('en')

  const [form, setForm] = useState({
    name:    initial?.name    ?? '',
    role:    initial?.role    ?? '',
    bio:     initial?.bio     ?? '',
    name_he: initial?.name_he ?? '',
    role_he: initial?.role_he ?? '',
    bio_he:  initial?.bio_he  ?? '',
    photo_url:     initial?.photo_url     ?? '',
    display_order: initial?.display_order ?? 0,
    active:        initial?.active        ?? true,
  })

  function set(field: string, value: string | number | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/team/upload', { method: 'POST', body: fd })
    const json = await res.json() as { url?: string; error?: string }
    setUploading(false)
    if (json.error) { setError(json.error); return }
    if (json.url) set('photo_url', json.url)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.role.trim()) {
      setError('English name and role are required.'); return
    }
    setSaving(true)
    setError('')
    const payload: TeamMemberInsert = {
      name:          form.name.trim(),
      role:          form.role.trim(),
      bio:           form.bio.trim(),
      name_he:       form.name_he.trim(),
      role_he:       form.role_he.trim(),
      bio_he:        form.bio_he.trim(),
      photo_url:     form.photo_url.trim() || null,
      display_order: Number(form.display_order),
      active:        form.active,
    }
    const url = '/api/admin/team'
    const method = initial ? 'PATCH' : 'POST'
    const body = initial ? JSON.stringify({ id: initial.id, ...payload }) : JSON.stringify(payload)
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body })
    const json = await res.json() as { error?: string }
    if (json.error) { setError(json.error); setSaving(false); return }
    router.push('/admin/team')
    router.refresh()
  }

  async function handleDelete() {
    if (!initial) return
    if (!confirm(`Delete ${initial.name}? This cannot be undone.`)) return
    setDeleting(true)
    const res = await fetch(`/api/admin/team?id=${encodeURIComponent(initial.id)}`, { method: 'DELETE' })
    const json = await res.json() as { error?: string }
    if (json.error) { setError(json.error); setDeleting(false); return }
    router.push('/admin/team')
    router.refresh()
  }

  const isHe = lang === 'he'

  return (
    <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Language tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '0.75rem' }}>
        {(['en', 'he'] as const).map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            padding: '0.35rem 1rem', borderRadius: '5px', fontSize: '0.78rem',
            fontWeight: 500, cursor: 'pointer', border: 'none',
            background: lang === l ? 'rgba(212,168,83,0.15)' : 'transparent',
            color: lang === l ? '#D4A853' : 'rgba(226,232,240,0.35)',
            letterSpacing: '0.05em',
          }}>
            {l === 'en' ? 'English' : 'עברית'}
          </button>
        ))}
      </div>

      {/* Name */}
      <div>
        <label style={labelStyle}>{isHe ? 'שם *' : 'Name *'}</label>
        <input
          dir={isHe ? 'rtl' : undefined}
          style={fieldStyle}
          value={isHe ? form.name_he : form.name}
          onChange={e => set(isHe ? 'name_he' : 'name', e.target.value)}
          placeholder={isHe ? 'למשל: שרה כהן' : 'e.g. Sarah Cohen'}
        />
      </div>

      {/* Role */}
      <div>
        <label style={labelStyle}>{isHe ? 'תפקיד *' : 'Role *'}</label>
        <input
          dir={isHe ? 'rtl' : undefined}
          style={fieldStyle}
          value={isHe ? form.role_he : form.role}
          onChange={e => set(isHe ? 'role_he' : 'role', e.target.value)}
          placeholder={isHe ? 'למשל: מדריכת צלילה חופשית' : 'e.g. Freediving Instructor'}
        />
      </div>

      {/* Bio */}
      <div>
        <label style={labelStyle}>{isHe ? 'ביוגרפיה' : 'Bio'}</label>
        <textarea
          dir={isHe ? 'rtl' : undefined}
          style={{ ...fieldStyle, minHeight: '120px', resize: 'vertical', lineHeight: 1.6 }}
          value={isHe ? form.bio_he : form.bio}
          onChange={e => set(isHe ? 'bio_he' : 'bio', e.target.value)}
          placeholder={isHe ? 'תיאור קצר…' : 'Short description about this person…'}
        />
      </div>

      {/* Photo upload */}
      <div>
        <label style={labelStyle}>Photo</label>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Preview */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '6px', flexShrink: 0,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {form.photo_url
              ? <img src={form.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: 'rgba(226,232,240,0.15)', fontSize: '1.6rem' }}>◈</span>
            }
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{
                padding: '0.55rem 1.1rem', borderRadius: '6px', fontSize: '0.8rem', cursor: uploading ? 'wait' : 'pointer',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: uploading ? 'rgba(226,232,240,0.35)' : 'rgba(226,232,240,0.65)',
                alignSelf: 'flex-start',
              }}
            >
              {uploading ? 'Uploading…' : form.photo_url ? 'Replace photo' : 'Upload photo'}
            </button>
            {form.photo_url && !uploading && (
              <button
                type="button"
                onClick={() => set('photo_url', '')}
                style={{ background: 'none', border: 'none', color: 'rgba(248,113,113,0.5)', fontSize: '0.72rem', cursor: 'pointer', padding: 0, alignSelf: 'flex-start' }}
              >
                Remove photo
              </button>
            )}
            <p style={{ fontSize: '0.7rem', color: 'rgba(226,232,240,0.22)', margin: 0 }}>
              jpg · png · webp · avif
            </p>
          </div>
        </div>
      </div>

      {/* Display order + status */}
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

      {error && <p style={{ color: '#f87171', fontSize: '0.82rem' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          onClick={handleSave}
          disabled={saving || uploading}
          style={{
            padding: '0.65rem 1.6rem', background: '#D4A853', color: '#0B1D2A',
            border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600,
            cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
            opacity: (saving || uploading) ? 0.7 : 1,
          }}
        >
          {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Member'}
        </button>

        {initial && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: '0.65rem 1.2rem', background: 'none', color: '#f87171',
              border: '1px solid rgba(248,113,113,0.3)', borderRadius: '6px', fontSize: '0.82rem',
              cursor: deleting ? 'not-allowed' : 'pointer', opacity: deleting ? 0.6 : 1,
            }}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        )}
      </div>
    </div>
  )
}
