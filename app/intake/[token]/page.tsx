'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import SignaturePad, { SigHandle } from './SignaturePad'
import { tx } from './tx'

const inp: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.9rem', borderRadius: 6,
  border: '1px solid #d1d5db', fontSize: '0.95rem', outline: 'none',
  fontFamily: 'inherit', background: '#fff', color: '#1a2a3a', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.88rem', color: '#374151' }
const sec: React.CSSProperties = { fontSize: '1rem', fontWeight: 700, color: '#1a2a3a', margin: '0 0 4px' }
const sub: React.CSSProperties = { fontSize: '0.82rem', color: '#6b7280', margin: '0 0 1.1rem', lineHeight: 1.5 }
const hr: React.CSSProperties = { borderTop: '1px solid #e5e7eb', margin: '1.75rem 0' }
const textBlock: React.CSSProperties = {
  background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8,
  padding: '1rem 1.25rem', marginBottom: '1rem',
  fontSize: '0.84rem', color: '#4b5563', lineHeight: 1.75, whiteSpace: 'pre-wrap',
}

interface LeadData {
  id: string; first_name: string; last_name: string; email: string
  event_slug: string; locale: string; intake_submitted_at?: string | null
}

export default function IntakePage() {
  const params = useParams()
  const token = Array.isArray(params.token) ? params.token[0] : params.token as string

  const [lead, setLead] = useState<LeadData | null>(null)
  const [loadErr, setLoadErr] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitErr, setSubmitErr] = useState('')
  const [step, setStep] = useState<1 | 2>(1)

  // Step 1 — Agreement fields
  const [dob, setDob] = useState('')
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [medical, setMedical] = useState<Record<string, boolean | undefined>>({})
  const [condDetails, setCondDetails] = useState('')
  const [photoConsent, setPhotoConsent] = useState<boolean | null>(null)
  const [ackChecked, setAckChecked] = useState(false)
  const [sigName, setSigName] = useState('')
  const sigRef = useRef<SigHandle>(null)

  // Step 2 — Practical details
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [shoeSize, setShoeSize] = useState('')
  const [hasDiveGear, setHasDiveGear] = useState(false)
  const [gearItems, setGearItems] = useState<string[]>([])
  const [food, setFood] = useState('')

  useEffect(() => {
    void fetch(`/api/intake/${token}`)
      .then(r => r.json())
      .then((j: { lead?: LeadData; error?: string }) => {
        if (j.error || !j.lead) { setLoadErr('This link is invalid or has expired.'); setLoading(false); return }
        setLead(j.lead)
        if (j.lead.intake_submitted_at) setSubmitted(true)
        setLoading(false)
      })
  }, [token])

  const t = tx(lead?.locale ?? 'en')
  const allMedAnswered = t.conditions.every(({ key }) => medical[key] !== undefined)
  const anyYes = t.conditions.some(({ key }) => medical[key] === true)

  const step1Missing: string[] = []
  if (!dob.trim()) step1Missing.push(t.missingDob)
  if (!emergencyName.trim()) step1Missing.push(t.missingEmergencyName)
  if (!emergencyPhone.trim()) step1Missing.push(t.missingEmergencyPhone)
  if (!allMedAnswered) step1Missing.push(t.missingMedical)
  if (anyYes && !condDetails.trim()) step1Missing.push(t.missingConditionDetails)
  if (photoConsent === null) step1Missing.push(t.missingPhoto)
  if (!ackChecked) step1Missing.push(t.missingAck)
  if (!sigName.trim() && !sigRef.current?.hasData()) step1Missing.push(t.missingSig)

  function toggleGear(v: string) {
    setGearItems(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (step1Missing.length > 0) return
    setSaving(true)
    setSubmitErr('')

    const waiver_signature = sigRef.current?.getDataUrl() ?? undefined

    const res = await fetch(`/api/intake/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dob: dob || null,
        emergency_contact_name: emergencyName || null,
        emergency_contact_phone: emergencyPhone || null,
        medical_notes: JSON.stringify({ conditions: medical, details: condDetails }),
        photo_consent: photoConsent,
        waiver_name: sigName.trim() || null,
        waiver_signature: waiver_signature ?? null,
        height: height ? Number(height) : null,
        weight: weight ? Number(weight) : null,
        shoe_size: shoeSize || null,
        has_dive_gear: hasDiveGear,
        gear_items: hasDiveGear ? gearItems : [],
        food_allergies: food || null,
      }),
    })
    setSaving(false)
    if (res.ok) {
      setSubmitted(true)
    } else {
      const j = await res.json().catch(() => ({})) as { error?: string }
      setSubmitErr(j.error ?? 'Something went wrong. Please try again.\n\nContact us at info@upsidedown-retreat.com')
    }
  }

  const dir = t.dir

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <p style={{ color: '#9ca3af' }}>{t.loading}</p>
    </div>
  )

  if (loadErr) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center', color: '#6b7280' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>{loadErr}</p>
        <p style={{ fontSize: '0.85rem' }}>{t.contactUs}</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem', direction: dir }}>
      <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✓</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a2a3a', marginBottom: 8 }}>{t.allSet}</h2>
        <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{t.allSetMsg(lead?.first_name ?? '')}</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem', direction: dir }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4A853', fontWeight: 700, marginBottom: 4 }}>{t.docLabel}</p>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a2a3a', marginBottom: 0, lineHeight: 1.3 }}>{t.docTitle}</h1>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
          {([1, 2] as const).map(n => (
            <div key={n} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= n ? '#D4A853' : '#e5e7eb' }} />
          ))}
        </div>
        <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '1.5rem', textAlign: 'center' }}>
          {step === 1 ? t.step1 : t.step2}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>

            {step === 1 && <>
              {/* — Participant Information — */}
              <h2 style={sec}>{t.participantInfo}</h2>
              <div style={{ ...hr, margin: '0.5rem 0 1.25rem' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={lbl}>{t.fullName}</label>
                  <input value={`${lead?.first_name ?? ''} ${lead?.last_name ?? ''}`} readOnly style={{ ...inp, background: '#f3f4f6', color: '#6b7280' }} />
                </div>
                <div>
                  <label style={lbl}>{t.dob} *</label>
                  <input type="date" value={dob} onChange={e => setDob(e.target.value)} required style={{ ...inp, borderColor: !dob ? '#fca5a5' : '#d1d5db' }} />
                </div>
                <div>
                  <label style={lbl}>{t.email}</label>
                  <input value={lead?.email ?? ''} readOnly style={{ ...inp, background: '#f3f4f6', color: '#6b7280' }} />
                </div>
                <div>
                  <label style={lbl}>{t.emergencyName} *</label>
                  <input value={emergencyName} onChange={e => setEmergencyName(e.target.value)} style={{ ...inp, borderColor: !emergencyName ? '#fca5a5' : '#d1d5db' }} />
                </div>
                <div>
                  <label style={lbl}>{t.emergencyPhone} *</label>
                  <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} style={{ ...inp, borderColor: !emergencyPhone ? '#fca5a5' : '#d1d5db' }} />
                </div>
              </div>

              <div style={hr} />

              {/* — Health Declaration — */}
              <h2 style={sec}>{t.healthTitle}</h2>
              <p style={{ ...sub, marginBottom: '0.9rem' }}>{t.healthIntro}</p>
              <p style={{ fontSize: '0.88rem', color: '#374151', marginBottom: '0.6rem', fontWeight: 600 }}>{t.healthConfirm}</p>
              <ul style={{ paddingInlineStart: '1.4rem', margin: '0 0 1.25rem', color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.75 }}>
                {t.healthPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>

              <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>{t.healthConditionsTitle}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '1.25rem' }}>
                {t.conditions.map(({ key, label }) => {
                  const answered = medical[key] !== undefined
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '0.6rem 0.75rem', borderRadius: 6, background: answered ? '#f9fafb' : '#fef9f0', border: `1px solid ${answered ? '#e5e7eb' : '#fcd34d'}` }}>
                      <span style={{ fontSize: '0.88rem', color: '#374151', flex: 1 }}>{label}</span>
                      <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
                        {([true, false] as const).map(v => (
                          <label key={String(v)} style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', fontSize: '0.85rem', color: medical[key] === v ? (v ? '#dc2626' : '#16a34a') : '#6b7280', fontWeight: medical[key] === v ? 700 : 400 }}>
                            <input type="radio" name={`med_${key}`} checked={medical[key] === v} onChange={() => setMedical(p => ({ ...p, [key]: v }))} style={{ accentColor: v ? '#dc2626' : '#16a34a' }} />
                            {v ? t.conditionYes : t.conditionNo}
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {anyYes && (
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={lbl}>{t.conditionDetails} *</label>
                  <textarea value={condDetails} onChange={e => setCondDetails(e.target.value)} rows={3} placeholder={t.conditionDetailsPlaceholder} style={{ ...inp, resize: 'vertical', borderColor: !condDetails ? '#fca5a5' : '#d1d5db' }} />
                </div>
              )}

              <div style={hr} />

              {/* — Assumption of Risk — */}
              <h2 style={{ ...sec, marginBottom: 8 }}>{t.riskTitle}</h2>
              <div style={textBlock}>{t.riskText}</div>

              <div style={hr} />

              {/* — Release of Liability — */}
              <h2 style={{ ...sec, marginBottom: 8 }}>{t.releaseTitle}</h2>
              <div style={textBlock}>{t.releaseText}</div>

              <div style={hr} />

              {/* — Medical Assistance — */}
              <h2 style={{ ...sec, marginBottom: 8 }}>{t.medAidTitle}</h2>
              <div style={textBlock}>{t.medAidText}</div>

              <div style={hr} />

              {/* — Photography — */}
              <h2 style={sec}>{t.photoTitle}</h2>
              <p style={sub}>{t.photoIntro}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem' }}>
                {([true, false] as const).map(v => (
                  <label key={String(v)} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                    <input type="radio" name="photo" checked={photoConsent === v} onChange={() => setPhotoConsent(v)} style={{ marginTop: 2, flexShrink: 0 }} />
                    {v ? t.photoYes : t.photoNo}
                  </label>
                ))}
              </div>

              <div style={hr} />

              {/* — Acknowledgment — */}
              <h2 style={sec}>{t.ackTitle}</h2>
              <ul style={{ paddingInlineStart: '1.4rem', margin: '0.5rem 0 1.25rem', color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.75 }}>
                {t.ackPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: '1.5rem' }}>
                <input type="checkbox" checked={ackChecked} onChange={e => setAckChecked(e.target.checked)} style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.5, fontWeight: 600 }}>{t.ackCheck}</span>
              </label>

              {/* Signature */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={lbl}>{t.signatureDraw}</label>
                <SignaturePad ref={sigRef} />
                <button type="button" onClick={() => sigRef.current?.clear()} style={{ marginTop: 6, fontSize: '0.78rem', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>{t.signatureClear}</button>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={lbl}>{t.signatureName}</label>
                <input value={sigName} onChange={e => setSigName(e.target.value)} placeholder={`${lead?.first_name ?? ''} ${lead?.last_name ?? ''}`} style={{ ...inp, borderColor: (!sigName.trim() && !sigRef.current?.hasData()) ? '#fca5a5' : '#d1d5db' }} />
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 4 }}>{t.signatureHint}</p>
              </div>

              <div style={{ marginBottom: '0.5rem' }}>
                <label style={lbl}>{t.signatureDate}</label>
                <input value={new Date().toLocaleDateString(lead?.locale === 'he' ? 'he-IL' : 'en-GB')} readOnly style={{ ...inp, background: '#f3f4f6', color: '#6b7280', width: 'auto' }} />
              </div>

              {step1Missing.length > 0 && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.9rem 1rem', marginTop: '1.5rem' }}>
                  <p style={{ fontWeight: 700, color: '#b91c1c', margin: '0 0 6px', fontSize: '0.88rem' }}>{t.validationMsg}</p>
                  <ul style={{ margin: 0, paddingInlineStart: '1.2rem', color: '#dc2626', fontSize: '0.83rem' }}>
                    {step1Missing.map(m => <li key={m}>{m}</li>)}
                  </ul>
                </div>
              )}

              <button
                type="button"
                disabled={step1Missing.length > 0}
                onClick={() => step1Missing.length === 0 && setStep(2)}
                style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem', background: step1Missing.length === 0 ? '#D4A853' : '#d1d5db', color: step1Missing.length === 0 ? '#0B1D2A' : '#9ca3af', border: 'none', borderRadius: 6, fontSize: '1rem', fontWeight: 700, cursor: step1Missing.length === 0 ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
              >
                {t.continue}
              </button>
            </>}

            {step === 2 && <>
              <h2 style={sec}>{t.practicalTitle}</h2>
              <p style={sub}>{t.practicalSub}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div><label style={lbl}>{t.height}</label><input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" style={inp} /></div>
                <div><label style={lbl}>{t.weight}</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" style={inp} /></div>
                <div><label style={lbl}>{t.shoeSize}</label><input value={shoeSize} onChange={e => setShoeSize(e.target.value)} placeholder="42" style={inp} /></div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={lbl}>{t.gearQ}</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {([true, false] as const).map(v => (
                    <label key={String(v)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                      <input type="radio" checked={hasDiveGear === v} onChange={() => setHasDiveGear(v)} />{v ? t.gearYes : t.gearNo}
                    </label>
                  ))}
                </div>
              </div>

              {hasDiveGear && (
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f3f4f6', borderRadius: 8 }}>
                  <label style={lbl}>{t.gearWhich}</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {t.gearItems.map(opt => (
                      <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
                        <input type="checkbox" checked={gearItems.includes(opt.value)} onChange={() => toggleGear(opt.value)} style={{ width: 16, height: 16 }} />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={lbl}>{t.food}</label>
                <textarea value={food} onChange={e => setFood(e.target.value)} rows={3} placeholder={t.foodPlaceholder} style={{ ...inp, resize: 'vertical' }} />
              </div>

              {submitErr && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.9rem 1rem', marginBottom: '1rem' }}>
                  <p style={{ color: '#b91c1c', margin: 0, fontSize: '0.88rem', whiteSpace: 'pre-wrap' }}>{submitErr}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '0.85rem', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer' }}>
                  {t.back}
                </button>
                <button type="submit" disabled={saving} style={{ flex: 2, padding: '0.85rem', background: '#D4A853', color: '#0B1D2A', border: 'none', borderRadius: 6, fontSize: '1rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                  {saving ? t.submitting : t.submit}
                </button>
              </div>
            </>}

          </div>
        </form>
      </div>
    </div>
  )
}
