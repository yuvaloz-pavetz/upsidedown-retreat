'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Locale } from '@/lib/i18n'
import type { Event } from '@/lib/events'
import WaitlistForm from '@/components/ui/WaitlistForm'
import NewsletterInline from '@/components/ui/NewsletterInline'

interface SoldOutPopupProps {
  retreat: Event
  locale: Locale
}

const copy = {
  en: {
    eyebrow: 'Sold Out',
    title: (title: string) => `${title} is fully booked`,
    body: 'This retreat has sold out. Join the waitlist below to hear first if a spot opens, or subscribe to our newsletter for future retreats.',
    newsletterHeading: 'Or be first to know about our next retreats',
    note: 'We only write to you when we actually have new retreat dates — no spam.',
  },
  he: {
    eyebrow: 'אזל',
    title: (title: string) => `${title} אזל`,
    body: 'הריטריט הזה מלא. הצטרפו לרשימת ההמתנה למטה כדי לדעת ראשונים אם יתפנה מקום, או הירשמו לניוזלטר שלנו לעדכון על ריטריטים הבאים.',
    newsletterHeading: 'או היו הראשונים לדעת על הריטריטים הבאים',
    note: 'אנחנו כותבים רק כשיש בפועל תאריכי ריטריט חדשים — בלי ספאם.',
  },
}

const ease = [0.16, 1, 0.3, 1] as const

export default function SoldOutPopup({ retreat, locale }: SoldOutPopupProps) {
  const t = copy[locale] ?? copy.en
  const isHe = locale === 'he'
  const storageKey = `soldout-popup-dismissed-${retreat.slug}`

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(storageKey)) return
    setOpen(true)
  }, [storageKey])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function handleClose() {
    setOpen(false)
    sessionStorage.setItem(storageKey, '1')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(5,11,20,0.82)', backdropFilter: 'blur(10px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflowY: 'auto' }}
        >
          <motion.div
            initial={{ y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease }}
            onClick={e => e.stopPropagation()}
            dir={isHe ? 'rtl' : 'ltr'}
            style={{ background: '#0d1e2d', border: '1px solid rgba(232,213,183,0.1)', borderRadius: '8px', padding: '2.5rem', maxWidth: '440px', width: '100%', position: 'relative', margin: 'auto' }}
          >
            <button
              onClick={handleClose}
              aria-label="Close"
              style={{ position: 'absolute', top: '1rem', [isHe ? 'left' : 'right']: '1rem', background: 'none', border: 'none', color: 'rgba(232,213,183,0.85)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: '0.25rem 0.5rem', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8D5B7')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,213,183,0.85)')}
            >×</button>

            <span
              className="eyebrow"
              style={{
                display: 'inline-block',
                marginBottom: '0.9rem',
                padding: '0.3rem 0.7rem',
                borderRadius: '20px',
                background: 'rgba(181,82,26,0.18)',
                border: '1px solid rgba(255,140,90,0.6)',
                color: '#FF8C5A',
                fontWeight: 700,
              }}
            >
              {t.eyebrow}
            </span>

            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.7rem', fontWeight: 300, fontStyle: 'italic', color: '#E8D5B7', marginBottom: '0.75rem', lineHeight: 1.25 }}>
              {t.title(retreat.title[locale])}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(232,213,183,0.85)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              {t.body}
            </p>

            <WaitlistForm retreatSlug={retreat.slug} locale={locale} />

            <div style={{ borderTop: '1px solid rgba(232,213,183,0.15)', margin: '1.75rem 0 1.25rem' }} />

            <NewsletterInline locale={locale} heading={t.newsletterHeading} />

            <p style={{ fontSize: '11px', color: 'rgba(232,213,183,0.5)', lineHeight: 1.5, marginTop: '1.1rem' }}>
              {t.note}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
