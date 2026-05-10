'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import FadeUp from '@/components/motion/FadeUp'
import { i18n, type Locale } from '@/lib/i18n'

interface NewsletterProps {
  locale: Locale
  t?: typeof i18n['en']['newsletter']
}

export default function Newsletter({ locale, t: tProp }: NewsletterProps) {
  const t = tProp ?? i18n[locale].newsletter
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
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
        borderTop: '1px solid rgba(232,213,183,0.07)',
        background: [
          'radial-gradient(ellipse 65% 55% at 50% 90%, rgba(74,155,184,0.09) 0%, transparent 65%)',
          'radial-gradient(ellipse 35% 28% at 78% 12%, rgba(212,168,83,0.05) 0%, transparent 50%)',
          '#0B1C2C',
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
            style={{ color: 'rgba(232,213,183,0.45)', letterSpacing: '0.05em', fontWeight: 300 }}
          >
            {t.subtext}
          </p>
        </div>

        {status === 'success' ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
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
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.placeholder}
                  required
                  className="flex-1 bg-transparent font-body text-sm outline-none min-w-0"
                  style={{ color: '#E8D5B7', letterSpacing: '0.03em', fontWeight: 300 }}
                  dir="ltr"
                />
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-solid-gold flex-shrink-0"
                  style={{ fontSize: '0.68rem', padding: '0.7rem 1.5rem' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {status === 'loading' ? '...' : t.button}
                </motion.button>
              </div>

              {status === 'error' && (
                <p
                  className="mt-3 text-center font-body text-xs"
                  style={{ color: '#B5521A', letterSpacing: '0.04em' }}
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
