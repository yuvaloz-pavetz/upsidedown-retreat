'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { i18n, type Locale } from '@/lib/i18n'
import { instructors } from '@/lib/constants'

interface InstructorsProps {
  locale: Locale
  t?: typeof i18n['en']['instructors']
}

function InstructorCard({
  data,
  image,
  index,
}: {
  data: { name: string; role: string; bio: string; tags: string[] }
  image: string
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        padding: 'clamp(2.5rem, 5vw, 3.75rem) clamp(2rem, 4vw, 3.25rem)',
        transition: 'background 0.4s',
      }}
    >
      {/* Circular photo */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '1px solid rgba(212,168,83,0.25)',
          overflow: 'hidden',
          marginBottom: '1.75rem',
          position: 'relative',
        }}
      >
        <Image
          src={image}
          alt={data.name}
          fill
          className="object-cover"
          style={{ objectPosition: 'center top' }}
          sizes="80px"
        />
      </div>

      <h3
        className="font-display font-light"
        style={{
          fontSize: 'clamp(1.6rem, 3vw, 1.75rem)',
          color: '#E8D5B7',
          marginBottom: '0.4rem',
          lineHeight: 1.1,
        }}
      >
        {data.name}
      </h3>

      <p
        className="font-body"
        style={{
          fontSize: '0.7rem',
          color: '#D4A853',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
          fontWeight: 500,
        }}
      >
        {data.role}
      </p>

      <p
        className="font-body"
        style={{
          fontSize: '0.95rem',
          color: 'rgba(232,213,183,0.5)',
          lineHeight: 1.75,
          fontWeight: 300,
          marginBottom: '1.75rem',
        }}
      >
        {data.bio}
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {data.tags.map((tag) => (
          <span
            key={tag}
            style={{
              padding: '0.35rem 0.875rem',
              border: '1px solid rgba(212,168,83,0.2)',
              borderRadius: '20px',
              fontSize: '0.65rem',
              color: 'rgba(212,168,83,0.7)',
              letterSpacing: '0.06em',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Instructors({ locale, t: tProp }: InstructorsProps) {
  const t = tProp ?? i18n[locale].instructors

  const people = [
    { data: t.yuval, image: instructors[0].image },
    { data: t.gil, image: instructors[1].image },
  ]

  return (
    <section
      id="instructors"
      className="relative overflow-hidden"
      style={{
        background: [
          'radial-gradient(ellipse 80% 55% at 25% 35%, rgba(16,38,64,0.55) 0%, transparent 60%)',
          'linear-gradient(to bottom, #07101c, #0a1826, #07101c)',
        ].join(', '),
      }}
    >
      <div className="section-container py-28 md:py-40">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20"
          dir="ltr"
        >
          <p className="eyebrow mb-5" style={{ fontSize: '0.6rem' }}>{t.label}</p>
          <h2
            className="font-display font-light italic"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.5rem)',
              lineHeight: 1.05,
              color: '#E8D5B7',
              whiteSpace: 'pre-line',
            }}
          >
            {t.title}
          </h2>
        </motion.div>

        {/* Cards */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2"
          style={{ gap: '2px' }}
          dir="ltr"
        >
          {people.map(({ data, image }, i) => (
            <InstructorCard key={data.name} data={data} image={image} index={i} />
          ))}
        </div>

        {/* Bridge quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          dir="ltr"
          style={{
            background: 'rgba(212,168,83,0.04)',
            padding: 'clamp(2.5rem, 5vw, 3.75rem) clamp(2rem, 4vw, 3.25rem)',
            textAlign: 'center',
            marginTop: '2px',
          }}
        >
          <p
            className="font-display font-light italic"
            style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)',
              color: 'rgba(232,213,183,0.75)',
              lineHeight: 1.8,
              maxWidth: '680px',
              margin: '0 auto',
              whiteSpace: 'pre-line',
            }}
          >
            {t.bridge}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
