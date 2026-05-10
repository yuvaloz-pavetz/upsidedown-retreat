'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { RetreatRow, RetreatInsert, RetreatStatus } from '@/lib/supabase/types'

interface RetreatFormProps {
  retreat?: RetreatRow
}

const STATUS_OPTIONS: RetreatStatus[] = ['open', 'last-spots', 'coming-soon', 'sold-out', 'past']

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string
  items: string[]
  onChange: (items: string[]) => void
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={item}
              onChange={e => {
                const next = [...items]
                next[i] = e.target.value
                onChange(next)
              }}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              style={removeBtn}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ''])}
          style={addBtn}
        >
          + Add item
        </button>
      </div>
    </div>
  )
}

export default function RetreatForm({ retreat }: RetreatFormProps) {
  const router = useRouter()
  const isEdit = !!retreat

  const [form, setForm] = useState<RetreatInsert>({
    slug: retreat?.slug ?? '',
    status: retreat?.status ?? 'coming-soon',
    title_en: retreat?.title_en ?? '',
    title_he: retreat?.title_he ?? '',
    location_en: retreat?.location_en ?? '',
    location_he: retreat?.location_he ?? '',
    dates_en: retreat?.dates_en ?? '',
    dates_he: retreat?.dates_he ?? '',
    year: retreat?.year ?? new Date().getFullYear(),
    duration_en: retreat?.duration_en ?? '',
    duration_he: retreat?.duration_he ?? '',
    pricing_ils: retreat?.pricing_ils ?? '',
    pricing_eur: retreat?.pricing_eur ?? '',
    spots_remaining: retreat?.spots_remaining ?? 12,
    spots_total: retreat?.spots_total ?? 12,
    hero_image: retreat?.hero_image ?? '',
    gallery_images: retreat?.gallery_images ?? [],
    description_en: retreat?.description_en ?? '',
    description_he: retreat?.description_he ?? '',
    includes_en: retreat?.includes_en ?? [],
    includes_he: retreat?.includes_he ?? [],
    sort_order: retreat?.sort_order ?? 0,
  })

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof RetreatInsert>(key: K, value: RetreatInsert[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    const supabase = createClient()

    if (isEdit) {
      const { error } = await supabase
        .from('retreats')
        .update(form)
        .eq('id', retreat!.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('retreats').insert(form)
      if (error) { setError(error.message); setSaving(false); return }
    }

    router.push('/admin/retreats')
    router.refresh()
  }

  async function handleDelete() {
    if (!isEdit) return
    if (!confirm(`Delete "${form.title_en}"? This cannot be undone.`)) return
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('retreats').delete().eq('id', retreat!.id)
    if (error) { setError(error.message); setDeleting(false); return }
    router.push('/admin/retreats')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '900px' }}>
      {/* Basic info */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>Basic Info</h2>
        <div style={grid3}>
          <div>
            <label style={labelStyle}>Slug *</label>
            <input
              value={form.slug}
              onChange={e => set('slug', slugify(e.target.value))}
              required
              placeholder="crete-june-2025"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Status *</label>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value as RetreatStatus)}
              style={inputStyle}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Year *</label>
            <input
              type="number"
              value={form.year}
              onChange={e => set('year', Number(e.target.value))}
              required
              style={inputStyle}
            />
          </div>
        </div>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>Sort Order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={e => set('sort_order', Number(e.target.value))}
              style={inputStyle}
            />
          </div>
        </div>
      </section>

      {/* Title */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>Title</h2>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>English *</label>
            <input value={form.title_en} onChange={e => set('title_en', e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Hebrew *</label>
            <input value={form.title_he} onChange={e => set('title_he', e.target.value)} required dir="rtl" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Location */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>Location</h2>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>English *</label>
            <input value={form.location_en} onChange={e => set('location_en', e.target.value)} required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Hebrew *</label>
            <input value={form.location_he} onChange={e => set('location_he', e.target.value)} required dir="rtl" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Dates & Duration */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>Dates & Duration</h2>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>Dates EN *</label>
            <input value={form.dates_en} onChange={e => set('dates_en', e.target.value)} required placeholder="June 14–21, 2025" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Dates HE *</label>
            <input value={form.dates_he} onChange={e => set('dates_he', e.target.value)} required dir="rtl" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Duration EN *</label>
            <input value={form.duration_en} onChange={e => set('duration_en', e.target.value)} required placeholder="7 nights · 8 days" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Duration HE *</label>
            <input value={form.duration_he} onChange={e => set('duration_he', e.target.value)} required dir="rtl" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Pricing & Spots */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>Pricing & Spots</h2>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>Price ILS *</label>
            <input value={form.pricing_ils} onChange={e => set('pricing_ils', e.target.value)} required placeholder="₪3,500" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Price EUR *</label>
            <input value={form.pricing_eur} onChange={e => set('pricing_eur', e.target.value)} required placeholder="€890" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Spots Remaining *</label>
            <input type="number" value={form.spots_remaining} onChange={e => set('spots_remaining', Number(e.target.value))} required min={0} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Spots Total *</label>
            <input type="number" value={form.spots_total} onChange={e => set('spots_total', Number(e.target.value))} required min={1} style={inputStyle} />
          </div>
        </div>
      </section>

      {/* Images */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>Images</h2>
        <div>
          <label style={labelStyle}>Hero Image URL *</label>
          <input value={form.hero_image} onChange={e => set('hero_image', e.target.value)} required placeholder="/images/retreat-session.jpg" style={inputStyle} />
          {form.hero_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.hero_image} alt="hero preview" style={{ marginTop: '0.75rem', height: '120px', objectFit: 'cover', borderRadius: '4px', opacity: 0.8 }} />
          )}
        </div>
        <div style={{ marginTop: '1.25rem' }}>
          <label style={labelStyle}>Gallery Images (one URL per line)</label>
          <textarea
            value={form.gallery_images.join('\n')}
            onChange={e => set('gallery_images', e.target.value.split('\n').filter(Boolean))}
            rows={4}
            placeholder="/images/photo1.jpg&#10;/images/photo2.jpg"
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
      </section>

      {/* Description */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>Description</h2>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>English</label>
            <textarea
              value={form.description_en}
              onChange={e => set('description_en', e.target.value)}
              rows={7}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <div>
            <label style={labelStyle}>Hebrew</label>
            <textarea
              value={form.description_he}
              onChange={e => set('description_he', e.target.value)}
              rows={7}
              dir="rtl"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        </div>
      </section>

      {/* Includes */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>What's Included</h2>
        <div style={grid2}>
          <ListEditor
            label="English"
            items={form.includes_en}
            onChange={items => set('includes_en', items)}
          />
          <ListEditor
            label="Hebrew"
            items={form.includes_he}
            onChange={items => set('includes_he', items)}
          />
        </div>
      </section>

      {error && (
        <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1rem' }}>
        <button type="submit" disabled={saving} style={saveBtnStyle}>
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Retreat'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/retreats')}
          style={cancelBtnStyle}
        >
          Cancel
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{ ...cancelBtnStyle, marginLeft: 'auto', color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
          >
            {deleting ? 'Deleting…' : 'Delete Retreat'}
          </button>
        )}
      </div>
    </form>
  )
}

// Shared styles
const sectionStyle: React.CSSProperties = {
  marginBottom: '2.5rem',
  paddingBottom: '2.5rem',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
}

const sectionHeading: React.CSSProperties = {
  fontSize: '0.7rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(212,168,83,0.6)',
  fontWeight: 400,
  marginBottom: '1.25rem',
}

const grid2: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1.25rem',
}

const grid3: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: '1.25rem',
  marginBottom: '1.25rem',
}

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  letterSpacing: '0.06em',
  color: 'rgba(226,232,240,0.4)',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
}

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.8rem',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '4px',
  color: '#e2e8f0',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const removeBtn: React.CSSProperties = {
  padding: '0 0.6rem',
  background: 'rgba(248,113,113,0.08)',
  border: '1px solid rgba(248,113,113,0.2)',
  borderRadius: '4px',
  color: '#f87171',
  fontSize: '1rem',
  cursor: 'pointer',
  flexShrink: 0,
}

const addBtn: React.CSSProperties = {
  alignSelf: 'flex-start',
  background: 'none',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '4px',
  color: 'rgba(226,232,240,0.45)',
  fontSize: '0.78rem',
  padding: '0.4rem 0.8rem',
  cursor: 'pointer',
  marginTop: '0.25rem',
}

const saveBtnStyle: React.CSSProperties = {
  padding: '0.7rem 2rem',
  background: '#D4A853',
  border: 'none',
  borderRadius: '4px',
  color: '#0d1520',
  fontSize: '0.78rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  cursor: 'pointer',
}

const cancelBtnStyle: React.CSSProperties = {
  padding: '0.7rem 1.5rem',
  background: 'none',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '4px',
  color: 'rgba(226,232,240,0.45)',
  fontSize: '0.78rem',
  cursor: 'pointer',
}
