'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { RetreatRow, RetreatInsert, RetreatStatus } from '@/lib/supabase/types'
import { SingleImageUploader, MultiImageUploader } from '@/components/admin/ImageUploader'
import TierEditor from '@/components/admin/TierEditor'
import type { PricingTier } from '@/lib/supabase/types'

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

  const [venueDescEn, setVenueDescEn] = useState(retreat?.venue_description_en ?? '')
  const [venueDescHe, setVenueDescHe] = useState(retreat?.venue_description_he ?? '')
  const [venueImages, setVenueImages] = useState<string[]>(retreat?.venue_images ?? [])
  const [whoForEn, setWhoForEn] = useState(retreat?.who_for_en ?? '')
  const [whoForHe, setWhoForHe] = useState(retreat?.who_for_he ?? '')
  const [igUrlsEn, setIgUrlsEn] = useState<string[]>(retreat?.instagram_urls_en ?? [])
  const [igUrlsHe, setIgUrlsHe] = useState<string[]>(retreat?.instagram_urls_he ?? [])
  const [tiers, setTiers] = useState<PricingTier[]>(retreat?.tiers ?? [])
  const [pricingMode, setPricingMode] = useState<'single' | 'tiers'>(
    retreat?.tiers && retreat.tiers.length > 0 ? 'tiers' : 'single'
  )

  const [earlyBird, setEarlyBird] = useState({
    enabled:      retreat?.early_bird_enabled      ?? false,
    discount_eur: retreat?.early_bird_discount_eur != null ? String(retreat.early_bird_discount_eur) : '',
    discount_ils: retreat?.early_bird_discount_ils != null ? String(retreat.early_bird_discount_ils) : '',
    spots:        retreat?.early_bird_spots        != null ? String(retreat.early_bird_spots) : '',
    deadline:     retreat?.early_bird_deadline     ?? '',
  })

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

    const activeTiers = pricingMode === 'tiers' ? tiers : []
    let pricingEur = form.pricing_eur
    if (pricingMode === 'tiers' && activeTiers.length > 0) {
      const nums = activeTiers.map(t => parseFloat(t.price_eur.replace(/[^0-9.]/g, ''))).filter(n => !isNaN(n))
      if (nums.length > 0) pricingEur = String(Math.min(...nums))
    }

    const payload = {
      ...form,
      pricing_eur: pricingEur,
      venue_description_en: venueDescEn,
      venue_description_he: venueDescHe,
      venue_images: venueImages,
      who_for_en: whoForEn,
      who_for_he: whoForHe,
      instagram_urls_en: igUrlsEn.filter(Boolean),
      instagram_urls_he: igUrlsHe.filter(Boolean),
      tiers: activeTiers,
      early_bird_enabled: earlyBird.enabled,
      early_bird_discount_eur: earlyBird.discount_eur ? Number(earlyBird.discount_eur) : null,
      early_bird_discount_ils: earlyBird.discount_ils ? Number(earlyBird.discount_ils) : null,
      early_bird_spots: earlyBird.spots ? Number(earlyBird.spots) : null,
      early_bird_deadline: earlyBird.deadline || null,
    }

    if (isEdit) {
      const { error } = await supabase.from('retreats').update(payload).eq('id', retreat!.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('retreats').insert(payload)
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

        {/* Mode toggle */}
        <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.35)', marginBottom: '0.75rem' }}>Pricing type</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setPricingMode('single')}
              style={{
                padding: '0.5rem 1.2rem', borderRadius: '4px', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s',
                border: `1px solid ${pricingMode === 'single' ? 'rgba(212,168,83,0.6)' : 'rgba(255,255,255,0.12)'}`,
                background: pricingMode === 'single' ? 'rgba(212,168,83,0.12)' : 'rgba(255,255,255,0.02)',
                color: pricingMode === 'single' ? '#D4A853' : 'rgba(226,232,240,0.55)',
                fontWeight: pricingMode === 'single' ? 600 : 400,
              }}
            >
              Single price
            </button>
            <button
              type="button"
              onClick={() => setPricingMode('tiers')}
              style={{
                padding: '0.5rem 1.2rem', borderRadius: '4px', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s',
                border: `1px solid ${pricingMode === 'tiers' ? 'rgba(212,168,83,0.6)' : 'rgba(255,255,255,0.12)'}`,
                background: pricingMode === 'tiers' ? 'rgba(212,168,83,0.12)' : 'rgba(255,255,255,0.02)',
                color: pricingMode === 'tiers' ? '#D4A853' : 'rgba(226,232,240,0.55)',
                fontWeight: pricingMode === 'tiers' ? 600 : 400,
              }}
            >
              Multiple tiers (rooms)
            </button>
          </div>
        </div>

        {pricingMode === 'single' && (
          <div style={{ ...grid2, marginBottom: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Price ILS <span style={{ color: 'rgba(232,213,183,0.3)', fontWeight: 400 }}>(optional)</span></label>
              <input value={form.pricing_ils ?? ''} onChange={e => set('pricing_ils', e.target.value)} placeholder="₪3,500 — leave empty for EUR only" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price EUR *</label>
              <input value={form.pricing_eur} onChange={e => set('pricing_eur', e.target.value)} placeholder="€890" style={inputStyle} />
            </div>
          </div>
        )}

        {pricingMode === 'tiers' && (
          <div style={{ marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.3)', marginBottom: '1rem' }}>
              Each room type has its own price. Early Bird discount is subtracted from whichever room the visitor selects.
            </p>
            <TierEditor tiers={tiers} onChange={setTiers} slug={form.slug} />
          </div>
        )}

        <div style={grid2}>
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

      {/* Early Bird */}
      <section style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <h2 style={{ ...sectionHeading, margin: 0 }}>Early Bird</h2>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={earlyBird.enabled}
              onChange={e => setEarlyBird(p => ({ ...p, enabled: e.target.checked }))}
              style={{ accentColor: '#D4A853', width: '15px', height: '15px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.78rem', color: earlyBird.enabled ? '#D4A853' : 'rgba(226,232,240,0.35)' }}>
              {earlyBird.enabled ? 'Active' : 'Disabled'}
            </span>
          </label>
        </div>

        {earlyBird.enabled && (
          <>
            <div style={grid2}>
              <div>
                <label style={labelStyle}>Discount EUR <span style={{ color: 'rgba(232,213,183,0.3)', fontWeight: 400, textTransform: 'none' }}>{pricingMode === 'tiers' ? '(amount off each room, e.g. 150)' : '(amount off, e.g. 150)'}</span></label>
                <input
                  type="number"
                  min={0}
                  value={earlyBird.discount_eur}
                  onChange={e => setEarlyBird(p => ({ ...p, discount_eur: e.target.value }))}
                  placeholder="150"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Discount ILS <span style={{ color: 'rgba(232,213,183,0.3)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                <input
                  type="number"
                  min={0}
                  value={earlyBird.discount_ils}
                  onChange={e => setEarlyBird(p => ({ ...p, discount_ils: e.target.value }))}
                  placeholder="600"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Spots at Early Bird price</label>
                <input
                  type="number"
                  min={1}
                  value={earlyBird.spots}
                  onChange={e => setEarlyBird(p => ({ ...p, spots: e.target.value }))}
                  placeholder="4"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Deadline <span style={{ color: 'rgba(232,213,183,0.3)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></label>
                <input
                  type="date"
                  value={earlyBird.deadline}
                  onChange={e => setEarlyBird(p => ({ ...p, deadline: e.target.value }))}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                />
              </div>
            </div>
            <p style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'rgba(226,232,240,0.25)', lineHeight: 1.5 }}>
              Early bird closes automatically once <strong style={{ color: 'rgba(226,232,240,0.45)' }}>{earlyBird.spots || '?'} leads</strong> have made at least a first payment (Partial or Paid status in CRM)
              {earlyBird.deadline ? `, or on ${earlyBird.deadline}` : ''}.
            </p>
          </>
        )}
      </section>

      {/* Images */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>Images</h2>
        <div>
          <label style={labelStyle}>Hero Image</label>
          <p style={{ fontSize: '0.68rem', color: 'rgba(226,232,240,0.25)', marginBottom: '0.5rem' }}>Full-bleed background on the event page header.</p>
          <SingleImageUploader
            folder={`events/${form.slug || 'new'}`}
            value={form.hero_image}
            onChange={url => set('hero_image', url)}
          />
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <label style={labelStyle}>Gallery</label>
          <p style={{ fontSize: '0.68rem', color: 'rgba(226,232,240,0.25)', marginBottom: '0.5rem' }}>Shown in the photo gallery section. First image = cover.</p>
          <MultiImageUploader
            folder={`events/${form.slug || 'new'}/gallery`}
            value={form.gallery_images}
            onChange={urls => set('gallery_images', urls)}
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

      {/* Who is it for */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>Who Is It For</h2>
        <p style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.3)', marginBottom: '1rem' }}>Shown in the "Who is it for" section on the event page. Leave blank to use default copy.</p>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>English</label>
            <textarea value={whoForEn} onChange={e => setWhoForEn(e.target.value)} rows={5} placeholder="For the curious and capable..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Hebrew</label>
            <textarea value={whoForHe} onChange={e => setWhoForHe(e.target.value)} rows={5} dir="rtl" placeholder="לאנשים סקרנים ומסוגלים..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>
      </section>

      {/* Venue */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>Venue & Space</h2>
        <p style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.3)', marginBottom: '1rem' }}>Shown in the "The Venue" section. Add venue photos and a description of the specific space.</p>
        <div style={grid2}>
          <div>
            <label style={labelStyle}>Venue Description EN</label>
            <textarea value={venueDescEn} onChange={e => setVenueDescEn(e.target.value)} rows={6} placeholder="Set on a hillside above the Aegean..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Venue Description HE</label>
            <textarea value={venueDescHe} onChange={e => setVenueDescHe(e.target.value)} rows={6} dir="rtl" placeholder="ממוקם על גבעה מעל האגאי..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>
        <div style={{ marginTop: '1.25rem' }}>
          <label style={labelStyle}>Venue Photos</label>
          <p style={{ fontSize: '0.68rem', color: 'rgba(226,232,240,0.25)', marginBottom: '0.5rem' }}>First photo becomes the large feature image.</p>
          <MultiImageUploader
            folder={`events/${form.slug || 'new'}/venue`}
            value={venueImages}
            onChange={setVenueImages}
          />
        </div>
      </section>

      {/* Instagram */}
      <section style={sectionStyle}>
        <h2 style={sectionHeading}>Instagram Videos</h2>
        <p style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.3)', marginBottom: '1rem' }}>Paste full Instagram post/reel URLs (e.g. https://www.instagram.com/reel/ABC123/). EN for English visitors, HE for Hebrew. Leave both empty to hide the section.</p>
        <div style={grid2}>
          <ListEditor label="Instagram URLs — English" items={igUrlsEn} onChange={setIgUrlsEn} />
          <ListEditor label="Instagram URLs — עברית" items={igUrlsHe} onChange={setIgUrlsHe} />
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
