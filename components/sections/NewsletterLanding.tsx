'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import FadeUp from '@/components/motion/FadeUp'
import type { Locale } from '@/lib/i18n'

const SUPPORT_EMAIL = 'hi@upsidedown-retreat.com'

interface NewsletterLandingProps {
  locale: Locale
}

const copy = {
  en: {
    dir: 'ltr' as const,
    eyebrow: "Before It's Public",
    heading: 'Hear about it\nbefore anyone else.',
    intro: "We keep it small and intentional, with a limited number of spots each time. This list hears the dates first, along with honest notes and photos from the water between retreats.",
    bullets: [
      'New dates and locations, before we post them anywhere else',
      'Real notes and photos from past groups, not marketing',
      'Maybe one email a month. Nothing more.',
    ],
    emailLabel: 'Email address',
    placeholder: 'your@email.com',
    button: 'Join the list',
    sending: 'Sending...',
    consentPrefix: 'I agree to the processing of my personal data in accordance with the ',
    consentLink: 'Privacy Policy',
    consentSuffix: '.',
    success: "You're on the list. We'll write when there's something worth saying.",
    error: `Something went wrong. Try again or email ${SUPPORT_EMAIL}`,
    imageAlt: 'A freediver rising toward the surface, light breaking through the water above',
  },
  he: {
    dir: 'rtl' as const,
    eyebrow: 'לפני שזה יוצא לאוויר',
    heading: 'תשמעו על זה\nלפני כולם.',
    intro: 'אנחנו שומרים על ריטריט קטן ומיוחד, עם מספר מקומות מוגבל בכל פעם. הרשימה הזו שומעת על התאריכים ראשונה, יחד עם רשמים ותמונות אמיתיים מהמים בין ריטריט לריטריט.',
    bullets: [
      'תאריכים ומיקומים חדשים, לפני שהם מתפרסמים בכל מקום אחר',
      'רשמים ותמונות אמיתיים מקבוצות קודמות, לא שיווק',
      'אולי מייל אחד בחודש. לא יותר.',
    ],
    emailLabel: 'כתובת אימייל',
    placeholder: 'האימייל שלכם',
    button: 'הצטרפות לרשימה',
    sending: 'שולח...',
    consentPrefix: 'אני מסכים/ה לעיבוד המידע האישי שלי בהתאם ל',
    consentLink: 'מדיניות הפרטיות',
    consentSuffix: '.',
    success: 'אתם ברשימה. נכתוב כשיש משהו שווה לספר.',
    error: `משהו השתבש. נסו שוב או כתבו ל ${SUPPORT_EMAIL}`,
    imageAlt: 'צוללן חופשי עולה אל פני המים, אור חודר מלמעלה',
  },
}

export default function NewsletterLanding({ locale }: NewsletterLandingProps) {
  const c = copy[locale]
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
    <main
      id="main-content"
      dir={c.dir}
      className="flex flex-col lg:flex-row"
      style={{ minHeight: '100svh', background: '#0B1D2A' }}
    >
      <div className="relative lg:w-[52%]" style={{ minHeight: '46vh' }}>
        <Image
          src="/images/below-surface-2.jpeg"
          alt={c.imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
          style={{ objectPosition: '50% 30%' }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: [
              'linear-gradient(180deg, rgba(11,29,42,0.55) 0%, rgba(11,29,42,0.05) 32%, rgba(11,29,42,0.08) 68%, rgba(11,29,42,0.6) 100%)',
              'linear-gradient(90deg, transparent 60%, rgba(11,29,42,0.35) 100%)',
            ].join(', '),
          }}
        />
      </div>

      <div
        className="flex items-center lg:w-[48%]"
        style={{ padding: 'clamp(2.5rem,6vw,5rem) clamp(1.5rem,6vw,5rem)', paddingTop: 'clamp(7rem,14vw,8.5rem)' }}
      >
        <div style={{ maxWidth: '30rem' }}>
          <FadeUp>
            <p
              className="font-body"
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#D4A853',
                marginBottom: '1.25rem',
              }}
            >
              {c.eyebrow}
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1
              className="font-display italic font-light"
              style={{
                fontSize: 'clamp(2.25rem,4.5vw,3.75rem)',
                lineHeight: 1.1,
                color: '#E8D5B7',
                marginBottom: '1.5rem',
                whiteSpace: 'pre-line',
              }}
            >
              {c.heading}
            </h1>
          </FadeUp>

          <FadeUp delay={0.16}>
            <p
              className="font-body"
              style={{ fontSize: '15px', lineHeight: 1.75, color: 'rgba(232,213,183,0.72)', marginBottom: '2rem' }}
            >
              {c.intro}
            </p>
          </FadeUp>

          <FadeUp delay={0.22}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem', padding: 0, listStyle: 'none' }}>
              {c.bullets.map((b) => (
                <li
                  key={b}
                  style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '13.5px', lineHeight: 1.6, color: 'rgba(232,213,183,0.85)' }}
                >
                  <span aria-hidden style={{ color: '#D4A853', flexShrink: 0 }}>·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp delay={0.3}>
            {status === 'success' ? (
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display italic"
                style={{ fontSize: '1.15rem', color: '#D4A853' }}
              >
                {c.success}
              </motion.p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="glass flex items-center gap-2 rounded-full p-1.5 pl-6">
                  <label htmlFor="newsletter-landing-email" className="sr-only">
                    {c.emailLabel}
                  </label>
                  <input
                    id="newsletter-landing-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={c.placeholder}
                    required
                    className="flex-1 bg-transparent font-body text-sm outline-none min-w-0"
                    style={{ color: '#E8D5B7', letterSpacing: '0.03em', fontWeight: 400 }}
                    dir="ltr"
                  />
                  <motion.button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-solid-gold flex-shrink-0"
                    style={{ fontSize: '0.85rem', padding: '0.7rem 1.5rem', fontWeight: 600 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {status === 'loading' ? c.sending : c.button}
                  </motion.button>
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginTop: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    style={{ marginTop: '2px', accentColor: '#D4A853', flexShrink: 0, width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '12px', color: 'rgba(232,213,183,0.7)', lineHeight: 1.5 }}>
                    {c.consentPrefix}
                    <Link href={`/${locale}/privacy`} style={{ color: '#D4A853', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                      {c.consentLink}
                    </Link>
                    {c.consentSuffix}
                  </span>
                </label>

                {status === 'error' && (
                  <p className="font-body" style={{ marginTop: '0.75rem', fontSize: '12px', color: '#FF8C5A', letterSpacing: '0.02em' }}>
                    {c.error}
                  </p>
                )}
              </form>
            )}
          </FadeUp>
        </div>
      </div>
    </main>
  )
}
