'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { ELIGIBLE_LEAD_STATUSES, getTransferSchedule, formatTransferDateTime } from '@/lib/transfer-config'

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
const btn: React.CSSProperties = {
  padding: '0.55rem 1.1rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700,
  border: 'none', cursor: 'pointer', background: '#D4A853', color: '#0B1D2A',
}
const btnGhost: React.CSSProperties = {
  ...btn, background: 'rgba(255,255,255,0.06)', color: 'rgba(226,232,240,0.75)', fontWeight: 500,
}
const selectSm: React.CSSProperties = {
  fontSize: '0.78rem', padding: '0.3rem 0.5rem', borderRadius: 4,
  background: '#0d1526', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)',
}
const yesTag: React.CSSProperties = { color: '#5A9A6F', fontWeight: 700 }
const noTag: React.CSSProperties = { color: 'rgba(226,232,240,0.35)' }

interface Person {
  id: string; first_name: string; last_name: string; email: string; event_slug: string
  status: string; person_type?: string | null; locale: string; intake_token?: string | null
  transfer_arrival?: boolean | null; transfer_departure?: boolean | null
  transfer_large_luggage?: boolean | null; transfer_flight_info?: string | null
  transfer_submitted_at?: string | null; transfer_source?: string | null
}

type Kind = 'initial' | 'reminder'
interface DryRun {
  recipientCount: number
  recipients: { id: string; name: string; email: string; personType: string }[]
  preview: { name: string; email: string; url: string; subject: string; html: string }[]
}

function yesNo(v: boolean | null | undefined): React.ReactNode {
  if (v === true) return <span style={yesTag}>Yes</span>
  if (v === false) return <span style={noTag}>No</span>
  return <span style={noTag}>—</span>
}

export default function TransfersAdminPage() {
  const [people, setPeople] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{ transfer_arrival: string; transfer_departure: string; transfer_large_luggage: string; transfer_flight_info: string }>({
    transfer_arrival: '', transfer_departure: '', transfer_large_luggage: '', transfer_flight_info: '',
  })

  const [emailKind, setEmailKind] = useState<Kind>('initial')
  const [dryRun, setDryRun] = useState<DryRun | null>(null)
  const [dryRunLoading, setDryRunLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [sendResult, setSendResult] = useState<{ sent: number; total: number } | null>(null)
  const [sending, setSending] = useState(false)

  const [testEmail, setTestEmail] = useState('')
  const [testLeadId, setTestLeadId] = useState('')
  const [testPreview, setTestPreview] = useState<{ to: string; subject: string; html: string; url: string } | null>(null)
  const [testSending, setTestSending] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  function load() {
    void fetch('/api/admin/leads')
      .then(r => r.json())
      .then((j: { leads?: Person[] }) => {
        const rows = j.leads ?? []
        setPeople(rows)
        const slugs = [...new Set(rows.map(r => r.event_slug))].sort()
        if (slugs.length > 0 && !selectedEvent) setSelectedEvent(slugs[0])
        setLoading(false)
      })
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const events = useMemo(() => [...new Set(people.map(p => p.event_slug))].sort(), [people])
  const schedule = selectedEvent ? getTransferSchedule(selectedEvent) : null

  const eligible = useMemo(() => people.filter(p =>
    p.event_slug === selectedEvent &&
    (p.person_type === 'staff' || (ELIGIBLE_LEAD_STATUSES as readonly string[]).includes(p.status))
  ), [people, selectedEvent])

  const submitted = eligible.filter(p => p.transfer_submitted_at)
  const missing = eligible.filter(p => !p.transfer_submitted_at)
  const wantsArrival = submitted.filter(p => p.transfer_arrival)
  const wantsDeparture = submitted.filter(p => p.transfer_departure)
  const wantsLargeLuggage = submitted.filter(p => (p.transfer_arrival || p.transfer_departure) && p.transfer_large_luggage)

  async function saveEdit(id: string) {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        transfer_arrival: editForm.transfer_arrival === '' ? null : editForm.transfer_arrival === 'yes',
        transfer_departure: editForm.transfer_departure === '' ? null : editForm.transfer_departure === 'yes',
        transfer_large_luggage: editForm.transfer_large_luggage === '' ? null : editForm.transfer_large_luggage === 'yes',
        transfer_flight_info: editForm.transfer_flight_info || null,
        transfer_submitted_at: new Date().toISOString(),
        transfer_source: 'admin',
      }),
    })
    setEditingId(null)
    load()
  }

  async function runDryRun(kind: Kind) {
    setEmailKind(kind)
    setDryRun(null)
    setSendResult(null)
    setConfirmText('')
    setDryRunLoading(true)
    const res = await fetch('/api/admin/transfer/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, eventSlug: selectedEvent }),
    })
    const json = await res.json() as DryRun & { error?: string }
    setDryRunLoading(false)
    if (!json.error) setDryRun(json)
  }

  async function confirmSend() {
    if (confirmText !== 'SEND') return
    setSending(true)
    const res = await fetch('/api/admin/transfer/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: emailKind, eventSlug: selectedEvent, confirm: true }),
    })
    const json = await res.json() as { sent?: number; total?: number; error?: string }
    setSending(false)
    if (!json.error) {
      setSendResult({ sent: json.sent ?? 0, total: json.total ?? 0 })
      setDryRun(null)
    }
  }

  async function previewTest() {
    if (!testEmail) return
    setTestSending(true)
    setTestResult(null)
    const res = await fetch('/api/admin/transfer/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'test', eventSlug: selectedEvent, testEmail, testLeadId: testLeadId || undefined }),
    })
    const json = await res.json() as { preview?: { to: string; subject: string; html: string; url: string }; error?: string }
    setTestSending(false)
    if (json.preview) setTestPreview(json.preview)
  }

  async function sendTest() {
    setTestSending(true)
    setTestResult(null)
    const res = await fetch('/api/admin/transfer/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'test', eventSlug: selectedEvent, testEmail, testLeadId: testLeadId || undefined, confirm: true }),
    })
    const json = await res.json() as { ok?: boolean; error?: string }
    setTestSending(false)
    setTestResult(json.ok ? 'Test email sent.' : `Failed: ${json.error ?? 'unknown error'}`)
  }

  function exportCSV() {
    const rows = submitted.map(p => [
      `${p.first_name} ${p.last_name}`, p.email,
      p.transfer_arrival ? 'Yes' : 'No',
      p.transfer_departure ? 'Yes' : 'No',
      (p.transfer_arrival || p.transfer_departure) ? (p.transfer_large_luggage ? 'Yes' : 'No') : '',
      p.transfer_flight_info ?? '',
    ])
    const csv = [['Name', 'Email', 'Arrival Pickup', 'Departure Drop-off', 'Large Luggage', 'Flight Info'], ...rows]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `airport-transfer-${selectedEvent || 'export'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminShell>
      <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#e2e8f0' }}>Airport Transfer</h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(226,232,240,0.35)', fontSize: '0.82rem' }}>
            {schedule ? `${schedule.airport} · pickup ${formatTransferDateTime(schedule.arrivalDateTime, 'en')} · drop-off ${formatTransferDateTime(schedule.departureDateTime, 'en')}` : 'No fixed schedule configured for this event — add one in lib/transfer-config.ts.'}
          </p>
        </div>

        {loading ? (
          <p style={{ color: 'rgba(226,232,240,0.3)' }}>Loading...</p>
        ) : events.length === 0 ? (
          <p style={{ color: 'rgba(226,232,240,0.3)' }}>No leads yet.</p>
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

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={card}>
                <p style={cardTitle}>Eligible People</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#D4A853' }}>{eligible.length}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(226,232,240,0.35)' }}>{submitted.length} responded</p>
              </div>
              <div style={card}>
                <p style={cardTitle}>Wants Pickup (Arrival)</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#5A9A6F' }}>{wantsArrival.length}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(226,232,240,0.35)' }}>seats needed</p>
              </div>
              <div style={card}>
                <p style={cardTitle}>Wants Drop-off (Departure)</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#5A9A6F' }}>{wantsDeparture.length}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(226,232,240,0.35)' }}>seats needed</p>
              </div>
              <div style={card}>
                <p style={cardTitle}>Large Luggage</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#D4A853' }}>{wantsLargeLuggage.length}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(226,232,240,0.35)' }}>of {wantsArrival.length + wantsDeparture.length > 0 ? new Set([...wantsArrival, ...wantsDeparture].map(p => p.id)).size : 0} riding</p>
              </div>
              <div style={card}>
                <p style={cardTitle}>Missing</p>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: missing.length > 0 ? '#f87171' : '#5A9A6F' }}>{missing.length}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'rgba(226,232,240,0.35)' }}>have not responded</p>
              </div>
            </div>

            {/* Who's riding — quick roster for organizing the van */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={card}>
                <p style={cardTitle}>Arrival Pickup Roster ({wantsArrival.length})</p>
                {wantsArrival.length === 0 ? <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(226,232,240,0.3)' }}>—</p> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {wantsArrival.map(p => (
                      <p key={p.id} style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0' }}>
                        {p.first_name} {p.last_name}
                        {p.transfer_large_luggage && <span style={{ color: '#D4A853', fontSize: '0.72rem' }}> · large bag</span>}
                        {p.transfer_flight_info && <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.72rem' }}> · {p.transfer_flight_info}</span>}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div style={card}>
                <p style={cardTitle}>Departure Drop-off Roster ({wantsDeparture.length})</p>
                {wantsDeparture.length === 0 ? <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(226,232,240,0.3)' }}>—</p> : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {wantsDeparture.map(p => (
                      <p key={p.id} style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0' }}>
                        {p.first_name} {p.last_name}
                        {p.transfer_large_luggage && <span style={{ color: '#D4A853', fontSize: '0.72rem' }}> · large bag</span>}
                        {p.transfer_flight_info && <span style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.72rem' }}> · {p.transfer_flight_info}</span>}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Export */}
            {submitted.length > 0 && (
              <div style={{ ...card, marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ ...cardTitle, margin: 0 }}>Export all responses (for the driver / van planning)</p>
                <button onClick={exportCSV} style={btn}>Export CSV</button>
              </div>
            )}

            {/* Missing list */}
            {missing.length > 0 && (
              <div style={{ ...card, marginBottom: '2rem', borderColor: 'rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.05)' }}>
                <p style={{ ...cardTitle, color: 'rgba(248,113,113,0.7)' }}>Have Not Responded ({missing.length})</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {missing.map(p => (
                    <span key={p.id} style={{ fontSize: '0.8rem', color: '#f87171', background: 'rgba(248,113,113,0.1)', borderRadius: 5, padding: '0.3rem 0.7rem', fontWeight: 600 }}>
                      {p.first_name} {p.last_name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full table with manual entry */}
            <div style={{ background: '#0d1526', borderRadius: 8, overflow: 'auto', marginBottom: '2rem' }}>
              <div style={{ padding: '0.9rem 0.9rem 0' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>All Eligible People</p>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                <thead>
                  <tr>{['Name', 'Arrival', 'Departure', 'Large Luggage', 'Flight Info', 'Submitted', 'Source', ''].map((h, i) => <th key={i} style={{ ...head, textAlign: 'left' }}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {eligible.map(p => {
                    const isEditing = editingId === p.id
                    return (
                      <tr key={p.id}>
                        <td style={{ ...cell, color: '#e2e8f0' }}>{p.first_name} {p.last_name}<br /><span style={{ fontSize: '0.7rem', color: 'rgba(226,232,240,0.3)' }}>{p.email}</span></td>
                        {isEditing ? (
                          <>
                            <td style={cell}>
                              <select value={editForm.transfer_arrival} onChange={e => setEditForm(f => ({ ...f, transfer_arrival: e.target.value }))} style={selectSm}>
                                <option value="">—</option><option value="yes">Yes</option><option value="no">No</option>
                              </select>
                            </td>
                            <td style={cell}>
                              <select value={editForm.transfer_departure} onChange={e => setEditForm(f => ({ ...f, transfer_departure: e.target.value }))} style={selectSm}>
                                <option value="">—</option><option value="yes">Yes</option><option value="no">No</option>
                              </select>
                            </td>
                            <td style={cell}>
                              <select value={editForm.transfer_large_luggage} onChange={e => setEditForm(f => ({ ...f, transfer_large_luggage: e.target.value }))} style={selectSm}>
                                <option value="">—</option><option value="yes">Yes</option><option value="no">No</option>
                              </select>
                            </td>
                            <td style={cell}>
                              <input value={editForm.transfer_flight_info} onChange={e => setEditForm(f => ({ ...f, transfer_flight_info: e.target.value }))} style={{ ...selectSm, width: 100 }} />
                            </td>
                            <td style={cell}>—</td>
                            <td style={cell}>admin</td>
                            <td style={cell}>
                              <button onClick={() => saveEdit(p.id)} style={{ ...btn, padding: '0.3rem 0.7rem', marginRight: 6 }}>Save</button>
                              <button onClick={() => setEditingId(null)} style={{ ...btnGhost, padding: '0.3rem 0.7rem' }}>Cancel</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={cell}>{yesNo(p.transfer_arrival)}</td>
                            <td style={cell}>{yesNo(p.transfer_departure)}</td>
                            <td style={cell}>{(p.transfer_arrival || p.transfer_departure) ? yesNo(p.transfer_large_luggage) : <span style={noTag}>—</span>}</td>
                            <td style={cell}>{p.transfer_flight_info || <span style={noTag}>—</span>}</td>
                            <td style={cell}>{p.transfer_submitted_at ? new Date(p.transfer_submitted_at).toLocaleDateString() : <span style={{ color: 'rgba(248,113,113,0.7)' }}>pending</span>}</td>
                            <td style={cell}>{p.transfer_source ?? '—'}</td>
                            <td style={cell}>
                              <button onClick={() => { setEditingId(p.id); setEditForm({ transfer_arrival: p.transfer_arrival == null ? '' : p.transfer_arrival ? 'yes' : 'no', transfer_departure: p.transfer_departure == null ? '' : p.transfer_departure ? 'yes' : 'no', transfer_large_luggage: p.transfer_large_luggage == null ? '' : p.transfer_large_luggage ? 'yes' : 'no', transfer_flight_info: p.transfer_flight_info ?? '' }) }} style={{ ...btnGhost, padding: '0.3rem 0.7rem' }}>
                                {p.transfer_submitted_at ? 'Correct' : 'Enter'}
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Brevo email workflow */}
            <div style={{ ...card, marginBottom: '2rem' }}>
              <p style={cardTitle}>Email Workflow (Brevo) — nothing is sent without explicit confirmation</p>

              <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => runDryRun('initial')} disabled={dryRunLoading} style={btn}>Preview Initial Email</button>
                <button onClick={() => runDryRun('reminder')} disabled={dryRunLoading} style={btnGhost}>Preview Reminder (missing only)</button>
              </div>

              {dryRunLoading && <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.82rem' }}>Loading preview…</p>}

              {dryRun && (
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#e2e8f0' }}>
                    <strong>{dryRun.recipientCount}</strong> {emailKind === 'reminder' ? 'people who have not yet submitted' : 'eligible people'} will receive this email for <strong>{selectedEvent}</strong>.
                  </p>
                  {dryRun.recipientCount === 0 ? (
                    <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.82rem' }}>No recipients — nothing to send.</p>
                  ) : (
                    <>
                      <div style={{ maxHeight: 140, overflow: 'auto', marginBottom: '1rem', fontSize: '0.78rem', color: 'rgba(226,232,240,0.6)' }}>
                        {dryRun.recipients.map(r => <div key={r.id}>{r.name} — {r.email} ({r.personType})</div>)}
                      </div>
                      {dryRun.preview[0] && (
                        <details style={{ marginBottom: '1rem' }}>
                          <summary style={{ cursor: 'pointer', fontSize: '0.8rem', color: '#D4A853' }}>Preview rendered email &amp; personalized link ({dryRun.preview[0].name})</summary>
                          <p style={{ fontSize: '0.78rem', color: 'rgba(226,232,240,0.5)', margin: '0.5rem 0' }}>
                            Subject: {dryRun.preview[0].subject}<br />Link: {dryRun.preview[0].url}
                          </p>
                          <iframe title="email-preview" srcDoc={dryRun.preview[0].html} style={{ width: '100%', height: 360, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#fff' }} />
                        </details>
                      )}

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                        <p style={{ fontSize: '0.82rem', color: '#f87171', marginBottom: 8 }}>
                          Type <strong>SEND</strong> to confirm sending to {dryRun.recipientCount} real recipients. This cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <input value={confirmText} onChange={e => setConfirmText(e.target.value)} placeholder="SEND" style={{ ...selectSm, width: 120 }} />
                          <button onClick={confirmSend} disabled={confirmText !== 'SEND' || sending} style={{ ...btn, opacity: confirmText === 'SEND' ? 1 : 0.4 }}>
                            {sending ? 'Sending…' : `Confirm & Send to ${dryRun.recipientCount}`}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {sendResult && (
                <p style={{ color: '#5A9A6F', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  ✓ Done — {sendResult.sent} of {sendResult.total} emails sent. See delivery log below.
                </p>
              )}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                <p style={{ fontSize: '0.78rem', color: 'rgba(226,232,240,0.4)', marginBottom: 8 }}>Admin test send — rendered content only goes to the address below, never to a real participant.</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <input placeholder="your-email@example.com" type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)} style={{ ...selectSm, width: 220 }} />
                  <select value={testLeadId} onChange={e => setTestLeadId(e.target.value)} style={selectSm}>
                    <option value="">Sample data</option>
                    {eligible.map(p => <option key={p.id} value={p.id}>Render as {p.first_name}</option>)}
                  </select>
                  <button onClick={previewTest} disabled={!testEmail || testSending} style={btnGhost}>Preview</button>
                  <button onClick={sendTest} disabled={!testEmail || testSending} style={btn}>{testSending ? 'Sending…' : 'Send Test'}</button>
                </div>
                {testPreview && (
                  <iframe title="test-preview" srcDoc={testPreview.html} style={{ width: '100%', height: 300, marginTop: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, background: '#fff' }} />
                )}
                {testResult && <p style={{ fontSize: '0.82rem', marginTop: 8, color: testResult.startsWith('Test email sent') ? '#5A9A6F' : '#f87171' }}>{testResult}</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminShell>
  )
}
