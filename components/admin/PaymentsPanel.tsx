'use client'

import { useState } from 'react'
import type { Lead, Payment, PaymentMethod, LeadStatus } from '@/lib/supabase/types'

const METHOD_LABELS: Record<PaymentMethod, string> = {
  bank: 'Bank Transfer', cash: 'Cash', credit: 'Credit Card', paypal: 'PayPal', other: 'Other',
}

const inp: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '4px', padding: '0.3rem 0.55rem', fontSize: '0.78rem',
  color: '#e2e8f0', outline: 'none', fontFamily: 'inherit',
}

function computeStatus(payments: Payment[], leadAmount: string): LeadStatus | null {
  const paidTotal = payments.filter(p => p.paid).reduce((sum, p) => {
    const n = parseFloat(String(p.amount).replace(/[^0-9.]/g, ''))
    return sum + (isNaN(n) ? 0 : n)
  }, 0)
  const fullAmount = parseFloat(String(leadAmount).replace(/[^0-9.]/g, ''))
  if (paidTotal === 0) return 'interested'
  if (!isNaN(fullAmount) && fullAmount > 0 && paidTotal >= fullAmount) return 'paid'
  return 'partially_paid'
}

export default function PaymentsPanel({ lead, onSave }: {
  lead: Lead
  onSave: (id: string, payments: Payment[], newStatus: LeadStatus | null) => void
}) {
  const [payments, setPayments] = useState<Payment[]>(lead.payments ?? [])
  const [saving, setSaving] = useState(false)

  async function persist(updated: Payment[]) {
    setSaving(true)
    setPayments(updated)
    const newStatus = computeStatus(updated, lead.amount)
    const patch: Record<string, unknown> = { id: lead.id, payments: updated }
    if (newStatus && newStatus !== lead.status) patch.status = newStatus
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    onSave(lead.id, updated, newStatus)
    setSaving(false)
  }

  function add() {
    persist([...payments, {
      id: crypto.randomUUID(),
      amount: '', method: 'bank', paid: false, receipt: false,
      date: new Date().toISOString().slice(0, 10), notes: '',
    }])
  }

  function update(id: string, field: keyof Payment, value: string | boolean) {
    persist(payments.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  function remove(id: string) {
    persist(payments.filter(p => p.id !== id))
  }

  const paidTotal = payments.filter(p => p.paid).reduce((sum, p) => {
    const n = parseFloat(String(p.amount).replace(/[^0-9.]/g, ''))
    return sum + (isNaN(n) ? 0 : n)
  }, 0)

  return (
    <div style={{
      padding: '0.7rem 1rem 0.9rem 2rem',
      background: 'rgba(212,168,83,0.025)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <p style={{ fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(226,232,240,0.22)', marginBottom: '0.6rem' }}>
        Payments{paidTotal > 0 ? ` · Paid: ${paidTotal.toLocaleString()}` : ''}{saving ? ' · saving…' : ''}
      </p>

      {payments.length === 0 && (
        <p style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.18)', marginBottom: '0.4rem' }}>No payments recorded.</p>
      )}

      {payments.map((p, i) => (
        <div key={p.id} className="payment-row" style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', marginBottom: '0.4rem' }}>
          <div className="payment-inputs" style={{ display: 'contents' }}>
            <span style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.18)', minWidth: '14px' }}>{i + 1}</span>

            <input
              value={p.amount}
              onChange={e => setPayments(prev => prev.map(x => x.id === p.id ? { ...x, amount: e.target.value } : x))}
              onBlur={() => persist(payments)}
              placeholder="Amount"
              style={{ ...inp, width: '90px' }}
            />

            <select value={p.method} onChange={e => update(p.id, 'method', e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
              {(Object.keys(METHOD_LABELS) as PaymentMethod[]).map(m => (
                <option key={m} value={m} style={{ background: '#0d1526' }}>{METHOD_LABELS[m]}</option>
              ))}
            </select>

            <input
              type="date"
              value={p.date}
              onChange={e => update(p.id, 'date', e.target.value)}
              style={{ ...inp, width: '130px', colorScheme: 'dark' }}
            />
          </div>

          <div className="payment-controls" style={{ display: 'contents' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: p.paid ? 'rgba(90,154,111,0.9)' : 'rgba(226,232,240,0.35)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={p.paid} onChange={e => update(p.id, 'paid', e.target.checked)} style={{ accentColor: '#5A9A6F', cursor: 'pointer' }} />
              Paid
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: p.receipt ? 'rgba(212,168,83,0.9)' : 'rgba(226,232,240,0.35)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <input type="checkbox" checked={p.receipt} onChange={e => update(p.id, 'receipt', e.target.checked)} style={{ accentColor: '#D4A853', cursor: 'pointer' }} />
              Receipt
            </label>

            <button onClick={() => remove(p.id)} title="Remove payment" style={{
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '4px', color: 'rgba(248,113,113,0.7)', cursor: 'pointer',
              fontSize: '0.75rem', padding: '0.2rem 0.55rem', marginLeft: 'auto', transition: 'all 0.15s',
            }}>
              Remove
            </button>
          </div>
        </div>
      ))}

      <button onClick={add} style={{ marginTop: '0.3rem', background: 'none', border: 'none', color: 'rgba(212,168,83,0.55)', fontSize: '0.72rem', cursor: 'pointer', padding: 0, letterSpacing: '0.04em' }}>
        + add payment
      </button>
    </div>
  )
}
