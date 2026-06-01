'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/AdminShell'

interface WaitlistEntry {
  id: string
  retreat_slug: string
  name: string
  email: string
  locale: string
  notified_at: string | null
  created_at: string
}

interface RetreatSummary {
  slug: string
  title_en: string
  status: string
}

const cellStyle: React.CSSProperties = {
  padding: '0.7rem 1rem',
  fontSize: '0.82rem',
  color: 'rgba(226,232,240,0.75)',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  whiteSpace: 'nowrap',
}

const headStyle: React.CSSProperties = {
  ...cellStyle,
  color: 'rgba(226,232,240,0.35)',
  fontSize: '0.65rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: 500,
  paddingBottom: '0.5rem',
}

export default function CustomersPage() {
  const [retreats, setRetreats] = useState<RetreatSummary[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [notifying, setNotifying] = useState(false)
  const [notifyResult, setNotifyResult] = useState<{ sent: number } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('retreats')
        .select('slug, title_en, status')
        .order('sort_order', { ascending: true })
      if (data) setRetreats(data as RetreatSummary[])
      setLoading(false)
    }
    void load()
  }, [])

  const loadEntries = useCallback(async (slug: string) => {
    setSelectedSlug(slug)
    setNotifyResult(null)
    const { data } = await supabase
      .from('waitlist')
      .select('*')
      .eq('retreat_slug', slug)
      .order('created_at', { ascending: true })
    setEntries((data ?? []) as WaitlistEntry[])
  }, [])

  async function handleNotify() {
    if (!selectedSlug) return
    const retreat = retreats.find((r) => r.slug === selectedSlug)
    if (!retreat) return

    if (!confirm(`Send "spot opened" email to all un-notified waitlist entries for ${retreat.title_en}? This will also change the retreat status to "last-spots".`)) return

    setNotifying(true)
    setNotifyResult(null)
    const res = await fetch('/api/waitlist/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        retreat_slug: selectedSlug,
        retreat_title: retreat.title_en,
        retreat_dates: '',
        retreat_link: `https://upsidedown-retreat.com/en/events/${selectedSlug}`,
      }),
    })
    const json = await res.json() as { sent?: number }
    setNotifying(false)
    setNotifyResult({ sent: json.sent ?? 0 })
    void loadEntries(selectedSlug)
  }

  function exportCSV() {
    if (!entries.length) return
    const header = 'Name,Email,Locale,Signed Up,Notified'
    const rows = entries.map((e) =>
      [e.name, e.email, e.locale, new Date(e.created_at).toLocaleDateString(), e.notified_at ? new Date(e.notified_at).toLocaleDateString() : '—'].join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `waitlist-${selectedSlug}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const pendingCount = entries.filter((e) => !e.notified_at).length

  if (loading) return (
    <AdminShell>
      <p style={{ color: 'rgba(226,232,240,0.35)', fontSize: '0.85rem' }}>Loading...</p>
    </AdminShell>
  )

  return (
    <AdminShell>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#e2e8f0', marginBottom: '0.35rem' }}>
          Customers
        </h1>
        <p style={{ fontSize: '0.8rem', color: 'rgba(226,232,240,0.35)' }}>
          Waitlist management · Select a retreat to view entries
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Retreat list */}
        <div style={{ background: '#0d1526', borderRadius: '8px', overflow: 'hidden' }}>
          {retreats.length === 0 ? (
            <p style={{ padding: '1rem', color: 'rgba(226,232,240,0.3)', fontSize: '0.8rem' }}>No retreats</p>
          ) : (
            retreats.map((r) => (
              <button
                key={r.slug}
                onClick={() => loadEntries(r.slug)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  background: selectedSlug === r.slug ? 'rgba(212,168,83,0.1)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'pointer',
                  color: selectedSlug === r.slug ? '#D4A853' : 'rgba(226,232,240,0.6)',
                  fontSize: '0.82rem',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ display: 'block', marginBottom: '0.15rem' }}>{r.title_en}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.5, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{r.status}</span>
              </button>
            ))
          )}
        </div>

        {/* Waitlist table */}
        <div>
          {!selectedSlug ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(226,232,240,0.2)', fontSize: '0.85rem' }}>
              Select a retreat to view its waitlist
            </div>
          ) : (
            <>
              {/* Action bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.8rem' }}>
                  {entries.length} total · {pendingCount} pending notification
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={exportCSV}
                    disabled={!entries.length}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.75rem',
                      color: 'rgba(226,232,240,0.5)',
                      cursor: entries.length ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s',
                    }}
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={handleNotify}
                    disabled={notifying || pendingCount === 0}
                    style={{
                      background: pendingCount > 0 ? '#D4A853' : 'rgba(212,168,83,0.2)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.45rem 0.9rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: pendingCount > 0 ? '#0B1D2A' : 'rgba(212,168,83,0.4)',
                      cursor: pendingCount > 0 ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s',
                    }}
                  >
                    {notifying ? 'Sending...' : `Notify Waitlist (${pendingCount})`}
                  </button>
                </div>
              </div>

              {notifyResult && (
                <div style={{
                  marginBottom: '1rem',
                  padding: '0.65rem 1rem',
                  background: 'rgba(74,155,184,0.1)',
                  border: '1px solid rgba(74,155,184,0.3)',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: '#4A9BB8',
                }}>
                  Sent {notifyResult.sent} notification{notifyResult.sent !== 1 ? 's' : ''}. Retreat status changed to "last-spots".
                </div>
              )}

              {entries.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(226,232,240,0.2)', fontSize: '0.85rem' }}>
                  No waitlist entries for this retreat
                </div>
              ) : (
                <div style={{ background: '#0d1526', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Name', 'Email', 'Lang', 'Signed Up', 'Notified'].map((h) => (
                          <th key={h} style={{ ...headStyle, textAlign: 'left' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((e) => (
                        <tr
                          key={e.id}
                          style={{ opacity: e.notified_at ? 0.45 : 1 }}
                        >
                          <td style={cellStyle}>{e.name}</td>
                          <td style={cellStyle}>
                            <a
                              href={`mailto:${e.email}`}
                              style={{ color: '#D4A853', textDecoration: 'none' }}
                            >
                              {e.email}
                            </a>
                          </td>
                          <td style={{ ...cellStyle, textTransform: 'uppercase', fontSize: '0.7rem' }}>{e.locale}</td>
                          <td style={cellStyle}>{new Date(e.created_at).toLocaleDateString()}</td>
                          <td style={cellStyle}>
                            {e.notified_at ? (
                              <span style={{ color: '#4A9BB8', fontSize: '0.75rem' }}>
                                ✓ {new Date(e.notified_at).toLocaleDateString()}
                              </span>
                            ) : (
                              <span style={{ color: 'rgba(226,232,240,0.25)' }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminShell>
  )
}
