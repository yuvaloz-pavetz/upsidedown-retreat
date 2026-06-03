'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const GEAR_OPTIONS = [
  { value: 'mask', label: 'Mask / מסיכה' },
  { value: 'snorkel', label: 'Snorkel / שנורקל' },
  { value: 'wetsuit', label: 'Wetsuit / חליפה' },
  { value: 'fins', label: 'Fins / סנפירים' },
  { value: 'weight_belt', label: 'Weight belt / חגורת משקולות' },
]

const inp: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.9rem', borderRadius: 6,
  border: '1px solid #d1d5db', fontSize: '0.95rem', outline: 'none',
  fontFamily: 'inherit', background: '#fff', color: '#1a2a3a',
  boxSizing: 'border-box',
}
const label: React.CSSProperties = {
  display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.88rem', color: '#374151',
}

interface LeadData {
  id: string; first_name: string; last_name: string; email: string; event_slug: string
  height?: number | null; weight?: number | null; shoe_size?: string | null
  has_dive_gear?: boolean | null; gear_items?: string[] | null
  food_allergies?: string | null; intake_submitted_at?: string | null
}

export default function IntakePage() {
  const params = useParams()
  const token = Array.isArray(params.token) ? params.token[0] : params.token as string

  const [lead, setLead] = useState<LeadData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [shoeSize, setShoeSize] = useState('')
  const [hasDiveGear, setHasDiveGear] = useState(false)
  const [gearItems, setGearItems] = useState<string[]>([])
  const [foodAllergies, setFoodAllergies] = useState('')

  useEffect(() => {
    void fetch(`/api/intake/${token}`)
      .then(r => r.json())
      .then((j: { lead?: LeadData; error?: string }) => {
        if (j.error || !j.lead) { setError('This link is invalid or has expired.'); setLoading(false); return }
        setLead(j.lead)
        setHeight(j.lead.height?.toString() ?? '')
        setWeight(j.lead.weight?.toString() ?? '')
        setShoeSize(j.lead.shoe_size ?? '')
        setHasDiveGear(j.lead.has_dive_gear ?? false)
        setGearItems(j.lead.gear_items ?? [])
        setFoodAllergies(j.lead.food_allergies ?? '')
        if (j.lead.intake_submitted_at) setSubmitted(true)
        setLoading(false)
      })
  }, [token])

  function toggleGear(value: string) {
    setGearItems(prev => prev.includes(value) ? prev.filter(g => g !== value) : [...prev, value])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch(`/api/intake/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        height: height ? Number(height) : null,
        weight: weight ? Number(weight) : null,
        shoe_size: shoeSize || null,
        has_dive_gear: hasDiveGear,
        gear_items: hasDiveGear ? gearItems : [],
        food_allergies: foodAllergies || null,
      }),
    })
    setSaving(false)
    if (res.ok) setSubmitted(true)
    else setError('Something went wrong. Please try again.')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <p style={{ color: '#9ca3af' }}>Loading...</p>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center', color: '#6b7280' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>{error}</p>
        <p style={{ fontSize: '0.85rem' }}>Contact us at info@upsidedown-retreat.com</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>✓</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a2a3a', marginBottom: 8 }}>All set!</h2>
        <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
          Thank you {lead?.first_name}. We have everything we need. See you at the retreat!
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4A853', fontWeight: 700, marginBottom: 8 }}>
            UpsideDown Retreat
          </p>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a2a3a', marginBottom: 8 }}>
            Hi {lead?.first_name}, a few quick details
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6 }}>
            This helps us prepare everything for your retreat experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={label}>Height (cm)</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" style={inp} />
            </div>
            <div>
              <label style={label}>Weight (kg)</label>
              <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" style={inp} />
            </div>
            <div>
              <label style={label}>Shoe size (EU)</label>
              <input type="text" value={shoeSize} onChange={e => setShoeSize(e.target.value)} placeholder="42" style={inp} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={label}>Do you have your own freediving gear?</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[true, false].map(v => (
                <label key={String(v)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                  <input type="radio" checked={hasDiveGear === v} onChange={() => setHasDiveGear(v)} />
                  {v ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
          </div>

          {hasDiveGear && (
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f3f4f6', borderRadius: 8 }}>
              <label style={label}>Which gear do you have?</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {GEAR_OPTIONS.map(opt => (
                  <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                    <input
                      type="checkbox"
                      checked={gearItems.includes(opt.value)}
                      onChange={() => toggleGear(opt.value)}
                      style={{ width: 16, height: 16 }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <label style={label}>Food allergies or dietary restrictions</label>
            <textarea
              value={foodAllergies}
              onChange={e => setFoodAllergies(e.target.value)}
              rows={3}
              placeholder="None / Vegetarian / Gluten-free..."
              style={{ ...inp, resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              width: '100%', padding: '0.85rem', background: '#D4A853', color: '#0B1D2A',
              border: 'none', borderRadius: 6, fontSize: '1rem', fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Submit my details'}
          </button>
        </form>
      </div>
    </div>
  )
}
