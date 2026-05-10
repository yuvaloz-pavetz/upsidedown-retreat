'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { i18n, type Locale } from '@/lib/i18n'

interface FinalCtaProps {
  locale: Locale
  t?: typeof i18n['en']['finalCta']
}

export default function FinalCta({ locale, t: tProp }: FinalCtaProps) {
  const t = tProp ?? i18n[locale].finalCta

  const titleLines = t.title.split('\n')

  return (
    <section
      style={{
        background: '#0B1D2A',
        textAlign: 'center',
        padding: 'clamp(6rem,14vw,10rem) clamp(2rem,8vw,5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Radial bg glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(45,74,107,0.6) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Ripple circles */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${200 + i * 120}px`,
            height: `${200 + i * 120}px`,
            border: '1px solid rgba(200,169,122,0.04)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      ))}

      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            fontFamily: 'var(--font-manrope), sans-serif',
            fontSize: '11px',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#E6D7C0',
            marginBottom: '24px',
          }}
        >
          {t.label}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: '#F7F8F6',
            marginBottom: '16px',
            whiteSpace: 'pre-line',
          }}
        >
          {titleLines[0]}
          {titleLines[1] && (
            <>
              <br />
              <em style={{ fontStyle: 'italic', color: '#E6D7C0' }}>{titleLines[1]}</em>
            </>
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          style={{
            fontSize: '17px',
            color: 'rgba(255,255,255,0.45)',
            marginBottom: '52px',
            fontWeight: 300,
          }}
        >
          {t.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link
            href={`/${locale}/events`}
            className="btn-solid-gold"
            style={{ fontSize: '0.65rem' }}
          >
            {t.btn1}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
