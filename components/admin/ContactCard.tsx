'use client'

import { useState } from 'react'
import PaymentsPanel from './PaymentsPanel'
import type { Lead, LeadStatus, Payment, FreedivingLevel } from '@/lib/supabase/types'

const GEAR_OPTIONS = [
  { value: 'mask', label: 'Mask / מסיכה' },
  { value: 'snorkel', label: 'Snorkel / שנורקל' },
  { value: 'wetsuit', label: 'Wetsuit / חליפה' },
  { value: 'fins', label: 'Fins / סנפירים' },
  { value: 'weight_belt', label: 'Weight belt / חגורת משקולות' },
]

const FREEDIVING_LEVELS: { value: FreedivingLevel; label: string }[] = [
  { value: 'basic_course', label: 'Basic Course' },
  { value: 'advanced_course', label: 'Advanced Course' },
  { value: 'guided_training', label: 'Guided Training' },
]

const STATUS_COLOR: Record<LeadStatus, string> = {
  interested: '#4A9BB8', email_sent: '#9B7FD4', partially_paid: '#D4A853', paid: '#5A9A6F',
  past: 'rgba(226,232,240,0.35)', irrelevant: 'rgba(226,232,240,0.18)',
}
const STATUS_LABEL: Record<LeadStatus, string> = {
  interested: 'Interested', email_sent: 'Email Sent', partially_paid: 'Partial',
  paid: 'Paid', past: 'Past', irrelevant: 'Irrelevant',
}

const inp: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '5px', padding: '0.45rem 0.7rem', fontSize: '0.82rem',
  color: '#e2e8f0', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}
const fieldLabel: React.CSSProperties = {
  display: 'block', fontSize: '0.62rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', color: 'rgba(226,232,240,0.3)', marginBottom: '0.35rem',
}
const row: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.35rem' }

interface Props {
  leads: Lead[]
  onClose: () => void
  onLeadChange: (id: string, updates: Partial<Lead>) => void
  onPaymentsSave: (id: string, payments: Payment[], newStatus: LeadStatus | null) => void
}

export default function ContactCard({ leads, onClose, onLeadChange, onPaymentsSave }: Props) {
  const primary = leads[0]
  // Only pre-fill health fields if the contact actually submitted the intake form
  const submittedLead = leads.find(l => l.intake_submitted_at) ?? null

  const [tab, setTab] = useState<'profile' | 'gear' | 'payments'>('profile')
  const [saving, setSaving] = useState(false)
  const [intakeSent, setIntakeSent] = useState(false)
  const [sendingIntake, setSendingIntake] = useState(false)
  const [intakeToken, setIntakeToken] = useState<string | null>(
    leads.find(l => l.intake_token)?.intake_token ?? null
  )
  const [copied, setCopied] = useState(false)
  const [intakeError, setIntakeError] = useState<string | null>(null)

  const [locale, setLocale] = useState(primary.locale ?? 'en')
  const [freedivingLevel, setFreedivingLevel] = useState<FreedivingLevel | ''>(primary.freediving_level ?? '')
  const [height, setHeight] = useState(submittedLead?.height?.toString() ?? '')
  const [weight, setWeight] = useState(submittedLead?.weight?.toString() ?? '')
  const [shoeSize, setShoeSize] = useState(submittedLead?.shoe_size ?? '')
  const [hasDiveGear, setHasDiveGear] = useState(submittedLead?.has_dive_gear ?? false)
  const [gearItems, setGearItems] = useState<string[]>(submittedLead?.gear_items ?? [])
  const [foodAllergies, setFoodAllergies] = useState(submittedLead?.food_allergies ?? '')

  function toggleGear(v: string) {
    setGearItems(prev => prev.includes(v) ? prev.filter(g => g !== v) : [...prev, v])
  }

  async function patch(body: Record<string, unknown>) {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  async function saveLocale(val: string) {
    setLocale(val)
    await patch({ byEmail: primary.email, locale: val })
    for (const l of leads) onLeadChange(l.id, { locale: val })
  }

  async function saveFreedivingLevel(level: FreedivingLevel | '') {
    setFreedivingLevel(level)
    const val = level || null
    await patch({ byEmail: primary.email, freediving_level: val })
    for (const l of leads) onLeadChange(l.id, { freediving_level: val as FreedivingLevel | null })
  }

  async function saveHealthFields() {
    setSaving(true)
    const updates = {
      height: height ? Number(height) : null,
      weight: weight ? Number(weight) : null,
      shoe_size: shoeSize || null,
      has_dive_gear: hasDiveGear,
      gear_items: hasDiveGear ? gearItems : [],
      food_allergies: foodAllergies || null,
    }
    await patch({ byEmail: primary.email, ...updates })
    for (const l of leads) onLeadChange(l.id, updates)
    setSaving(false)
  }

  async function callIntakeApi(sendEmail: boolean) {
    setIntakeError(null)
    try {
      const res = await fetch('/api/leads/send-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: primary.email, first_name: primary.first_name, event_slug: primary.event_slug, locale, sendEmail }),
      })
      const json = await res.json() as { ok?: boolean; token?: string; url?: string; error?: string }
      if (json.error) { setIntakeError(json.error); return json }
      if (json.token) {
        setIntakeToken(json.token)
        for (const l of leads) onLeadChange(l.id, { intake_token: json.token })
      }
      return json
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Network error'
      setIntakeError(msg)
      return { error: msg }
    }
  }

  async function sendIntake() {
    setSendingIntake(true)
    await callIntakeApi(true)
    setSendingIntake(false)
    setIntakeSent(true)
  }

  async function copyLink() {
    let token = intakeToken
    if (!token) {
      const json = await callIntakeApi(false)
      token = json.token ?? null
    }
    if (!token) return
    const url = `https://upsidedown-retreat.com/intake/${token}`
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback for browsers that block clipboard API
      const el = document.createElement('textarea')
      el.value = url
      el.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
      document.body.appendChild(el)
      el.focus()
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const tabBtn = (active: boolean): React.CSSProperties => ({
    background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
    border: '1px solid ' + (active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)'),
    borderRadius: '5px', padding: '0.35rem 0.85rem', fontSize: '0.72rem',
    color: active ? '#e2e8f0' : 'rgba(226,232,240,0.35)', cursor: 'pointer', transition: 'all 0.15s',
    fontFamily: 'inherit',
  })

  const intakeDate = submittedLead?.intake_submitted_at
    ? new Date(submittedLead.intake_submitted_at).toLocaleDateString()
    : null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d1526', borderRadius: '12px', width: '100%', maxWidth: '600px',
          maxHeight: '88vh', display: 'flex', flexDirection: 'column',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e2e8f0', margin: 0, marginBottom: '0.2rem' }}>
              {primary.first_name} {primary.last_name}
            </h2>
            <a href={`mailto:${primary.email}`} style={{ fontSize: '0.78rem', color: '#D4A853', textDecoration: 'none' }}>
              {primary.email}
            </a>
            {primary.phone && (
              <span style={{ fontSize: '0.78rem', color: 'rgba(226,232,240,0.35)', marginLeft: '1rem' }}>
                {primary.phone}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(226,232,240,0.3)', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1, padding: '0 4px', flexShrink: 0 }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '0.4rem' }}>
          <button style={tabBtn(tab === 'profile')} onClick={() => setTab('profile')}>Profile</button>
          <button style={tabBtn(tab === 'gear')} onClick={() => setTab('gear')}>Health &amp; Gear</button>
          <button style={tabBtn(tab === 'payments')} onClick={() => setTab('payments')}>Payments</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>

          {/* ── PROFILE ── */}
          {tab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Events */}
              <div>
                <p style={fieldLabel}>Events</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {leads.map(l => (
                    <div key={l.id} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.55rem 0.75rem', background: 'rgba(255,255,255,0.03)',
                      borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: STATUS_COLOR[l.status], flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', color: 'rgba(226,232,240,0.7)', flex: 1 }}>{l.event_slug}</span>
                      <span style={{ fontSize: '0.7rem', color: STATUS_COLOR[l.status] }}>{STATUS_LABEL[l.status]}</span>
                      {l.amount && <span style={{ fontSize: '0.7rem', color: 'rgba(232,213,183,0.6)' }}>{l.amount} {l.currency}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {primary.notes && (
                <div>
                  <p style={fieldLabel}>Notes / Room</p>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(212,168,83,0.7)', margin: 0 }}>{primary.notes}</p>
                </div>
              )}

              {/* Language */}
              <div style={row}>
                <label style={fieldLabel}>Language</label>
                <select
                  value={locale}
                  onChange={e => saveLocale(e.target.value)}
                  style={{ ...inp, cursor: 'pointer' }}
                >
                  <option value="en" style={{ background: '#0d1526' }}>English</option>
                  <option value="he" style={{ background: '#0d1526' }}>עברית</option>
                </select>
              </div>

              {/* Freediving level */}
              <div style={row}>
                <label style={fieldLabel}>Freediving level (admin only)</label>
                <select
                  value={freedivingLevel}
                  onChange={e => saveFreedivingLevel(e.target.value as FreedivingLevel | '')}
                  style={{ ...inp, cursor: 'pointer', color: freedivingLevel ? '#D4A853' : 'rgba(226,232,240,0.3)' }}
                >
                  <option value="" style={{ background: '#0d1526', color: '#e2e8f0' }}>— Not set</option>
                  {FREEDIVING_LEVELS.map(fl => (
                    <option key={fl.value} value={fl.value} style={{ background: '#0d1526', color: '#e2e8f0' }}>{fl.label}</option>
                  ))}
                </select>
              </div>

              {/* Signed up */}
              <div>
                <p style={fieldLabel}>Signed up</p>
                <p style={{ fontSize: '0.78rem', color: 'rgba(226,232,240,0.3)', margin: 0 }}>
                  {new Date(primary.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {/* ── HEALTH & GEAR ── */}
          {tab === 'gear' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Intake status */}
              <div style={{
                padding: '0.65rem 0.9rem', borderRadius: '6px',
                background: intakeDate ? 'rgba(90,154,111,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${intakeDate ? 'rgba(90,154,111,0.2)' : 'rgba(255,255,255,0.06)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
              }}>
                <span style={{ fontSize: '0.78rem', color: intakeDate ? 'rgba(90,154,111,0.9)' : 'rgba(226,232,240,0.3)' }}>
                  {intakeDate ? `Intake submitted ${intakeDate}` : 'Intake form not yet submitted'}
                </span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={copyLink}
                    style={{
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '4px', padding: '0.3rem 0.75rem', fontSize: '0.7rem',
                      color: copied ? 'rgba(90,154,111,0.9)' : 'rgba(226,232,240,0.5)',
                      cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                    }}
                  >
                    {copied ? 'Copied!' : 'Copy link'}
                  </button>
                  <button
                    onClick={sendIntake}
                    disabled={sendingIntake}
                    style={{
                      background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.25)',
                      borderRadius: '4px', padding: '0.3rem 0.75rem', fontSize: '0.7rem',
                      color: intakeSent ? 'rgba(90,154,111,0.9)' : '#D4A853',
                      cursor: sendingIntake ? 'not-allowed' : 'pointer', opacity: sendingIntake ? 0.6 : 1,
                      fontFamily: 'inherit', whiteSpace: 'nowrap',
                    }}
                  >
                    {intakeSent ? 'Sent!' : sendingIntake ? 'Sending…' : 'Send intake email'}
                  </button>
                </div>
              </div>

              {intakeError && (
                <div style={{ padding: '0.6rem 0.8rem', borderRadius: '5px', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', fontSize: '0.75rem', color: '#f87171', wordBreak: 'break-all' }}>
                  Error: {intakeError}
                </div>
              )}

              {/* Measurements */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div style={row}>
                  <label style={fieldLabel}>Height (cm)</label>
                  <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" style={inp} />
                </div>
                <div style={row}>
                  <label style={fieldLabel}>Weight (kg)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" style={inp} />
                </div>
                <div style={row}>
                  <label style={fieldLabel}>Shoe size (EU)</label>
                  <input type="text" value={shoeSize} onChange={e => setShoeSize(e.target.value)} placeholder="42" style={inp} />
                </div>
              </div>

              {/* Dive gear */}
              <div>
                <p style={fieldLabel}>Has own freediving gear?</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {[true, false].map(v => (
                    <label key={String(v)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.82rem', color: '#e2e8f0' }}>
                      <input type="radio" checked={hasDiveGear === v} onChange={() => setHasDiveGear(v)} />
                      {v ? 'Yes' : 'No'}
                    </label>
                  ))}
                </div>
              </div>

              {hasDiveGear && (
                <div>
                  <p style={fieldLabel}>Gear items</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {GEAR_OPTIONS.map(opt => (
                      <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.82rem', color: 'rgba(226,232,240,0.7)' }}>
                        <input
                          type="checkbox"
                          checked={gearItems.includes(opt.value)}
                          onChange={() => toggleGear(opt.value)}
                          style={{ width: 15, height: 15, accentColor: '#D4A853' }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Food allergies */}
              <div style={row}>
                <label style={fieldLabel}>Food allergies / dietary restrictions</label>
                <textarea
                  value={foodAllergies}
                  onChange={e => setFoodAllergies(e.target.value)}
                  rows={2}
                  placeholder="None / Vegetarian / Gluten-free…"
                  style={{ ...inp, resize: 'vertical' }}
                />
              </div>

              <button
                onClick={saveHealthFields}
                disabled={saving}
                style={{
                  alignSelf: 'flex-start', background: '#D4A853', border: 'none',
                  borderRadius: '5px', padding: '0.5rem 1.25rem', fontSize: '0.78rem',
                  fontWeight: 600, color: '#0d1520', cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1, fontFamily: 'inherit',
                }}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}

          {/* ── PAYMENTS ── */}
          {tab === 'payments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {leads.map(l => (
                <div key={l.id}>
                  <p style={{ ...fieldLabel, marginBottom: '0.5rem' }}>{l.event_slug}</p>
                  <PaymentsPanel lead={l} onSave={onPaymentsSave} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
