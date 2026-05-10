'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { i18n, type Locale } from '@/lib/i18n'

const ICONS = ['◎', '○', '◇', '△']

interface WhoForProps {
  locale: Locale
  t?: typeof i18n['en']['who']
}

function AudienceCard({ card, icon, index }: { card: { title: string; desc: string }; icon: string; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
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
      <span
        style={{
          display: 'block',
          fontSize: '1.75rem',
          color: '#C8A97A',
          marginBottom: '1.25rem',
        }}
      >
        {icon}
      </span>
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
          color: '#6B7884',
          lineHeight: 1.65,
          fontWeight: 300,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14" dir="ltr">
          {t.cards.map((card, i) => (
            <AudienceCard key={card.title} card={card} icon={ICONS[i]} index={i} />
          ))}
        </div>

        {/* Reassurance bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          dir="ltr"
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
          <span style={{ fontSize: '2rem', color: '#C8A97A', flexShrink: 0 }}>◎</span>
          <p
            style={{
              fontSize: '17px',
              color: '#0B1D2A',
              lineHeight: 1.65,
              fontWeight: 300,
            }}
          >
            {t.reassurance}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
