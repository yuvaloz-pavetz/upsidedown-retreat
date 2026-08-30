'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { tx } from './tx'
import { getTransferSchedule, formatTransferDateTime } from '@/lib/transfer-config'

const lbl: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: 8, fontSize: '0.88rem', color: '#374151' }
const sec: React.CSSProperties = { fontSize: '1rem', fontWeight: 700, color: '#1a2a3a', margin: '0 0 4px' }
const optionRow: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }

interface Person {
  id: string; first_name: string; last_name: string; locale: string; event_slug: string
  transfer_arrival?: boolean | null; transfer_departure?: boolean | null
  transfer_large_luggage?: boolean | null; transfer_flight_info?: string | null
  transfer_submitted_at?: string | null
}

function pill(active: boolean): React.CSSProperties {
  return {
    padding: '0.6rem 1.1rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
    border: `1.5px solid ${active ? '#D4A853' : '#d1d5db'}`,
    background: active ? 'rgba(212,168,83,0.12)' : '#fff',
    color: active ? '#8a6d1f' : '#374151',
    userSelect: 'none',
  }
}

export default function TransferPage() {
  const params = useParams()
  const token = Array.isArray(params.token) ? params.token[0] : (params.token as string)

  const [person, setPerson] = useState<Person | null>(null)
  const [loadErr, setLoadErr] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [hadPrior, setHadPrior] = useState(false)
  const [saving, setSaving] = useState(false)
  const [submitErr, setSubmitErr] = useState('')

  const [arrival, setArrival] = useState<boolean | null>(null)
  const [departure, setDeparture] = useState<boolean | null>(null)
  const [luggage, setLuggage] = useState<boolean | null>(null)
  const [flightInfo, setFlightInfo] = useState('')

  useEffect(() => {
    void fetch(`/api/transfer/${token}`)
      .then(r => r.json())
      .then((j: { person?: Person; error?: string }) => {
        if (j.error || !j.person) { setLoadErr('invalid'); setLoading(false); return }
        setPerson(j.person)
        setArrival(j.person.transfer_arrival ?? null)
        setDeparture(j.person.transfer_departure ?? null)
        setLuggage(j.person.transfer_large_luggage ?? null)
        setFlightInfo(j.person.transfer_flight_info ?? '')
        if (j.person.transfer_submitted_at) setHadPrior(true)
        setLoading(false)
      })
  }, [token])

  const t = tx(person?.locale ?? 'en')
  const dir = t.dir
  const missing = arrival === null || departure === null
  const wantsAnyRide = arrival === true || departure === true
  const schedule = person ? getTransferSchedule(person.event_slug) : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (missing) return
    setSaving(true)
    setSubmitErr('')
    const res = await fetch(`/api/transfer/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transfer_arrival: arrival,
        transfer_departure: departure,
        transfer_large_luggage: wantsAnyRide ? luggage : null,
        transfer_flight_info: flightInfo || null,
      }),
    })
    setSaving(false)
    if (res.ok) {
      setSubmitted(true)
    } else {
      const j = await res.json().catch(() => ({})) as { error?: string }
      setSubmitErr(j.error ?? 'Something went wrong. Please try again.')
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <p style={{ color: '#9ca3af' }}>{t.loading}</p>
    </div>
  )

  if (loadErr) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center', color: '#6b7280', padding: '0 1.5rem' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>{t.invalidLink}</p>
        <p style={{ fontSize: '0.85rem' }}>{t.contactUs}</p>
      </div>
    </div>
  )

  if (submitted) return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem', direction: dir }}>
      <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>✓</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a2a3a', marginBottom: 8 }}>{t.allSet}</h2>
        <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{t.allSetMsg(person?.first_name ?? '')}</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem', direction: dir }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4A853', fontWeight: 700, marginBottom: 4 }}>{t.docLabel}</p>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a2a3a', marginBottom: 0 }}>{t.title}</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={sec}>{t.greeting(person?.first_name ?? '')}</h2>
            <p style={{ color: '#6b7280', lineHeight: 1.7, fontSize: '0.9rem', margin: '0.5rem 0 1.5rem' }}>{t.intro}</p>

            {hadPrior && (
              <div style={{ background: '#fef9f0', border: '1px solid #fcd34d', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: '#92400e' }}>
                {t.reviewNote}
              </div>
            )}

            {schedule && (
              <div style={{ marginBottom: '1.5rem', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '0.9rem 1rem' }}>
                <p style={{ margin: '0 0 0.6rem', fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>{t.scheduleTitle}</p>
                <p style={{ margin: '0 0 0.2rem', fontSize: '0.8rem', color: '#6b7280' }}>{t.arrivalScheduleLabel} — {formatTransferDateTime(schedule.arrivalDateTime, person?.locale ?? 'en')}</p>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', color: '#9ca3af' }}>{t.whatsappNote}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{t.departureScheduleLabel} — {formatTransferDateTime(schedule.departureDateTime, person?.locale ?? 'en')}</p>
              </div>
            )}

            {/* Arrival */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={lbl}>{t.arrivalLabel} *</label>
              <div style={optionRow}>
                <div onClick={() => setArrival(true)} style={pill(arrival === true)}>{t.yes}</div>
                <div onClick={() => setArrival(false)} style={pill(arrival === false)}>{t.no}</div>
              </div>
            </div>

            {/* Departure */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={lbl}>{t.departureLabel} *</label>
              <div style={optionRow}>
                <div onClick={() => setDeparture(true)} style={pill(departure === true)}>{t.yes}</div>
                <div onClick={() => setDeparture(false)} style={pill(departure === false)}>{t.no}</div>
              </div>
            </div>

            {/* Luggage — only relevant if riding at least one leg */}
            {wantsAnyRide && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={lbl}>{t.luggageLabel}</label>
                <p style={{ margin: '0 0 0.6rem', fontSize: '0.78rem', color: '#9ca3af' }}>{t.luggageHint}</p>
                <div style={optionRow}>
                  <div onClick={() => setLuggage(true)} style={pill(luggage === true)}>{t.luggageYes}</div>
                  <div onClick={() => setLuggage(false)} style={pill(luggage === false)}>{t.luggageNo}</div>
                </div>
              </div>
            )}

            {/* Flight info — optional */}
            {wantsAnyRide && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={lbl}>{t.flightLabel}</label>
                <input
                  type="text"
                  value={flightInfo}
                  onChange={e => setFlightInfo(e.target.value)}
                  placeholder={t.flightPlaceholder}
                  dir="ltr"
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '0.7rem 0.9rem',
                    border: '1.5px solid #d1d5db', borderRadius: 8, fontSize: '0.9rem', color: '#374151',
                  }}
                />
              </div>
            )}

            {missing && (arrival !== null || departure !== null) && (
              <p style={{ color: '#b91c1c', fontSize: '0.82rem', margin: '0 0 1rem' }}>{t.validationMsg}</p>
            )}

            {submitErr && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.9rem 1rem', marginBottom: '1rem' }}>
                <p style={{ color: '#b91c1c', margin: 0, fontSize: '0.88rem' }}>{submitErr}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={missing || saving}
              style={{
                width: '100%', padding: '0.85rem', border: 'none', borderRadius: 6, fontSize: '1rem', fontWeight: 700,
                background: missing ? '#d1d5db' : '#D4A853', color: missing ? '#9ca3af' : '#0B1D2A',
                cursor: missing || saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s',
              }}
            >
              {saving ? t.submitting : hadPrior ? t.update : t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
