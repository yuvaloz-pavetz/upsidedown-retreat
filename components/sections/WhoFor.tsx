'use client'

import { motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { i18n, type Locale } from '@/lib/i18n'

const ICONS: ReactNode[] = [
  // Movement Lovers — wave / flow
  <svg key="wave" width="32" height="24" viewBox="0 0 32 24" fill="none" aria-hidden="true">
    <path d="M2 17c3 0 3-6 6-6s3 6 6 6 3-6 6-6 3 6 6 6" stroke="#C8A97A" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 10c1.5 0 2-3 4-3s2.5 3 4 3" stroke="#C8A97A" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={0.4}/>
  </svg>,
  // Curious Beginners — compass
  <svg key="compass" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="11" stroke="#C8A97A" strokeWidth="1.5"/>
    <path d="M14 8v3M14 17v3M8 14h3M17 14h3" stroke="#C8A97A" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={0.45}/>
    <circle cx="14" cy="14" r="2.5" stroke="#C8A97A" strokeWidth="1.5"/>
  </svg>,
  // Challenge Seekers — mountain
  <svg key="mountain" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M14 5L26 23H2L14 5Z" stroke="#C8A97A" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 17l4-7 4 7" stroke="#C8A97A" strokeWidth="1.5" strokeLinejoin="round" strokeOpacity={0.4}/>
  </svg>,
  // Presence Seekers — eye
  <svg key="eye" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <path d="M3 14s4-9 11-9 11 9 11 9-4 9-11 9S3 14 3 14Z" stroke="#C8A97A" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="14" cy="14" r="3.5" stroke="#C8A97A" strokeWidth="1.5"/>
    <circle cx="14" cy="14" r="1.5" fill="#C8A97A"/>
  </svg>,
]

interface WhoForProps {
  locale: Locale
  t?: typeof i18n['en']['who']
}

function AudienceCard({ card, icon, index }: { card: { title: string; desc: string }; icon: ReactNode; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '2.5rem 2rem',
        background: hovered ? '#F7F8F6' : '#EFE9DD',
        borderRadius: '4px',
        border: hovered ? '1px solid rgba(200,169,122,0.25)' : '1px solid transparent',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 50px rgba(26,26,46,0.08)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default',
      }}
    >
      <div style={{ marginBottom: '1.25rem', lineHeight: 0 }}>
        {icon}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-cormorant), Georgia, serif',
          fontSize: '20px',
          color: '#0B1D2A',
          marginBottom: '10px',
          fontWeight: 400,
        }}
      >
        {card.title}
      </h3>
      <p
        style={{
          fontSize: '14px',
          color: '#4A5764',
          lineHeight: 1.65,
          fontWeight: 400,
        }}
      >
        {card.desc}
      </p>
    </motion.div>
  )
}

export default function WhoFor({ locale, t: tProp }: WhoForProps) {
  const t = tProp ?? i18n[locale].who

  return (
    <section
      className="py-28 md:py-40 relative"
      style={{ background: '#F7F8F6' }}
    >
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
          dir={locale === 'he' ? 'rtl' : 'ltr'}
        >
          <p
            style={{
              fontFamily: 'var(--font-manrope), sans-serif',
              fontSize: '13px',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#6B4D14',
              marginBottom: '24px',
              fontWeight: 600,
            }}
          >
            {t.label}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(36px, 4.5vw, 64px)',
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

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14" dir={locale === 'he' ? 'rtl' : 'ltr'}>
          {t.cards.map((card, i) => (
            <AudienceCard key={card.title} card={card} icon={ICONS[i]} index={i} />
          ))}
        </div>

        {/* Reassurance bar */}
        <motion.div
          initial={{ y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          dir={locale === 'he' ? 'rtl' : 'ltr'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            padding: '2.5rem 2rem',
            background: '#EAE3D5',
            borderRadius: '4px',
            border: '1px solid rgba(200,169,122,0.35)',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
            <circle cx="14" cy="14" r="11" stroke="#C8A97A" strokeWidth="1.5"/>
            <circle cx="14" cy="14" r="4" stroke="#C8A97A" strokeWidth="1.5"/>
          </svg>
          <p
            style={{
              fontSize: '17px',
              color: '#0B1D2A',
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
            {t.reassurance}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
