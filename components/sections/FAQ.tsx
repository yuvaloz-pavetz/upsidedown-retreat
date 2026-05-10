'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { i18n, type Locale } from '@/lib/i18n'

interface FAQProps {
  locale: Locale
  t?: typeof i18n['en']['faq']
}

function FAQItem({ item, index, isOpen, onToggle }: {
  item: { q: string; a: string }
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{ borderBottom: '1px solid rgba(26,26,46,0.1)' }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left flex items-center justify-between gap-6 py-7"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
            color: isOpen ? '#0B1D2A' : '#123A4A',
            lineHeight: 1.3,
            fontWeight: 400,
            transition: 'color 0.3s',
          }}
        >
          {item.q}
        </span>
        <span
          style={{
            width: '28px',
            height: '28px',
            border: `1px solid ${isOpen ? 'rgba(200,169,122,0.7)' : 'rgba(200,169,122,0.4)'}`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '16px',
            color: isOpen ? '#0B1D2A' : '#C8A97A',
            background: isOpen ? '#C8A97A' : 'transparent',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'all 0.35s ease',
          }}
        >
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                fontSize: '16px',
                color: '#6B7884',
                lineHeight: 1.75,
                fontWeight: 300,
                paddingBottom: '28px',
                maxWidth: '68ch',
              }}
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ({ locale, t: tProp }: FAQProps) {
  const t = tProp ?? i18n[locale].faq
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section
      id="faq"
      className="py-28 md:py-40 relative"
      style={{ background: '#F7F8F6' }}
    >
      <div className="section-container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
            dir="ltr"
          >
            <p
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#E3B23C',
                marginBottom: '24px',
                fontWeight: 500,
              }}
            >
              {t.label}
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(36px, 4vw, 56px)',
                fontWeight: 500,
                lineHeight: 1.05,
                color: '#0B1D2A',
                letterSpacing: '-0.01em',
                whiteSpace: 'pre-line',
              }}
            >
              {t.title}
            </h2>
          </motion.div>

          {/* Accordion */}
          <div dir="ltr" style={{ borderTop: '1px solid rgba(26,26,46,0.1)' }}>
            {t.items.map((item, i) => (
              <FAQItem
                key={i}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
