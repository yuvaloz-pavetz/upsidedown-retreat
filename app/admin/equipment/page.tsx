'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'

const GEAR_LABEL: Record<string, string> = {
  mask: 'Mask', snorkel: 'Snorkel', wetsuit: 'Wetsuit', fins: 'Fins', weight_belt: 'Weight Belt',
}
const ALL_GEAR = Object.keys(GEAR_LABEL)

const cell: React.CSSProperties = {
  padding: '0.6rem 0.9rem', fontSize: '0.82rem',
  color: 'rgba(226,232,240,0.75)', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'top',
}
const head: React.CSSProperties = {
  ...cell, color: 'rgba(226,232,240,0.3)', fontSize: '0.62rem',
  letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500,
}
const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 8, padding: '1rem 1.25rem',
}
const cardTitle: React.CSSProperties = {
  fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase',
  color: 'rgba(212,168,83,0.6)', marginBottom: 10,
}

interface IntakeLead {
  first_name: string; last_name: string; email: string; event_slug: string; status: string
  shoe_size?: string | null; height?: number | null; weight?: number | null
  has_dive_gear?: boolean | null; gear_items?: string[] | null
  food_allergies?: string | null; medical_notes?: string | null; intake_submitted_at?: string | null
}

function hasMedicalYes(notes: string | null | undefined) {
  if (!notes) return false
  try {
    const d = JSON.parse(notes) as { conditions?: Record<string, boolean> }
    return Object.values(d.conditions ?? {}).some(v => v === true)
  } catch { return false }
}

function gearNeeded(lead: IntakeLead): string[] {
  if (!lead.has_dive_gear) return ALL_GEAR
  const has = lead.gear_items ?? []
  return ALL_GEAR.filter(g => !has.includes(g))
}

export default function EquipmentPage() {
  const [leads, setLeads] = useState<IntakeLead[]>([])
  const [events, setEvents] = useState<string[]>([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetch('/api/admin/leads')
      .then(r => r.json())
      .then((j: { leads?: IntakeLead[] }) => {
        const rows = (j.leads ?? [])
          .filter(l => ['partially_paid', 'paid', 'past'].includes(l.status))
          .sort((a, b) => a.event_slug.localeCompare(b.event_slug))
        setLeads(rows)
        const slugs = [...new Set(rows.map(r => r.event_slug))].sort()
        setEvents(slugs)
        if (slugs.length > 0) setSelectedEvent(slugs[0])
        setLoading(false)
      })
  }, [])

  const filtered = leads.filter(l => l.event_slug === selectedEvent)

  // Aggregations
  const shoeSizes = new Map<string, number>()
  const needGear = new Map<string, string[]>()
  const gearTotals = new Map<string, number>(ALL_GEAR.map(g => [g, 0]))
  const foodNotes: string[] = []
  let medicalAlerts = 0

  for (const l of filtered) {
    const size = (l.shoe_size ?? '').trim()
    if (size) shoeSizes.set(size, (shoeSizes.get(size) ?? 0) + 1)
    const needed = gearNeeded(l)
    if (needed.length > 0) needGear.set(`${l.first_name} ${l.last_name}`, needed)
    for (const g of needed) gearTotals.set(g, (gearTotals.get(g) ?? 0) + 1)
    if (l.food_allergies?.trim()) foodNotes.push(`${l.first_name} ${l.last_name}: ${l.food_allergies.trim()}`)
    if (hasMedicalYes(l.medical_notes)) medicalAlerts++
  }

  const sortedSizes = [...shoeSizes.entries()].sort((a, b) => {
    const na = parseFloat(a[0]), nb = parseFloat(b[0])
    return isNaN(na) || isNaN(nb) ? a[0].localeCompare(b[0]) : na - nb
  })

  return (
    <AdminShell>
      <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#e2e8f0' }}>Equipment Summary</h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(226,232,240,0.35)', fontSize: '0.82rem' }}>
            Aggregated gear requirements from submitted intake forms.
          </p>
        </div>

        {loading ? (
          <p style={{ color: 'rgba(226,232,240,0.3)' }}>Loading...</p>
        ) : events.length === 0 ? (
          <p style={{ color: 'rgba(226,232,240,0.3)' }}>No paid participants yet.</p>
        ) : (
          <>
            {/* Event selector */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {events.map(slug => (
                <button key={slug} onClick={() => setSelectedEvent(slug)} style={{
                  padding: '0.45rem 1rem', borderRadius: 6, fontSize: '0.82rem', cursor: 'pointer', border: 'none',
                  background: selectedEvent === slug ? '#D4A853' : 'rgba(255,255,255,0.07)',
                  color: selectedEvent === slug ? '#0B1D2A' : 'rgba(226,232,240,0.6)',
                  fontWeight: selectedEvent === slug ? 700 : 400,
                }}>{slug}</button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p style={{ color: 'rgba(226,232,240,0.3)' }}>No paid participants for this event.</p>
            ) : (
              <>
                {/* Summary cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>

                  <div style={card}>
                    <p style={cardTitle}>Participants</p>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#D4A853' }}>{filtered.length}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(226,232,240,0.35)' }}>
                      {filtered.filter(l => l.intake_submitted_at).length} of {filtered.length} submitted intake
                    </p>
                  </div>

                  <div style={card}>
                    <p style={cardTitle}>Fin Sizes Needed</p>
                    {sortedSizes.length === 0 ? (
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(226,232,240,0.3)' }}>—</p>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {sortedSizes.map(([size, count]) => (
                          <span key={size} style={{
                            background: 'rgba(212,168,83,0.15)', color: '#D4A853',
                            borderRadius: 5, padding: '0.25rem 0.6rem', fontSize: '0.82rem', fontWeight: 600,
                          }}>
                            EU {size} <span style={{ opacity: 0.5, fontSize: '0.72rem' }}>×{count}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={card}>
                    <p style={cardTitle}>Gear to Provide</p>
                    <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: needGear.size > 0 ? '#f87171' : '#5A9A6F' }}>{needGear.size}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(226,232,240,0.35)' }}>participants need rental gear</p>
                  </div>

                  {medicalAlerts > 0 && (
                    <div style={{ ...card, borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.05)' }}>
                      <p style={{ ...cardTitle, color: 'rgba(248,113,113,0.7)' }}>Medical Alerts</p>
                      <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#f87171' }}>{medicalAlerts}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(226,232,240,0.35)' }}>flagged conditions — check email</p>
                    </div>
                  )}
                </div>

                {/* Gear totals to procure */}
                {needGear.size > 0 && (
                  <div style={{ ...card, marginBottom: '2rem' }}>
                    <p style={cardTitle}>Total to Bring / Rent</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      {ALL_GEAR.filter(g => (gearTotals.get(g) ?? 0) > 0).map(g => (
                        <div key={g} style={{
                          display: 'flex', alignItems: 'baseline', gap: '0.4rem',
                          background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)',
                          borderRadius: 6, padding: '0.4rem 0.8rem',
                        }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#D4A853' }}>{gearTotals.get(g)}</span>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(226,232,240,0.6)' }}>{GEAR_LABEL[g] ?? g}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gear needs breakdown */}
                {needGear.size > 0 && (
                  <div style={{ ...card, marginBottom: '2rem' }}>
                    <p style={cardTitle}>Rental Gear Required (per person)</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {[...needGear.entries()].map(([name, items]) => (
                        <div key={name} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ color: 'rgba(226,232,240,0.7)', minWidth: 140, fontSize: '0.85rem' }}>{name}</span>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {items.map(g => (
                              <span key={g} style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.07)', color: 'rgba(226,232,240,0.5)', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                                {GEAR_LABEL[g] ?? g}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Food allergies */}
                {foodNotes.length > 0 && (
                  <div style={{ ...card, marginBottom: '2rem' }}>
                    <p style={cardTitle}>Food Allergies & Dietary Restrictions</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {foodNotes.map((n, i) => (
                        <p key={i} style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(226,232,240,0.65)' }}>{n}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full participant table */}
                <div style={{ background: '#0d1526', borderRadius: 8, overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                    <thead>
                      <tr>
                        {['Name', 'Height', 'Weight', 'Shoe (EU)', 'Own Gear', 'Needs Rental', 'Food Notes', '⚕'].map((h, i) => (
                          <th key={i} style={{ ...head, textAlign: 'left' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((l, i) => {
                        const needed = gearNeeded(l)
                        const ownItems = l.has_dive_gear ? (l.gear_items ?? []) : []
                        const med = hasMedicalYes(l.medical_notes)
                        return (
                          <tr key={i}>
                            <td style={{ ...cell, color: '#e2e8f0' }}>
                              {l.first_name} {l.last_name}
                              {!l.intake_submitted_at && (
                                <span title="Intake not yet submitted" style={{ marginLeft: '0.4rem', fontSize: '0.65rem', color: 'rgba(251,191,36,0.6)', verticalAlign: 'middle' }}>○</span>
                              )}
                            </td>
                            <td style={cell}>{l.height ?? '—'}</td>
                            <td style={cell}>{l.weight ?? '—'}</td>
                            <td style={{ ...cell, color: l.shoe_size ? '#D4A853' : 'rgba(226,232,240,0.3)', fontWeight: 600 }}>
                              {l.shoe_size ?? '—'}
                            </td>
                            <td style={cell}>
                              {ownItems.length > 0
                                ? ownItems.map(g => GEAR_LABEL[g] ?? g).join(', ')
                                : <span style={{ color: 'rgba(226,232,240,0.25)' }}>—</span>}
                            </td>
                            <td style={cell}>
                              {needed.length > 0
                                ? <span style={{ color: '#f87171', fontSize: '0.78rem' }}>{needed.map(g => GEAR_LABEL[g] ?? g).join(', ')}</span>
                                : <span style={{ color: '#5A9A6F' }}>✓</span>}
                            </td>
                            <td style={cell}>
                              {l.food_allergies
                                ? <span style={{ color: '#fbbf24' }}>{l.food_allergies}</span>
                                : <span style={{ color: 'rgba(226,232,240,0.2)' }}>—</span>}
                            </td>
                            <td style={cell}>
                              {med
                                ? <span title="Medical condition flagged" style={{ color: '#f87171' }}>⚠️</span>
                                : <span style={{ color: 'rgba(226,232,240,0.15)' }}>—</span>}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </AdminShell>
  )
}
