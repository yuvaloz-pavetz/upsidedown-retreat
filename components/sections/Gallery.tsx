'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { i18n, type Locale } from '@/lib/i18n'

const IMAGES = [
  { src: '/images/above-surface.jpg', alt: 'Handstand practice', col: 5, h: 320 },
  { src: '/images/below-surface.jpeg', alt: 'Underwater freediving', col: 4, h: 320 },
  { src: '/images/below-surface-2.jpeg', alt: 'Deep dive', col: 3, h: 320 },
  { src: '/images/retreat-session.jpg', alt: 'Retreat session', col: 4, h: 280 },
  { src: '/images/class-session.jpg', alt: 'Group practice', col: 5, h: 280 },
  { src: '/images/shipwreck.jpeg', alt: 'Shipwreck dive', col: 3, h: 280 },
  { src: '/images/hero-new.jpeg', alt: 'Above the surface', col: 6, h: 240 },
  { src: '/images/testimonials-bg.jpeg', alt: 'Ocean depth', col: 3, h: 240 },
  { src: '/images/above-surface-2.jpg', alt: 'Connection', col: 3, h: 240 },
]

interface GalleryProps {
  locale: Locale
  t?: typeof i18n['en']['gallery']
}

function GalleryItem({ src, alt, col, h, index }: { src: string; alt: string; col: number; h: number; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1.0, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        gridColumn: `span ${col}`,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
        height: `${h}px`,
        cursor: 'pointer',
      }}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover"
        sizes={`${Math.round(col / 12 * 100)}vw`}
        style={{
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
    </motion.div>
  )
}

export default function Gallery({ locale, t: tProp }: GalleryProps) {
  const t = tProp ?? i18n[locale].gallery

  return (
    <section
      id="gallery"
      className="relative overflow-hidden"
      style={{
        background: '#0B1D2A',
        padding: 'clamp(5rem,10vw,7.5rem) clamp(2.5rem,3vw,2.5rem)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
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
              color: '#E6D7C0',
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
              color: '#F7F8F6',
              letterSpacing: '-0.01em',
            }}
          >
            {t.title}
          </h2>
        </motion.div>

        {/* Masonry grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '8px',
          }}
        >
          {IMAGES.map((img, i) => (
            <GalleryItem key={`${img.src}-${i}`} {...img} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
