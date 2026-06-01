'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminShell from '@/components/admin/AdminShell'
import type { BudgetItem, Payment } from '@/lib/supabase/types'

interface RetreatSummary { slug: string; title_en: string }
interface PaidLead { id: string; first_name: string; last_name: string; amount: string; status: string; currency: string; payments: Payment[] }
type EditState = { id: string; field: 'description' | 'amount' | 'notes'; value: string } | null
type Rates = Record<string, number> // ILS per 1 unit of foreign currency

const CURRENCIES = ['ILS', 'EUR', 'USD']

const cell: React.CSSProperties = {
  padding: '0.6rem 0.85rem', fontSize: '0.82rem',
  color: 'rgba(226,232,240,0.7)', borderBottom: '1px solid rgba(255,255,255,0.04)',
  verticalAlign: 'middle',
}
const head: React.CSSProperties = {
  ...cell, color: 'rgba(226,232,240,0.28)', fontSize: '0.6rem',
  letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontWeight: 500,
}
const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 4, padding: '0.45rem 0.65rem', color: '#e2e8f0', fontSize: '0.82rem',
  outline: 'none', fontFamily: 'inherit',
}

function toILS(amount: number, currency: string, rates: Rates): number {
  if (currency === 'ILS') return amount
  const rate = rates[currency]
  if (!rate) return amount
  return Math.round(amount * rate * 100) / 100
}

function formatILS(n: number): string {
  return `₪${Math.round(n).toLocaleString('en')}`
}

function parseAmount(str: string): number {
  if (!str) return 0
  const n = parseFloat(str.replace(/[^\d.]/g, ''))
  return isNaN(n) ? 0 : n
}

function effectiveILS(item: BudgetItem, rates: Rates): number {
  return item.ils_amount != null ? item.ils_amount : toILS(item.amount, item.currency, rates)
}

async function fetchRates(): Promise<{ rates: Rates; date: string }> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=ILS&to=EUR,USD')
    const json = await res.json() as { rates: Record<string, number>; date: string }
    const rates: Rates = {}
    for (const [cur, val] of Object.entries(json.rates)) {
      rates[cur] = 1 / val
    }
    return { rates, date: json.date }
  } catch {
    return { rates: { EUR: 3.85, USD: 3.65 }, date: 'fallback' }
  }
}

// ── CRM participants sub-section ──────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  paid:           { label: 'Paid',    color: '#5A9A6F' },
  partially_paid: { label: 'Partial', color: '#D4A853' },
}

function paidAmount(l: PaidLead): number {
  const paidPayments = (l.payments ?? []).filter(p => p.paid)
  if (paidPayments.length > 0) return paidPayments.reduce((s, p) => s + parseAmount(p.amount), 0)
  return parseAmount(l.amount) // fallback for leads without payment entries
}

function CRMIncomeSection({ leads, rates }: { leads: PaidLead[]; rates: Rates }) {
  if (leads.length === 0) return null
  const rows = leads.map(l => ({
    ...l,
    paid: paidAmount(l),
    cur: l.currency ?? 'ILS',
  }))
  const total = rows.reduce((s, r) => s + toILS(r.paid, r.cur, rates), 0)
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(90,154,111,0.65)', marginBottom: '0.5rem', fontWeight: 500 }}>
        From participants · CRM — auto-synced
      </p>
      <div style={{ background: '#0d1526', borderRadius: 8, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '360px' }}>
          <thead>
            <tr>
              {['Participant', 'Status', 'Paid', '≈ ILS'].map(h => (
                <th key={h} style={{ ...head, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const ils = toILS(r.paid, r.cur, rates)
              const badge = STATUS_BADGE[r.status] ?? { label: r.status, color: 'rgba(226,232,240,0.4)' }
              return (
                <tr key={r.id}>
                  <td style={cell}>{r.first_name} {r.last_name}</td>
                  <td style={cell}>
                    <span style={{ fontSize: '0.68rem', color: badge.color, background: `${badge.color}18`, borderRadius: 4, padding: '0.15rem 0.45rem', whiteSpace: 'nowrap' }}>
                      {badge.label}
                    </span>
                  </td>
                  <td style={{ ...cell, color: 'rgba(226,232,240,0.4)' }}>{r.paid > 0 ? `${r.paid.toLocaleString()} ${r.cur}` : '—'}</td>
                  <td style={{ ...cell, color: '#5A9A6F', fontWeight: 500 }}>{ils > 0 ? formatILS(ils) : '—'}</td>
                </tr>
              )
            })}
            <tr>
              <td colSpan={3} style={{ ...cell, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.25)' }}>Total from participants</td>
              <td style={{ ...cell, color: '#5A9A6F', fontWeight: 600 }}>{formatILS(total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Summary cards ─────────────────────────────────────────────────────────────

function SummaryCards({ manualIncome, manualExpenses, crmTotal, rates }: {
  manualIncome: BudgetItem[]
  manualExpenses: BudgetItem[]
  crmTotal: number
  rates: Rates
}) {
  const income   = manualIncome.reduce((s, i) => s + effectiveILS(i, rates), 0) + crmTotal
  const expenses = manualExpenses.reduce((s, i) => s + effectiveILS(i, rates), 0)
  const net      = income - expenses
  const hasData  = income > 0 || expenses > 0

  const card = (label: string, value: number, color: string) => (
    <div style={{ background: '#0d1526', borderRadius: 8, padding: '1.25rem 1.5rem', flex: 1, minWidth: 110 }}>
      <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.3)', marginBottom: '0.5rem' }}>{label}</p>
      <p style={{ fontSize: '1.6rem', fontWeight: 300, color, lineHeight: 1 }}>
        {!hasData ? '—' : (label === 'Net' && value < 0 ? '−' : '') + formatILS(Math.abs(value))}
      </p>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {card('Income',   income,   '#5A9A6F')}
      {card('Expenses', expenses, '#f87171')}
      {card('Net',      net,      net >= 0 ? '#5A9A6F' : '#f87171')}
    </div>
  )
}

// ── Budget section ────────────────────────────────────────────────────────────

interface SectionProps {
  type: 'income' | 'expense'
  items: BudgetItem[]
  slug: string
  rates: Rates
  onAdd: (item: BudgetItem) => void
  onUpdate: (item: BudgetItem) => void
  onRemove: (id: string) => void
}

function BudgetSection({ type, items, slug, rates, onAdd, onUpdate, onRemove }: SectionProps) {
  const supabase = useMemo(() => createClient(), [])
  const color = type === 'income' ? '#5A9A6F' : '#f87171'
  const label = type === 'income' ? 'Manual' : 'Expenses'

  const [desc, setDesc]       = useState('')
  const [amount, setAmount]   = useState('')
  const [currency, setCurrency] = useState('ILS')
  const [notes, setNotes]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [addErr, setAddErr]   = useState('')
  const [editing, setEditing] = useState<EditState>(null)

  const amountNum  = parseFloat(amount)
  const ilsPreview = !isNaN(amountNum) && amountNum > 0 && currency !== 'ILS'
    ? toILS(amountNum, currency, rates) : null

  async function add() {
    const val = parseFloat(amount)
    if (!desc.trim()) { setAddErr('Description required'); return }
    if (isNaN(val) || val <= 0) { setAddErr('Enter a valid amount'); return }
    setAddErr(''); setSaving(true)
    const ils_amount = toILS(val, currency, rates)
    const { data, error } = await supabase
      .from('budget_items')
      .insert({ event_slug: slug, type, description: desc.trim(), amount: val, currency, notes: notes.trim(), ils_amount })
      .select().single()
    setSaving(false)
    if (error) { setAddErr(error.message); return }
    if (data) { onAdd(data as BudgetItem); setDesc(''); setAmount(''); setNotes('') }
  }

  async function remove(id: string) {
    onRemove(id)
    await supabase.from('budget_items').delete().eq('id', id)
  }

  async function saveEdit() {
    if (!editing) return
    const item = items.find(i => i.id === editing.id)
    if (!item) { setEditing(null); return }
    const patch: Partial<BudgetItem> = {}
    if (editing.field === 'description') patch.description = editing.value.trim() || item.description
    if (editing.field === 'notes')       patch.notes = editing.value
    if (editing.field === 'amount') {
      const v = parseFloat(editing.value)
      if (!isNaN(v) && v > 0) { patch.amount = v; patch.ils_amount = toILS(v, item.currency, rates) }
    }
    onUpdate({ ...item, ...patch })
    setEditing(null)
    await supabase.from('budget_items').update(patch).eq('id', editing.id)
  }

  async function updateCurrency(id: string, newCur: string) {
    const item = items.find(i => i.id === id)!
    const ils_amount = toILS(item.amount, newCur, rates)
    onUpdate({ ...item, currency: newCur, ils_amount })
    await supabase.from('budget_items').update({ currency: newCur, ils_amount }).eq('id', id)
  }

  const editInp: React.CSSProperties = { ...inp, width: '100%', padding: '0.3rem 0.5rem', fontSize: '0.82rem' }

  return (
    <div>
      <p style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color, marginBottom: '0.75rem', fontWeight: 500 }}>{label}</p>
      <div style={{ background: '#0d1526', borderRadius: 8, overflow: 'auto', marginBottom: '0.75rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '420px' }}>
          <thead>
            <tr>
              {['Description', 'Original', 'ILS', 'Notes', ''].map(h => (
                <th key={h} style={{ ...head, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={5} style={{ ...cell, color: 'rgba(226,232,240,0.2)', textAlign: 'center', padding: '1.5rem' }}>No items yet</td></tr>
            )}
            {items.map(item => {
              const isEditDesc = editing?.id === item.id && editing.field === 'description'
              const isEditAmt  = editing?.id === item.id && editing.field === 'amount'
              const isEditNote = editing?.id === item.id && editing.field === 'notes'
              const ils = effectiveILS(item, rates)
              return (
                <tr key={item.id}>
                  <td style={cell}>
                    {isEditDesc
                      ? <input autoFocus value={editing!.value} onChange={e => setEditing({ ...editing!, value: e.target.value })} onBlur={saveEdit} onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(null) }} style={editInp} />
                      : <span onClick={() => setEditing({ id: item.id, field: 'description', value: item.description })} style={{ cursor: 'pointer', borderBottom: '1px dashed rgba(226,232,240,0.15)' }}>{item.description}</span>}
                  </td>
                  <td style={{ ...cell, color, fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'nowrap' }}>
                      {isEditAmt
                        ? <input autoFocus type="number" value={editing!.value} onChange={e => setEditing({ ...editing!, value: e.target.value })} onBlur={saveEdit} onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(null) }} style={{ ...editInp, width: '80px' }} />
                        : <span onClick={() => setEditing({ id: item.id, field: 'amount', value: String(item.amount) })} style={{ cursor: 'pointer', borderBottom: '1px dashed rgba(226,232,240,0.15)', whiteSpace: 'nowrap' }}>{item.amount.toLocaleString()} {item.currency}</span>}
                      <select value={item.currency} onChange={e => updateCurrency(item.id, e.target.value)} style={{ ...inp, padding: '0.2rem 0.3rem', fontSize: '0.68rem', cursor: 'pointer', color: 'rgba(226,232,240,0.4)' }}>
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </td>
                  <td style={{ ...cell, color, fontWeight: 600, whiteSpace: 'nowrap' }}>{formatILS(ils)}</td>
                  <td style={{ ...cell, color: 'rgba(226,232,240,0.35)', fontSize: '0.75rem' }}>
                    {isEditNote
                      ? <input autoFocus value={editing!.value} onChange={e => setEditing({ ...editing!, value: e.target.value })} onBlur={saveEdit} onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(null) }} style={editInp} />
                      : <span onClick={() => setEditing({ id: item.id, field: 'notes', value: item.notes })} style={{ cursor: 'pointer', borderBottom: '1px dashed rgba(226,232,240,0.1)' }}>{item.notes || '—'}</span>}
                  </td>
                  <td style={{ ...cell, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(248,113,113,0.45)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 4px', lineHeight: 1 }} title="Delete">×</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description *" style={{ ...inp, flex: '1 1 160px', minWidth: 0 }} onKeyDown={e => e.key === 'Enter' && add()} />
        <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount *" type="number" min={0} style={{ ...inp, width: '100px' }} onKeyDown={e => e.key === 'Enter' && add()} />
        <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {ilsPreview !== null && (
          <span style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.35)', whiteSpace: 'nowrap' }}>≈ {formatILS(ilsPreview)}</span>
        )}
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Note (optional)" style={{ ...inp, flex: '1 1 120px', minWidth: 0 }} onKeyDown={e => e.key === 'Enter' && add()} />
        <button onClick={add} disabled={saving} style={{ background: '#D4A853', border: 'none', borderRadius: 4, padding: '0.45rem 1rem', fontSize: '0.72rem', fontWeight: 600, color: '#0d1520', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {saving ? '…' : '+ Add'}
        </button>
      </div>
      {addErr && <p style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.4rem' }}>{addErr}</p>}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BudgetPage() {
  const supabase = useMemo(() => createClient(), [])
  const [retreats, setRetreats]     = useState<RetreatSummary[]>([])
  const [selected, setSelected]     = useState<string | null>(null)
  const [items, setItems]           = useState<BudgetItem[]>([])
  const [paidLeads, setPaidLeads]   = useState<PaidLead[]>([])
  const [rates, setRates]           = useState<Rates>({ EUR: 3.85, USD: 3.65 })
  const [rateDate, setRateDate]     = useState<string>('')
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    async function init() {
      const [retreatsRes, ratesRes] = await Promise.all([
        supabase.from('retreats').select('slug, title_en').order('sort_order', { ascending: true }),
        fetchRates(),
      ])
      if (retreatsRes.data) setRetreats(retreatsRes.data as RetreatSummary[])
      setRates(ratesRes.rates)
      setRateDate(ratesRes.date)
      setLoading(false)
    }
    void init()
  }, [supabase])

  const loadItems = useCallback(async (slug: string) => {
    setSelected(slug)
    const [budgetRes, leadsRes] = await Promise.all([
      supabase.from('budget_items').select('*').eq('event_slug', slug).order('created_at', { ascending: true }),
      fetch(`/api/admin/leads?slug=${encodeURIComponent(slug)}`).then(r => r.json() as Promise<{ leads?: PaidLead[] }>),
    ])
    setItems((budgetRes.data ?? []) as BudgetItem[])
    const allLeads = leadsRes.leads ?? []
    setPaidLeads(allLeads.filter(l => l.status === 'paid' || l.status === 'partially_paid'))
  }, [supabase])

  function exportCSV() {
    if (!items.length || !selected) return
    const header = 'Type,Description,Amount,Currency,ILS,Notes,Date'
    const rows = items.map(i => [
      i.type, i.description, i.amount, i.currency,
      effectiveILS(i, rates), i.notes,
      new Date(i.created_at).toLocaleDateString(),
    ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `budget-${selected}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const incomeItems  = items.filter(i => i.type === 'income')
  const expenseItems = items.filter(i => i.type === 'expense')
  const crmTotal     = paidLeads.reduce((s, l) => s + toILS(paidAmount(l), l.currency ?? 'ILS', rates), 0)

  if (loading) return <AdminShell><p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.85rem' }}>Loading...</p></AdminShell>

  return (
    <AdminShell>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#e2e8f0', marginBottom: '0.3rem' }}>Budget</h1>
        <p style={{ fontSize: '0.8rem', color: 'rgba(226,232,240,0.3)' }}>All amounts in ILS · Income & expenses per event</p>
      </div>

      {/* Mobile retreat selector */}
      <select
        className="budget-select-mobile"
        value={selected ?? ''}
        onChange={e => { if (e.target.value) void loadItems(e.target.value) }}
        style={{
          display: 'none', width: '100%', marginBottom: '1.25rem',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '6px', padding: '0.6rem 0.85rem', fontSize: '0.85rem',
          color: selected ? '#D4A853' : 'rgba(226,232,240,0.4)', outline: 'none',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <option value="" style={{ background: '#0d1526', color: 'rgba(226,232,240,0.4)' }}>— Select retreat</option>
        {retreats.map(r => (
          <option key={r.slug} value={r.slug} style={{ background: '#0d1526', color: '#e2e8f0' }}>{r.title_en}</option>
        ))}
      </select>

      <div className="budget-grid" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '2rem', alignItems: 'start' }}>
        <div className="budget-sidebar" style={{ background: '#0d1526', borderRadius: 8, overflow: 'hidden' }}>
          {retreats.map(r => (
            <button key={r.slug} onClick={() => loadItems(r.slug)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '0.7rem 1rem',
              background: selected === r.slug ? 'rgba(212,168,83,0.1)' : 'transparent',
              border: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer', color: selected === r.slug ? '#D4A853' : 'rgba(226,232,240,0.55)',
              fontSize: '0.82rem', transition: 'all 0.15s',
            }}>{r.title_en}</button>
          ))}
        </div>

        {!selected ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(226,232,240,0.2)', fontSize: '0.85rem' }}>Select a retreat</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <SummaryCards manualIncome={incomeItems} manualExpenses={expenseItems} crmTotal={crmTotal} rates={rates} />
              {rateDate && (
                <p style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.2)', marginTop: '0.5rem', letterSpacing: '0.03em' }}>
                  {rateDate === 'fallback' ? 'Fallback rates · ' : `Rate ${rateDate} · `}
                  €1 = ₪{rates.EUR?.toFixed(2)} · $1 = ₪{rates.USD?.toFixed(2)}
                </p>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5A9A6F', fontWeight: 600 }}>Income</p>
                <button onClick={exportCSV} disabled={!items.length} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '0.35rem 0.85rem', fontSize: '0.72rem', color: 'rgba(226,232,240,0.4)', cursor: items.length ? 'pointer' : 'not-allowed' }}>Export CSV</button>
              </div>
              <CRMIncomeSection leads={paidLeads} rates={rates} />
              <BudgetSection type="income" items={incomeItems} slug={selected} rates={rates}
                onAdd={item => setItems(p => [...p, item])}
                onUpdate={item => setItems(p => p.map(i => i.id === item.id ? item : i))}
                onRemove={id => setItems(p => p.filter(i => i.id !== id))} />
            </div>

            <BudgetSection type="expense" items={expenseItems} slug={selected} rates={rates}
              onAdd={item => setItems(p => [...p, item])}
              onUpdate={item => setItems(p => p.map(i => i.id === item.id ? item : i))}
              onRemove={id => setItems(p => p.filter(i => i.id !== id))} />
          </div>
        )}
      </div>
    </AdminShell>
  )
}
