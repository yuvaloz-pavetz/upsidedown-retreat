'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { i18n, type Locale } from '@/lib/i18n'

interface CoreIdeaProps {
  locale: Locale
  t?: typeof i18n['en']['concept']
}

const WAVE_PATH_A = 'M0 20 Q100 4,200 20 Q300 36,400 20 Q500 4,600 20 Q700 36,800 20 L800 40 L0 40 Z'
const WAVE_PATH_B = 'M0 20 Q100 36,200 20 Q300 4,400 20 Q500 36,600 20 Q700 4,800 20 L800 40 L0 40 Z'

function PillarCard({ pillar, index }: { pillar: { name: string; trait: string; desc: string }; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      className="relative overflow-hidden cursor-default"
      style={{ padding: '3rem 2.25rem', background: '#EFE9DD' }}
    >
      {/* Water fill — always LTR so wave translateX animation is not reversed by RTL dir */}
      <div
        dir="ltr"
        className="absolute inset-x-0 bottom-0"
        style={{
          height: 'calc(100% + 40px)',
          transform: hovered ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform ${hovered ? '1.3s' : '1.0s'} cubic-bezier(0.16,1,0.3,1)`,
        }}
      >
        {/* Wave surface */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40px', overflow: 'hidden' }}>
          <svg
            viewBox="0 0 800 40"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              width: '200%',
              height: '100%',
              animation: 'pillarWave1 5s linear infinite',
              opacity: 0.7,
            }}
          >
            <path d={WAVE_PATH_A} fill="#0B1D2A" />
          </svg>
          <svg
            viewBox="0 0 800 40"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              width: '200%',
              height: '100%',
              animation: 'pillarWave2 8s linear infinite',
            }}
          >
            <path d={WAVE_PATH_B} fill="#0B1D2A" />
          </svg>
        </div>
        {/* Fill body below wave */}
        <div style={{ position: 'absolute', top: '38px', bottom: 0, left: 0, right: 0, background: '#0B1D2A' }} />
      </div>

      <div className="relative z-10">
        <p
          style={{
            fontSize: '13px',
            letterSpacing: '0.2em',
            color: hovered ? '#E6D7C0' : '#6B5535',
            marginBottom: '16px',
            textTransform: 'uppercase',
            transition: 'color 0.35s',
            fontWeight: 600,
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
            transition: 'color 0.35s',
          }}
        >
          {pillar.name}
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: hovered ? 'rgba(255,255,255,0.85)' : '#4A5764',
            lineHeight: 1.65,
            fontWeight: 400,
            transition: 'color 0.35s',
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
          initial={{ y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20 items-end"
          dir={locale === 'he' ? 'rtl' : 'ltr'}
        >
          <div>
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
          </div>
          <div>
            <p
              style={{
                fontSize: '17px',
                lineHeight: 1.75,
                color: '#4A5764',
                fontWeight: 400,
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
          dir={locale === 'he' ? 'rtl' : 'ltr'}
        >
          {t.pillars.map((pillar, i) => (
            <PillarCard key={pillar.name} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
