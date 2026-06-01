'use client'

import { useState, useId } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

interface WaitlistFormProps {
  retreatSlug: string
  locale: Locale
}

const copy = {
  en: {
    title: 'Join the Waitlist',
    body: 'This retreat is sold out. Be first to know if a spot opens.',
    name: 'Your name',
    email: 'Your email',
    submit: 'Join Waitlist',
    submitting: 'Sending...',
    success: "You're on the list. We'll reach out if a spot opens.",
    error: 'Something went wrong. Please try again.',
    duplicate: "You're already on the list.",
    consentText: 'I agree to the processing of my personal data in accordance with the',
    privacyPolicy: 'Privacy Policy',
  },
  he: {
    title: 'הצטרפו לרשימת ההמתנה',
    body: 'הריטריט מלא. הירשמו ונעדכן אם יתפנה מקום.',
    name: 'השם שלכם',
    email: 'האימייל שלכם',
    submit: 'הוסיפו אותי לרשימה',
    submitting: 'שולח...',
    success: 'אתם ברשימה. נעדכן אם יתפנה מקום.',
    error: 'משהו השתבש. נסו שוב.',
    duplicate: 'כבר נרשמתם לרשימה.',
    consentText: 'אני מסכים/ה לעיבוד המידע האישי שלי בהתאם ל',
    privacyPolicy: 'מדיניות הפרטיות',
  },
}

export default function WaitlistForm({ retreatSlug, locale }: WaitlistFormProps) {
  const t = copy[locale] ?? copy.en
  const uid = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !consent) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, retreat_slug: retreatSlug, locale }),
      })
      const json = await res.json() as { ok?: boolean; duplicate?: boolean }
      if (json.duplicate) { setStatus('duplicate'); return }
      setStatus(res.ok && json.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      style={{
        background: 'rgba(181,82,26,0.08)',
        border: '1px solid rgba(181,82,26,0.25)',
        borderRadius: '8px',
        padding: '1.5rem',
      }}
    >
      <p
        className="eyebrow mb-2"
        style={{ color: '#FF8C5A', fontWeight: 700 }}
      >
        {t.title}
      </p>
      <p
        className="font-body text-sm mb-4"
        style={{ color: 'rgba(232,213,183,0.85)', fontWeight: 400 }}
      >
        {t.body}
      </p>

      {status === 'success' || status === 'duplicate' ? (
        <motion.p
          initial={{ y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-body text-sm"
          style={{ color: '#D4A853' }}
        >
          {status === 'duplicate' ? t.duplicate : t.success}
        </motion.p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <div>
            <label htmlFor={`${uid}-name`} className="sr-only">{t.name}</label>
            <input
              id={`${uid}-name`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.name}
              required
              dir={locale === 'he' ? 'rtl' : 'ltr'}
              className="font-body text-sm w-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(232,213,183,0.4)',
                borderRadius: '4px',
                padding: '0.6rem 0.85rem',
                color: '#E8D5B7',
              }}
            />
          </div>
          <div>
            <label htmlFor={`${uid}-email`} className="sr-only">{t.email}</label>
            <input
              id={`${uid}-email`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.email}
              required
              dir="ltr"
              className="font-body text-sm w-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(232,213,183,0.4)',
                borderRadius: '4px',
                padding: '0.6rem 0.85rem',
                color: '#E8D5B7',
              }}
            />
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
              {t.consentText}{' '}
              <Link href={`/${locale}/privacy`} style={{ color: '#D4A853', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                {t.privacyPolicy}
              </Link>.
            </span>
          </label>

          <motion.button
            type="submit"
            disabled={status === 'loading' || !consent}
            whileHover={status !== 'loading' && consent ? { scale: 1.02 } : {}}
            whileTap={status !== 'loading' && consent ? { scale: 0.97 } : {}}
            className="btn-ghost-gold justify-center"
            style={{ borderRadius: '4px', padding: '0.7rem 1.5rem', fontSize: '13px', fontWeight: 600, opacity: consent ? 1 : 0.5, cursor: consent ? 'pointer' : 'not-allowed' }}
          >
            {status === 'loading' ? t.submitting : t.submit}
          </motion.button>
          {status === 'error' && (
            <p className="font-body text-xs text-center" style={{ color: '#FF8C5A', fontWeight: 500 }}>
              {t.error}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
