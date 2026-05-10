'use client'

import { motion } from 'framer-motion'
import { i18n, type Locale } from '@/lib/i18n'

interface TimelineProps {
  locale: Locale
  t?: typeof i18n['en']['timeline']
}

export default function Timeline({ locale, t: tProp }: TimelineProps) {
  const t = tProp ?? i18n[locale].timeline

  return (
    <section
      id="experience"
      className="relative overflow-hidden"
      style={{
        background: [
          'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(14,32,56,0.6) 0%, transparent 60%)',
          'linear-gradient(to bottom, #070d18 0%, #0a1826 50%, #070d18 100%)',
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-end">
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
            <p
              className="font-body"
              style={{
                fontSize: '1rem',
                color: 'rgba(232,213,183,0.5)',
                lineHeight: 1.75,
                fontWeight: 300,
                maxWidth: '40ch',
              }}
            >
              {t.body}
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div dir="ltr" style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: '24px',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'linear-gradient(to bottom, rgba(212,168,83,0.5), rgba(212,168,83,0.05))',
            }}
          />

          {t.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '2.5rem',
                position: 'relative',
              }}
            >
              {/* Dot column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(212,168,83,0.08)',
                    border: '1px solid rgba(212,168,83,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontSize: '1.1rem',
                    color: 'rgba(212,168,83,0.7)',
                    zIndex: 1,
                  }}
                >
                  {item.icon}
                </div>
                {i < t.items.length - 1 && (
                  <div
                    aria-hidden
                    style={{
                      width: '1px',
                      flex: 1,
                      minHeight: '60px',
                      background: 'linear-gradient(to bottom, rgba(212,168,83,0.2), rgba(212,168,83,0.03))',
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: i < t.items.length - 1 ? '3.5rem' : 0, paddingTop: '0.5rem' }}>
                <p
                  className="font-body"
                  style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#D4A853',
                    marginBottom: '0.5rem',
                  }}
                >
                  {item.time}
                </p>
                <h3
                  className="font-display font-light"
                  style={{
                    fontSize: 'clamp(1.2rem, 2.5vw, 1.4rem)',
                    color: '#E8D5B7',
                    marginBottom: '0.6rem',
                    lineHeight: 1.2,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-body"
                  style={{
                    fontSize: '0.92rem',
                    color: 'rgba(232,213,183,0.45)',
                    lineHeight: 1.7,
                    fontWeight: 300,
                    maxWidth: '52ch',
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
