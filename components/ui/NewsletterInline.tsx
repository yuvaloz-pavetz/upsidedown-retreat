'use client'

import { useState, useId } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

interface NewsletterInlineProps {
  locale: Locale
  heading: string
}

const copy = {
  en: {
    placeholder: 'Your email',
    button: 'Subscribe',
    sending: 'Sending...',
    success: "You're subscribed.",
    error: 'Something went wrong. Please try again.',
    consent: 'I agree to the processing of my personal data in accordance with the',
    privacyPolicy: 'Privacy Policy',
  },
  he: {
    placeholder: 'האימייל שלכם',
    button: 'הרשמה',
    sending: 'שולח...',
    success: 'נרשמתם בהצלחה.',
    error: 'משהו השתבש. נסו שוב.',
    consent: 'אני מסכים/ה לעיבוד המידע האישי שלי בהתאם ל',
    privacyPolicy: 'מדיניות הפרטיות',
  },
}

export default function NewsletterInline({ locale, heading }: NewsletterInlineProps) {
  const t = copy[locale] ?? copy.en
  const uid = useId()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !consent) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div>
      <p style={{ fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,213,183,0.78)', marginBottom: '0.9rem', fontWeight: 600 }}>
        {heading}
      </p>

      {status === 'success' ? (
        <p className="font-body text-sm" style={{ color: '#D4A853' }}>{t.success}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <label htmlFor={`${uid}-email`} className="sr-only">{t.placeholder}</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              id={`${uid}-email`}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.placeholder}
              required
              dir="ltr"
              className="font-body text-sm"
              style={{
                flex: 1,
                minWidth: 0,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(232,213,183,0.4)',
                borderRadius: '4px',
                padding: '0.6rem 0.85rem',
                color: '#E8D5B7',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading' || !consent}
              className="btn-ghost-gold flex-shrink-0"
              style={{ borderRadius: '4px', padding: '0.6rem 1.2rem', fontSize: '13px', fontWeight: 600, opacity: consent ? 1 : 0.5, cursor: consent ? 'pointer' : 'not-allowed' }}
            >
              {status === 'loading' ? t.sending : t.button}
            </button>
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              required
              style={{ marginTop: '2px', accentColor: '#D4A853', flexShrink: 0, width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '12px', color: 'rgba(232,213,183,0.7)', lineHeight: 1.5 }}>
              {t.consent}{' '}
              <Link href={`/${locale}/privacy`} style={{ color: '#D4A853', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                {t.privacyPolicy}
              </Link>.
            </span>
          </label>
          {status === 'error' && (
            <p className="font-body text-xs" style={{ color: '#FF8C5A', fontWeight: 500 }}>{t.error}</p>
          )}
        </form>
      )}
    </div>
  )
}
