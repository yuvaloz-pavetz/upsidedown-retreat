'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import FadeUp from '@/components/motion/FadeUp'
import { i18n, type Locale } from '@/lib/i18n'

interface NewsletterProps {
  locale: Locale
  t?: typeof i18n['en']['newsletter']
}

export default function Newsletter({ locale, t: tProp }: NewsletterProps) {
  const t = tProp ?? i18n[locale].newsletter
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
    <section
      id="newsletter"
      className="py-24 md:py-32 relative"
      style={{
        borderTop: '1px solid rgba(232,213,183,0.3)',
        backgroundColor: '#0B1C2C',
        backgroundImage: [
          'radial-gradient(ellipse 65% 55% at 50% 90%, rgba(74,155,184,0.09) 0%, transparent 65%)',
          'radial-gradient(ellipse 35% 28% at 78% 12%, rgba(212,168,83,0.05) 0%, transparent 50%)',
        ].join(', '),
      }}
    >
      <div className="section-container flex flex-col items-center">
        <div className="text-center mb-12">
          <h2
            className="font-display font-light italic text-display-lg mb-4"
            style={{ color: '#E8D5B7' }}
          >
            {t.heading}
          </h2>
          <p
            className="font-body text-sm"
            style={{ color: 'rgba(232,213,183,0.85)', letterSpacing: '0.05em', fontWeight: 400 }}
          >
            {t.subtext}
          </p>
        </div>

        {status === 'success' ? (
          <motion.p
            initial={{ y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display italic text-xl"
            style={{ color: '#D4A853' }}
          >
            {t.success}
          </motion.p>
        ) : (
          <FadeUp delay={0.1} className="w-full max-w-[36rem]">
            <form onSubmit={handleSubmit}>
              <div className="glass flex items-center gap-2 rounded-full p-1.5 pl-6">
                <label htmlFor="newsletter-email" className="sr-only">
                  {locale === 'he' ? 'כתובת אימייל' : 'Email address'}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.placeholder}
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
                  {status === 'loading' ? (locale === 'he' ? 'שולח...' : 'Sending...') : t.button}
                </motion.button>
              </div>

              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  marginTop: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={e => setConsent(e.target.checked)}
                  required
                  style={{ marginTop: '2px', accentColor: '#D4A853', flexShrink: 0, width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', color: 'rgba(232,213,183,0.7)', lineHeight: 1.5 }}>
                  {locale === 'he'
                    ? <>אני מסכים/ה לעיבוד המידע האישי שלי בהתאם ל<Link href={`/${locale}/privacy`} style={{ color: '#D4A853', textDecoration: 'underline', textUnderlineOffset: '2px' }}>מדיניות הפרטיות</Link>.</>
                    : <>I agree to the processing of my personal data in accordance with the <Link href={`/${locale}/privacy`} style={{ color: '#D4A853', textDecoration: 'underline', textUnderlineOffset: '2px' }}>Privacy Policy</Link>.</>
                  }
                </span>
              </label>

              {status === 'error' && (
                <p
                  className="mt-3 text-center font-body text-xs"
                  style={{ color: '#FF8C5A', letterSpacing: '0.04em', fontWeight: 500 }}
                >
                  {t.error}
                </p>
              )}
            </form>
          </FadeUp>
        )}
      </div>
    </section>
  )
}
