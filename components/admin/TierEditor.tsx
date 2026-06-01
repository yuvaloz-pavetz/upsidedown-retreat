'use client'

import type { PricingTier } from '@/lib/supabase/types'
import { SingleImageUploader } from '@/components/admin/ImageUploader'
import { labelStyle, inputStyle } from '@/components/admin/RetreatForm'

interface Props {
  tiers: PricingTier[]
  onChange: (tiers: PricingTier[]) => void
  slug: string
}

function newTier(): PricingTier {
  return { id: `${Date.now()}`, name_en: '', name_he: '', description_en: '', description_he: '', price_ils: '', price_eur: '', spots: null, photo: '' }
}

const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }

const removeBtn: React.CSSProperties = {
  background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)',
  borderRadius: 4, color: '#f87171', fontSize: '0.72rem', padding: '0.3rem 0.75rem', cursor: 'pointer',
}

const addBtn: React.CSSProperties = {
  background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4,
  color: 'rgba(226,232,240,0.45)', fontSize: '0.78rem', padding: '0.45rem 0.9rem', cursor: 'pointer', marginTop: '0.5rem',
}

export default function TierEditor({ tiers, onChange, slug }: Props) {
  function update<K extends keyof PricingTier>(id: string, key: K, val: PricingTier[K]) {
    onChange(tiers.map(t => t.id === id ? { ...t, [key]: val } : t))
  }

  return (
    <div>
      <p style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.3)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Optional. Add tiers (e.g. Shared Room, Private Room). If only one tier, that price replaces the base price. Spots count is admin-only.
      </p>
      {tiers.map((tier, i) => (
        <div key={tier.id} style={{ marginBottom: '1.25rem', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.65rem', color: 'rgba(212,168,83,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Tier {i + 1}</span>
            <button type="button" onClick={() => onChange(tiers.filter(t => t.id !== tier.id))} style={removeBtn}>Remove</button>
          </div>
          <div style={{ ...grid2, marginBottom: '0.85rem' }}>
            <div>
              <label style={labelStyle}>Name EN</label>
              <input value={tier.name_en} onChange={e => update(tier.id, 'name_en', e.target.value)} placeholder="Shared Room" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Name HE</label>
              <input value={tier.name_he} onChange={e => update(tier.id, 'name_he', e.target.value)} dir="rtl" placeholder="חדר משותף" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description EN</label>
              <input value={tier.description_en} onChange={e => update(tier.id, 'description_en', e.target.value)} placeholder="2–3 people per room" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Description HE</label>
              <input value={tier.description_he} onChange={e => update(tier.id, 'description_he', e.target.value)} dir="rtl" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price ILS</label>
              <input value={tier.price_ils} onChange={e => update(tier.id, 'price_ils', e.target.value)} placeholder="₪3,200" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Price EUR</label>
              <input value={tier.price_eur} onChange={e => update(tier.id, 'price_eur', e.target.value)} placeholder="€820" style={inputStyle} />
            </div>
          </div>
          <div style={{ ...grid2, alignItems: 'start' }}>
            <div>
              <label style={labelStyle}>Available Spots (admin only, optional)</label>
              <input
                type="number" min={0}
                value={tier.spots ?? ''}
                onChange={e => update(tier.id, 'spots', e.target.value !== '' ? Number(e.target.value) : null)}
                placeholder="Leave blank = unlimited"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Tier Photo (optional)</label>
              <SingleImageUploader
                folder={`events/${slug || 'new'}/tiers`}
                value={tier.photo}
                onChange={url => update(tier.id, 'photo', url)}
              />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...tiers, newTier()])} style={addBtn}>
        + Add tier
      </button>
    </div>
  )
}
