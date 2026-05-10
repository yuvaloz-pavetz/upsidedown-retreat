'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { i18n, type Locale } from '@/lib/i18n'

interface CoreIdeaProps {
  locale: Locale
  t?: typeof i18n['en']['concept']
}

function PillarCard({ pillar, index }: { pillar: { name: string; trait: string; desc: string }; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden cursor-default"
      style={{ padding: '3rem 2.25rem', background: '#EFE9DD' }}
    >
      {/* Navy fill from bottom on hover */}
      <div
        className="absolute inset-0"
        style={{
          background: '#0B1D2A',
          transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'bottom',
          transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      <div className="relative z-10">
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: hovered ? '#E6D7C0' : '#C8A97A',
            marginBottom: '16px',
            textTransform: 'uppercase',
            transition: 'color 0.3s',
          }}
        >
          {pillar.trait}
        </p>
        <h3
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(1.5rem, 2.5vw, 1.875rem)',
            fontWeight: 500,
            color: hovered ? '#F7F8F6' : '#0B1D2A',
            marginBottom: '0.75rem',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            transition: 'color 0.3s',
          }}
        >
          {pillar.name}
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: hovered ? 'rgba(255,255,255,0.6)' : '#6B7884',
            lineHeight: 1.65,
            fontWeight: 300,
            transition: 'color 0.3s',
          }}
        >
          {pillar.desc}
        </p>
      </div>

    </motion.div>
  )
}

export default function CoreIdea({ locale, t: tProp }: CoreIdeaProps) {
  const t = tProp ?? i18n[locale].concept

  return (
    <section
      id="concept"
      className="py-28 md:py-40 relative overflow-hidden"
      style={{ background: '#F7F8F6' }}
    >
      <div className="section-container">
        {/* Header: 2-col */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20 items-end"
          dir="ltr"
        >
          <div>
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
          </div>
          <div>
            <p
              style={{
                fontSize: '17px',
                lineHeight: 1.75,
                color: '#6B7884',
                fontWeight: 300,
                maxWidth: '540px',
                marginBottom: '32px',
              }}
            >
              {t.body}
            </p>
            <blockquote
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '22px',
                fontStyle: 'italic',
                color: '#123A4A',
                lineHeight: 1.55,
                paddingLeft: '24px',
                borderLeft: '2px solid #E3B23C',
                fontWeight: 400,
              }}
            >
              {t.quote}
            </blockquote>
          </div>
        </motion.div>

        {/* Pillars grid — 4 cols */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{ gap: '2px' }}
          dir="ltr"
        >
          {t.pillars.map((pillar, i) => (
            <PillarCard key={pillar.name} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
