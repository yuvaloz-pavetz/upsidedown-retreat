'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/AdminShell'
import PaymentsPanel from '@/components/admin/PaymentsPanel'
import ContactCard from '@/components/admin/ContactCard'
import type { Lead, LeadStatus, Payment } from '@/lib/supabase/types'

const CURRENCIES = ['ILS', 'EUR', 'USD']

const STATUS_COLOR: Record<LeadStatus, string> = {
  interested:     '#4A9BB8',
  partially_paid: '#D4A853',
  paid:           '#5A9A6F',
  past:           'rgba(226,232,240,0.35)',
  irrelevant:     'rgba(226,232,240,0.18)',
}
const STATUS_LABEL: Record<LeadStatus, string> = {
  interested: 'Interested', partially_paid: 'Partial',
  paid: 'Paid', past: 'Past', irrelevant: 'Irrelevant',
}
const ALL_STATUSES: LeadStatus[] = ['interested', 'partially_paid', 'paid', 'past', 'irrelevant']

interface EventSummary { slug: string; title_en: string }

const cell: React.CSSProperties = {
  padding: '0.65rem 0.9rem', fontSize: '0.82rem',
  color: 'rgba(226,232,240,0.75)', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle',
}
const head: React.CSSProperties = {
  ...cell, color: 'rgba(226,232,240,0.3)', fontSize: '0.62rem',
  letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, paddingBottom: '0.5rem',
}
const addInp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '4px', padding: '0.45rem 0.65rem', fontSize: '0.82rem',
  color: '#e2e8f0', outline: 'none', fontFamily: 'inherit', width: '100%',
}

// ── Contacts view ──────────────────────────────────────────────────────────────

interface Contact {
  email: string; first_name: string; last_name: string; phone: string
  events: { slug: string; title: string; status: LeadStatus; amount: string }[]
}

interface ContactsViewProps {
  leads: Lead[]
  events: EventSummary[]
  onSelect: (email: string) => void
  onDeleteContact: (email: string) => void
}

function ContactsView({ leads, events, onSelect, onDeleteContact }: ContactsViewProps) {
  const slugToTitle = new Map(events.map(r => [r.slug, r.title_en]))
  const map = new Map<string, Contact>()

  for (const lead of leads) {
    const ev = {
      slug: lead.event_slug,
      title: slugToTitle.get(lead.event_slug) ?? lead.event_slug,
      status: lead.status,
      amount: lead.amount,
    }
    const existing = map.get(lead.email)
    if (existing) { existing.events.push(ev) }
    else { map.set(lead.email, { email: lead.email, first_name: lead.first_name, last_name: lead.last_name, phone: lead.phone, events: [ev] }) }
  }

  const contacts = Array.from(map.values())

  if (contacts.length === 0) return (
    <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(226,232,240,0.2)', fontSize: '0.85rem' }}>
      No contacts yet.
    </div>
  )

  return (
    <div style={{ background: '#0d1526', borderRadius: '8px', overflow: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
        <thead>
          <tr>
            {['Name', 'Email', 'Phone', 'Events', ''].map((h, i) => (
              <th key={i} style={{ ...head, textAlign: 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c.email}>
              <td style={{ ...cell, cursor: 'pointer' }} onClick={() => onSelect(c.email)}>
                <span style={{ color: '#e2e8f0' }}>{c.first_name} {c.last_name}</span>
                <span style={{ marginLeft: '0.4rem', fontSize: '0.65rem', color: 'rgba(212,168,83,0.5)' }}>›</span>
              </td>
              <td style={{ ...cell, cursor: 'pointer' }} onClick={() => onSelect(c.email)}>
                <span style={{ color: '#D4A853' }}>{c.email}</span>
              </td>
              <td style={{ ...cell, color: 'rgba(226,232,240,0.4)', cursor: 'pointer' }} onClick={() => onSelect(c.email)}>{c.phone || '—'}</td>
              <td style={{ ...cell, cursor: 'pointer' }} onClick={() => onSelect(c.email)}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {c.events.map(ev => (
                    <span key={ev.slug} style={{
                      fontSize: '0.68rem', color: STATUS_COLOR[ev.status],
                      background: `${STATUS_COLOR[ev.status]}22`,
                      borderRadius: 4, padding: '0.2rem 0.55rem', whiteSpace: 'nowrap',
                    }}>
                      {ev.title} · {STATUS_LABEL[ev.status]}
                      {ev.amount ? ` · ${ev.amount}` : ''}
                    </span>
                  ))}
                </div>
              </td>
              <td style={{ ...cell, padding: '0.65rem 0.5rem' }}>
                <button
                  onClick={() => onDeleteContact(c.email)}
                  title="Delete contact"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,113,113,0.35)', fontSize: '1rem', padding: '2px 6px', transition: 'color 0.15s', lineHeight: 1 }}
                >✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

const BLANK_CONTACT = { first_name: '', last_name: '', email: '', phone: '', notes: '' }
const BLANK_EVENT_ROW = { slug: '', status: 'interested' as LeadStatus, amount: '' }

export default function CRMPage() {
  const [events, setEvents] = useState<EventSummary[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [view, setView] = useState<'events' | 'contacts'>('events')
  const [loading, setLoading] = useState(true)
  const [hiddenStatuses, setHiddenStatuses] = useState<Set<LeadStatus>>(new Set(['irrelevant']))
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null)
  const [selectedContactEmail, setSelectedContactEmail] = useState<string | null>(null)
  const [editingAmount, setEditingAmount] = useState<string | null>(null)
  const [amountDraft, setAmountDraft] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [form, setForm] = useState(BLANK_CONTACT)
  const [eventRows, setEventRows] = useState([{ ...BLANK_EVENT_ROW }])
  const [saving, setSaving] = useState(false)
  const [addErr, setAddErr] = useState('')
  const supabase = createClient()

  function openAddForm() {
    setEventRows([{ ...BLANK_EVENT_ROW, slug: selectedSlug ?? '' }])
    setShowAddForm(true)
  }

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('retreats').select('slug, title_en').order('sort_order', { ascending: true })
      if (data) setEvents(data as EventSummary[])
      // auto-load all leads on mount via admin API
      const res = await fetch('/api/admin/leads')
      const json = await res.json() as { leads?: Lead[] }
      setLeads(json.leads ?? [])
      setLoading(false)
    }
    void load()
  }, [])

  const loadLeads = useCallback(async (slug: string | null) => {
    setSelectedSlug(slug)
    const url = slug ? `/api/admin/leads?slug=${encodeURIComponent(slug)}` : '/api/admin/leads'
    const res = await fetch(url)
    const json = await res.json() as { leads?: Lead[] }
    setLeads(json.leads ?? [])
  }, [])

  function switchView(v: 'events' | 'contacts') {
    setView(v)
    if (v === 'contacts') void loadLeads(null)
  }

  async function updateStatus(id: string, status: LeadStatus) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    await fetch('/api/admin/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
  }

  async function saveAmount(id: string) {
    const amount = amountDraft.trim()
    setLeads(prev => prev.map(l => l.id === id ? { ...l, amount } : l))
    setEditingAmount(null)
    await fetch('/api/admin/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, amount }) })
  }

  async function addContact() {
    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
      setAddErr('First name, last name and email required'); return
    }
    const validRows = eventRows.filter(r => r.slug)
    if (validRows.length === 0) { setAddErr('Add at least one event'); return }
    setAddErr(''); setSaving(true)
    const inserts = validRows.map(r => ({
      first_name: form.first_name.trim(), last_name: form.last_name.trim(),
      email: form.email.trim(), phone: form.phone.trim(), notes: form.notes.trim(),
      status: r.status, amount: r.amount.trim(), event_slug: r.slug,
      locale: 'en', receipt_issued: false,
    }))
    const res = await fetch('/api/admin/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inserts) })
    const json = await res.json() as { leads?: Lead[]; error?: string }
    setSaving(false)
    if (json.error) { setAddErr(json.error); return }
    if (json.leads) {
      setLeads(prev => [...json.leads!, ...prev])
      setForm(BLANK_CONTACT)
      setEventRows([{ ...BLANK_EVENT_ROW }])
      setShowAddForm(false)
    }
  }

  async function toggleReceipt(id: string, value: boolean) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, receipt_issued: value } : l))
    await fetch('/api/admin/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, receipt_issued: value }) })
  }

  function onPaymentsSave(id: string, payments: Payment[], newStatus: LeadStatus | null) {
    setLeads(prev => prev.map(l => {
      if (l.id !== id) return l
      return { ...l, payments, ...(newStatus && newStatus !== l.status ? { status: newStatus } : {}) }
    }))
  }

  async function updateCurrency(id: string, currency: string) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, currency } : l))
    await fetch('/api/admin/leads', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, currency }) })
  }

  function onLeadChange(id: string, updates: Partial<Lead>) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  async function deleteContact(email: string) {
    const name = leads.find(l => l.email === email)
    const displayName = name ? `${name.first_name} ${name.last_name}` : email
    if (!window.confirm(`Delete all data for ${displayName}? This cannot be undone.`)) return
    const toDelete = leads.filter(l => l.email === email)
    setLeads(prev => prev.filter(l => l.email !== email))
    if (selectedContactEmail === email) setSelectedContactEmail(null)
    await Promise.all(toDelete.map(l =>
      fetch(`/api/admin/leads?id=${encodeURIComponent(l.id)}`, { method: 'DELETE' })
    ))
  }

  async function deleteLead(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return
    setLeads(prev => prev.filter(l => l.id !== id))
    if (expandedLeadId === id) setExpandedLeadId(null)
    await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  }

  function toggleStatusFilter(s: LeadStatus) {
    setHiddenStatuses(prev => {
      const next = new Set(prev)
      if (next.has(s)) next.delete(s); else next.add(s)
      return next
    })
  }

  function exportCSV() {
    if (!visibleLeads.length) return
    const header = 'First Name,Last Name,Email,Phone,Event,Status,Amount,Signed Up'
    const rows = visibleLeads.map(l => [l.first_name, l.last_name, l.email, l.phone, l.event_slug, l.status, l.amount, new Date(l.created_at).toLocaleDateString()]
      .map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `crm-${selectedSlug ?? 'all'}-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const counts = ALL_STATUSES.reduce((acc, s) => { acc[s] = leads.filter(l => l.status === s).length; return acc }, {} as Record<LeadStatus, number>)
  const visibleLeads = leads.filter(l => !hiddenStatuses.has(l.status))

  if (loading) return <AdminShell><p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.85rem' }}>Loading...</p></AdminShell>

  const tabBtn = (active: boolean): React.CSSProperties => ({
    background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
    border: '1px solid ' + (active ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'),
    borderRadius: '5px', padding: '0.3rem 0.75rem', fontSize: '0.72rem',
    color: active ? '#e2e8f0' : 'rgba(226,232,240,0.35)', cursor: 'pointer', transition: 'all 0.15s',
  })

  return (
    <AdminShell>
      <div className="crm-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#e2e8f0', marginBottom: '0.3rem' }}>CRM</h1>
          <p style={{ fontSize: '0.8rem', color: 'rgba(226,232,240,0.3)' }}>Registration leads · Select an event or view all</p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
          <button onClick={() => setView('events')} style={tabBtn(view === 'events')}>By Event</button>
          <button onClick={() => switchView('contacts')} style={tabBtn(view === 'contacts')}>Contacts</button>
        </div>
      </div>

      <div className="crm-grid" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <div className="crm-event-sidebar" style={{ background: '#0d1526', borderRadius: '8px', overflow: 'hidden' }}>
          <button onClick={() => loadLeads(null)} style={{
            display: 'block', width: '100%', textAlign: 'left', padding: '0.7rem 1rem',
            background: selectedSlug === null ? 'rgba(212,168,83,0.1)' : 'transparent',
            border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer',
            color: selectedSlug === null ? '#D4A853' : 'rgba(226,232,240,0.55)', fontSize: '0.82rem', transition: 'all 0.15s',
          }}>All events</button>
          {events.map(r => (
            <button key={r.slug} onClick={() => loadLeads(r.slug)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '0.7rem 1rem',
              background: selectedSlug === r.slug ? 'rgba(212,168,83,0.1)' : 'transparent',
              border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer',
              color: selectedSlug === r.slug ? '#D4A853' : 'rgba(226,232,240,0.55)', fontSize: '0.82rem', transition: 'all 0.15s',
            }}>{r.title_en}</button>
          ))}
        </div>

        {/* Main */}
        <div>
          {/* Add lead */}
          <div style={{ marginBottom: '1.25rem' }}>
            {!showAddForm ? (
              <button onClick={openAddForm}
                style={{ background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.25)', borderRadius: '6px', padding: '0.4rem 1rem', fontSize: '0.72rem', color: '#D4A853', cursor: 'pointer', letterSpacing: '0.06em' }}>
                + Add contact
              </button>
            ) : (
              <div style={{ background: '#0d1526', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Contact details */}
                <div>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.3)', marginBottom: '0.5rem' }}>Contact details</p>
                  <div className="crm-add-name-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))} placeholder="First name *" style={addInp} />
                    <input value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))} placeholder="Last name *" style={addInp} />
                  </div>
                  <div className="crm-add-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Email *" style={addInp} />
                    <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" style={addInp} />
                  </div>
                </div>

                {/* Event rows */}
                <div>
                  <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.3)', marginBottom: '0.5rem' }}>Events</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {eventRows.map((row, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '0.4rem', alignItems: 'center' }}>
                        <select value={row.slug} onChange={e => setEventRows(p => p.map((r, j) => j === i ? { ...r, slug: e.target.value } : r))}
                          style={{ ...addInp, cursor: 'pointer', color: row.slug ? '#e2e8f0' : 'rgba(226,232,240,0.3)' }}>
                          <option value="">— Select event</option>
                          {events.map(ev => <option key={ev.slug} value={ev.slug} style={{ background: '#0d1526' }}>{ev.title_en}</option>)}
                        </select>
                        <select value={row.status} onChange={e => setEventRows(p => p.map((r, j) => j === i ? { ...r, status: e.target.value as LeadStatus } : r))}
                          style={{ ...addInp, cursor: 'pointer', color: STATUS_COLOR[row.status], width: 'auto' }}>
                          {ALL_STATUSES.map(s => <option key={s} value={s} style={{ color: '#e2e8f0', background: '#0d1526' }}>{STATUS_LABEL[s]}</option>)}
                        </select>
                        <input value={row.amount} onChange={e => setEventRows(p => p.map((r, j) => j === i ? { ...r, amount: e.target.value } : r))}
                          placeholder="Amount" style={{ ...addInp, width: '90px' }} />
                        {eventRows.length > 1 && (
                          <button onClick={() => setEventRows(p => p.filter((_, j) => j !== i))}
                            style={{ background: 'none', border: 'none', color: 'rgba(248,113,113,0.5)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px', lineHeight: 1 }}>×</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setEventRows(p => [...p, { ...BLANK_EVENT_ROW }])}
                    style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'rgba(212,168,83,0.6)', fontSize: '0.72rem', cursor: 'pointer', padding: 0, letterSpacing: '0.04em' }}>
                    + add another event
                  </button>
                </div>

                {addErr && <p style={{ fontSize: '0.72rem', color: '#f87171' }}>{addErr}</p>}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={addContact} disabled={saving} style={{ background: '#D4A853', border: 'none', borderRadius: '4px', padding: '0.45rem 1.1rem', fontSize: '0.72rem', fontWeight: 600, color: '#0d1520', cursor: 'pointer' }}>{saving ? '…' : 'Save'}</button>
                  <button onClick={() => { setShowAddForm(false); setForm(BLANK_CONTACT); setEventRows([{ ...BLANK_EVENT_ROW }]); setAddErr('') }}
                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '0.45rem 0.85rem', fontSize: '0.72rem', color: 'rgba(226,232,240,0.35)', cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Contacts view */}
          {view === 'contacts' && (
            <ContactsView
              leads={leads}
              events={events}
              onSelect={email => setSelectedContactEmail(email)}
              onDeleteContact={deleteContact}
            />
          )}

          {/* Events view */}
          {view === 'events' && (
            <>
              {leads.length > 0 && (
                <div className="crm-filter-bar" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {ALL_STATUSES.map(s => counts[s] > 0 && (
                    <button key={s} onClick={() => toggleStatusFilter(s)} style={{
                      padding: '0.4rem 0.85rem', background: hiddenStatuses.has(s) ? 'transparent' : '#0d1526',
                      borderRadius: '20px', display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer',
                      border: `1px solid ${hiddenStatuses.has(s) ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.0)'}`,
                      opacity: hiddenStatuses.has(s) ? 0.45 : 1, transition: 'all 0.15s',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_COLOR[s], flexShrink: 0 }} />
                      <span style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.5)' }}>{STATUS_LABEL[s]}</span>
                      <span style={{ fontSize: '0.72rem', color: STATUS_COLOR[s], fontWeight: 600 }}>{counts[s]}</span>
                    </button>
                  ))}
                  <button onClick={exportCSV} style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '0.35rem 0.85rem', fontSize: '0.72rem', color: 'rgba(226,232,240,0.4)', cursor: 'pointer' }}>Export CSV</button>
                </div>
              )}
              {leads.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(226,232,240,0.2)', fontSize: '0.85rem' }}>
                  {selectedSlug === null ? 'Click an event to load leads, or view all.' : 'No registrations for this event yet.'}
                </div>
              ) : visibleLeads.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(226,232,240,0.2)', fontSize: '0.85rem' }}>
                  All leads hidden by filter. Click a status pill above to show them.
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="crm-table-view" style={{ background: '#0d1526', borderRadius: '8px', overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                      <thead>
                        <tr>
                          <th style={{ ...head, width: '28px' }} />
                          {['Name', 'Email', 'Phone', 'Event', 'Room', 'Status', 'Amount', 'Receipt', 'Date', ''].map(h => (
                            <th key={h} style={{ ...head, textAlign: h === 'Receipt' ? 'center' : 'left' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {visibleLeads.map(lead => {
                          const expanded = expandedLeadId === lead.id
                          const payCount = (lead.payments ?? []).length
                          return (
                            <>
                              <tr key={lead.id}>
                                <td style={{ ...cell, padding: '0.65rem 0.4rem', width: '28px' }}>
                                  <button onClick={() => setExpandedLeadId(expanded ? null : lead.id)} title="Payments" style={{ background: 'none', border: 'none', cursor: 'pointer', color: payCount > 0 ? '#D4A853' : 'rgba(226,232,240,0.4)', fontSize: '0.85rem', padding: '2px 6px', transition: 'color 0.15s' }}>
                                    {expanded ? '▾' : '▸'}{payCount > 0 ? <span style={{ fontSize: '0.65rem', marginLeft: '2px' }}>{payCount}</span> : ''}
                                  </button>
                                </td>
                                <td style={cell}>{lead.first_name} {lead.last_name}</td>
                                <td style={cell}><a href={`mailto:${lead.email}`} style={{ color: '#D4A853', textDecoration: 'none' }}>{lead.email}</a></td>
                                <td style={{ ...cell, color: 'rgba(226,232,240,0.4)' }}>{lead.phone || '—'}</td>
                                <td style={{ ...cell, fontSize: '0.72rem', color: 'rgba(226,232,240,0.4)' }}>{lead.event_slug}</td>
                                <td style={{ ...cell, fontSize: '0.75rem', color: lead.notes ? 'rgba(212,168,83,0.7)' : 'rgba(226,232,240,0.2)' }}>
                                  {lead.notes ? lead.notes.replace('Room: ', '') : '—'}
                                </td>
                                <td style={cell}>
                                  <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '0.3rem 0.5rem', fontSize: '0.72rem', color: STATUS_COLOR[lead.status], cursor: 'pointer', outline: 'none' }}>
                                    {ALL_STATUSES.map(s => <option key={s} value={s} style={{ color: '#e2e8f0', background: '#0d1526' }}>{STATUS_LABEL[s]}</option>)}
                                  </select>
                                </td>
                                <td style={cell}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {editingAmount === lead.id
                                      ? <input autoFocus value={amountDraft} onChange={e => setAmountDraft(e.target.value)} onBlur={() => saveAmount(lead.id)} onKeyDown={e => { if (e.key === 'Enter') saveAmount(lead.id); if (e.key === 'Escape') setEditingAmount(null) }}
                                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,168,83,0.3)', borderRadius: '4px', padding: '0.3rem 0.5rem', fontSize: '0.8rem', color: '#E8D5B7', outline: 'none', width: '80px' }} />
                                      : <span onClick={() => { setEditingAmount(lead.id); setAmountDraft(lead.amount) }}
                                          style={{ cursor: 'pointer', color: lead.amount ? 'rgba(232,213,183,0.7)' : 'rgba(226,232,240,0.2)', borderBottom: '1px dashed rgba(232,213,183,0.15)', paddingBottom: '1px' }}>
                                          {lead.amount || 'set…'}
                                        </span>}
                                    <select value={lead.currency ?? 'ILS'} onChange={e => updateCurrency(lead.id, e.target.value)}
                                      style={{ background: 'transparent', border: 'none', color: 'rgba(226,232,240,0.35)', fontSize: '0.65rem', cursor: 'pointer', outline: 'none', padding: 0 }}>
                                      {CURRENCIES.map(c => <option key={c} value={c} style={{ background: '#0d1526', color: '#e2e8f0' }}>{c}</option>)}
                                    </select>
                                    {(lead.status === 'paid' || lead.status === 'partially_paid') && lead.amount && (
                                      <span style={{ fontSize: '0.6rem', color: 'rgba(90,154,111,0.7)', whiteSpace: 'nowrap' }}>→ budget</span>
                                    )}
                                  </div>
                                </td>
                                <td style={{ ...cell, textAlign: 'center' }}>
                                  <input type="checkbox" checked={lead.receipt_issued} onChange={e => toggleReceipt(lead.id, e.target.checked)} title="Receipt issued"
                                    style={{ width: '15px', height: '15px', cursor: 'pointer', accentColor: '#D4A853' }} />
                                </td>
                                <td style={{ ...cell, color: 'rgba(226,232,240,0.35)', fontSize: '0.75rem' }}>{new Date(lead.created_at).toLocaleDateString()}</td>
                                <td style={{ ...cell, padding: '0.65rem 0.5rem' }}>
                                  <button onClick={() => deleteLead(lead.id, `${lead.first_name} ${lead.last_name}`)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,113,113,0.35)', fontSize: '1rem', padding: '2px 6px', transition: 'color 0.15s', lineHeight: 1 }}>✕</button>
                                </td>
                              </tr>
                              {expanded && (
                                <tr key={`${lead.id}-payments`}>
                                  <td colSpan={11} style={{ padding: 0 }}>
                                    <PaymentsPanel lead={lead} onSave={onPaymentsSave} />
                                  </td>
                                </tr>
                              )}
                            </>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile card view */}
                  <div className="crm-card-view" style={{ display: 'none', flexDirection: 'column', background: '#0d1526', borderRadius: '8px', overflow: 'hidden' }}>
                    {visibleLeads.map(lead => {
                      const expanded = expandedLeadId === lead.id
                      const payCount = (lead.payments ?? []).length

                      return (
                        <div key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          {/* Collapsed header — tappable row */}
                          <div
                            onClick={() => setExpandedLeadId(expanded ? null : lead.id)}
                            style={{
                              padding: '0.85rem 1rem', cursor: 'pointer',
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              background: expanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                              minHeight: '60px',
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: STATUS_COLOR[lead.status], flexShrink: 0 }} />
                                <span style={{ fontSize: '0.97rem', color: '#e2e8f0', fontWeight: 500 }}>
                                  {lead.first_name} {lead.last_name}
                                </span>
                                {payCount > 0 && (
                                  <span style={{ fontSize: '0.58rem', color: '#D4A853', background: 'rgba(212,168,83,0.12)', borderRadius: '10px', padding: '0.1rem 0.45rem', whiteSpace: 'nowrap' }}>
                                    {payCount}p
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.35)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {lead.email}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.95rem', color: expanded ? '#D4A853' : 'rgba(226,232,240,0.25)', marginLeft: '0.85rem', flexShrink: 0, transition: 'color 0.15s' }}>
                              {expanded ? '▾' : '▸'}
                            </span>
                          </div>

                          {/* Expanded detail panel */}
                          {expanded && (
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                              {/* Fields */}
                              <div style={{ padding: '0.9rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

                                {/* Status */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.28)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Status</span>
                                  <select
                                    value={lead.status}
                                    onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                                    onClick={e => e.stopPropagation()}
                                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '5px', padding: '0.4rem 0.65rem', fontSize: '0.82rem', color: STATUS_COLOR[lead.status], cursor: 'pointer', outline: 'none' }}
                                  >
                                    {ALL_STATUSES.map(s => <option key={s} value={s} style={{ color: '#e2e8f0', background: '#0d1526' }}>{STATUS_LABEL[s]}</option>)}
                                  </select>
                                </div>

                                {/* Amount + currency */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.28)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Amount</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                    {editingAmount === lead.id
                                      ? <input autoFocus value={amountDraft}
                                          onChange={e => setAmountDraft(e.target.value)}
                                          onBlur={() => saveAmount(lead.id)}
                                          onKeyDown={e => { if (e.key === 'Enter') saveAmount(lead.id); if (e.key === 'Escape') setEditingAmount(null) }}
                                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,168,83,0.35)', borderRadius: '5px', padding: '0.4rem 0.65rem', fontSize: '0.9rem', color: '#E8D5B7', outline: 'none', width: '100px', textAlign: 'right' }} />
                                      : <span
                                          onClick={e => { e.stopPropagation(); setEditingAmount(lead.id); setAmountDraft(lead.amount) }}
                                          style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: lead.amount ? 'rgba(232,213,183,0.85)' : 'rgba(226,232,240,0.2)', borderBottom: '1px dashed rgba(232,213,183,0.2)', paddingBottom: '1px' }}
                                        >
                                          {lead.amount || 'tap to set'}
                                        </span>
                                    }
                                    <select
                                      value={lead.currency ?? 'ILS'}
                                      onChange={e => updateCurrency(lead.id, e.target.value)}
                                      onClick={e => e.stopPropagation()}
                                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '5px', padding: '0.35rem 0.5rem', fontSize: '0.75rem', color: 'rgba(226,232,240,0.55)', cursor: 'pointer', outline: 'none' }}
                                    >
                                      {CURRENCIES.map(c => <option key={c} value={c} style={{ background: '#0d1526', color: '#e2e8f0' }}>{c}</option>)}
                                    </select>
                                  </div>
                                </div>

                                {/* Phone */}
                                {lead.phone && (
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.28)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Phone</span>
                                    <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} style={{ fontSize: '0.88rem', color: '#e2e8f0', textDecoration: 'none' }}>{lead.phone}</a>
                                  </div>
                                )}

                                {/* Event */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.28)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>Event</span>
                                  <span style={{ fontSize: '0.78rem', color: 'rgba(226,232,240,0.5)' }}>{lead.event_slug}</span>
                                </div>

                                {/* Notes */}
                                {lead.notes && (
                                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                                    <span style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.28)', textTransform: 'uppercase', letterSpacing: '0.09em', flexShrink: 0 }}>Room</span>
                                    <span style={{ fontSize: '0.78rem', color: 'rgba(212,168,83,0.7)', textAlign: 'right' }}>{lead.notes.replace('Room: ', '')}</span>
                                  </div>
                                )}

                                {/* Receipt + Date */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: lead.receipt_issued ? 'rgba(212,168,83,0.9)' : 'rgba(226,232,240,0.35)', cursor: 'pointer' }} onClick={e => e.stopPropagation()}>
                                    <input type="checkbox" checked={lead.receipt_issued} onChange={e => toggleReceipt(lead.id, e.target.checked)} style={{ accentColor: '#D4A853', cursor: 'pointer', width: '16px', height: '16px' }} />
                                    Receipt issued
                                  </label>
                                  <span style={{ fontSize: '0.7rem', color: 'rgba(226,232,240,0.22)' }}>{new Date(lead.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div style={{ padding: '0 1rem 0.9rem', display: 'flex', gap: '0.5rem' }}>
                                <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} style={{
                                  flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: '6px',
                                  background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.2)',
                                  color: '#D4A853', fontSize: '0.78rem', textDecoration: 'none',
                                }}>
                                  Email
                                </a>
                                {lead.phone && (
                                  <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} style={{
                                    flex: 1, textAlign: 'center', padding: '0.6rem', borderRadius: '6px',
                                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                    color: 'rgba(226,232,240,0.55)', fontSize: '0.78rem', textDecoration: 'none',
                                  }}>
                                    Call
                                  </a>
                                )}
                                <button
                                  onClick={e => { e.stopPropagation(); void deleteLead(lead.id, `${lead.first_name} ${lead.last_name}`) }}
                                  style={{
                                    padding: '0.6rem 0.75rem', borderRadius: '6px',
                                    background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)',
                                    color: 'rgba(248,113,113,0.7)', fontSize: '0.78rem', cursor: 'pointer',
                                  }}
                                >
                                  Delete
                                </button>
                              </div>

                              {/* Payments */}
                              <PaymentsPanel lead={lead} onSave={onPaymentsSave} />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {selectedContactEmail && leads.filter(l => l.email === selectedContactEmail).length > 0 && (
        <ContactCard
          leads={leads.filter(l => l.email === selectedContactEmail)}
          onClose={() => setSelectedContactEmail(null)}
          onLeadChange={onLeadChange}
          onPaymentsSave={onPaymentsSave}
        />
      )}
    </AdminShell>
  )
}
