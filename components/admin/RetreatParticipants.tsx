'use client'

import { useEffect, useState } from 'react'
import ContactCard from '@/components/admin/ContactCard'
import type { Lead, LeadStatus, Payment } from '@/lib/supabase/types'

const STATUS_COLOR: Record<LeadStatus, string> = {
  interested:     '#4A9BB8',
  email_sent:     '#9B7FD4',
  whatsapp_sent:  '#25D366',
  partially_paid: '#D4A853',
  paid:           '#5A9A6F',
  past:           'rgba(226,232,240,0.35)',
  irrelevant:     'rgba(226,232,240,0.18)',
}
const STATUS_LABEL: Record<LeadStatus, string> = {
  interested: 'Interested', email_sent: 'Email Sent', whatsapp_sent: 'WhatsApp Sent',
  partially_paid: 'Partial', paid: 'Paid', past: 'Past', irrelevant: 'Irrelevant',
}

// wa.me needs digits only, no leading zero. Local numbers here are entered
// Israeli-style (leading 0) — swap it for the country code; anything already
// starting with a country code (no leading 0) is left as-is.
function whatsappHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (!digits) return null
  const intl = digits.startsWith('0') ? `972${digits.slice(1)}` : digits
  return `https://wa.me/${intl}`
}

export default function RetreatParticipants({ slug }: { slug: string }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContactEmail, setSelectedContactEmail] = useState<string | null>(null)

  useEffect(() => {
    void fetch(`/api/admin/leads?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then((j: { leads?: Lead[] }) => {
        setLeads((j.leads ?? []).sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)))
        setLoading(false)
      })
  }, [slug])

  function onLeadChange(id: string, updates: Partial<Lead>) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))
  }

  function onPaymentsSave(id: string, payments: Payment[], newStatus: LeadStatus | null) {
    setLeads(prev => prev.map(l => {
      if (l.id !== id) return l
      return { ...l, payments, ...(newStatus && newStatus !== l.status ? { status: newStatus } : {}) }
    }))
  }

  if (loading) return <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.85rem' }}>Loading...</p>
  if (leads.length === 0) return <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.85rem' }}>No registrations yet.</p>

  return (
    <>
      <div style={{ background: '#0d1526', borderRadius: '8px', overflow: 'hidden' }}>
        {leads.map(lead => {
          const wa = whatsappHref(lead.phone)
          return (
            <div
              key={lead.id}
              onClick={() => setSelectedContactEmail(lead.email)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)',
                cursor: 'pointer',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: STATUS_COLOR[lead.status], flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 500 }}>{lead.first_name} {lead.last_name}</div>
                <div style={{ color: 'rgba(226,232,240,0.35)', fontSize: '0.72rem', marginTop: '2px' }}>{lead.email}</div>
              </div>
              <span style={{ fontSize: '0.7rem', color: STATUS_COLOR[lead.status], flexShrink: 0 }}>{STATUS_LABEL[lead.status]}</span>
              <a
                href={`mailto:${lead.email}`}
                onClick={e => e.stopPropagation()}
                title="Send email"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '30px', height: '30px', borderRadius: '6px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(226,232,240,0.75)', textDecoration: 'none',
                }}
              >
                ✉
              </a>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  title="Send WhatsApp message"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '30px', height: '30px', borderRadius: '6px', flexShrink: 0,
                    background: 'rgba(37,211,102,0.12)', color: '#25D366', textDecoration: 'none',
                  }}
                >
                  ✆
                </a>
              )}
            </div>
          )
        })}
      </div>

      {selectedContactEmail && leads.filter(l => l.email === selectedContactEmail).length > 0 && (
        <ContactCard
          leads={leads.filter(l => l.email === selectedContactEmail)}
          onClose={() => setSelectedContactEmail(null)}
          onLeadChange={onLeadChange}
          onPaymentsSave={onPaymentsSave}
        />
      )}
    </>
  )
}
