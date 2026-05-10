'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { i18n, type Locale } from '@/lib/i18n'

interface WhyDifferentProps {
  locale: Locale
  t?: typeof i18n['en']['why']
}

export default function WhyDifferent({ locale, t: tProp }: WhyDifferentProps) {
  const t = tProp ?? i18n[locale].why

  return (
    <section
      className="py-28 md:py-40 relative overflow-hidden"
      style={{ background: '#EFE9DD' }}
    >
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24" dir="ltr">

          {/* Left: header + numbered list */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12"
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

            <ul style={{ display: 'flex', flexDirection: 'column', marginTop: '48px' }}>
              {t.items.map((item, i) => (
                <motion.li
                  key={item.heading}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start',
                    padding: '28px 0',
                    borderBottom: '1px solid rgba(26,26,46,0.08)',
                    borderTop: i === 0 ? '1px solid rgba(26,26,46,0.08)' : undefined,
                    cursor: 'default',
                  }}
                  whileHover={{ x: 8 }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#C8A97A',
                      letterSpacing: '0.1em',
                      paddingTop: '4px',
                      flexShrink: 0,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                        fontSize: '19px',
                        color: '#0B1D2A',
                        marginBottom: '6px',
                        fontWeight: 400,
                      }}
                    >
                      {item.heading}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#6B7884',
                        lineHeight: 1.65,
                        fontWeight: 300,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right: sticky visual + stat grid */}
          <div style={{ position: 'sticky', top: '120px', alignSelf: 'start' }}>
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Visual box */}
              <div
                style={{
                  height: '420px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <Image
                  src="/images/retreat-session.jpg"
                  alt="Retreat experience"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>

              {/* Stat grid */}
              <div
                className="grid grid-cols-2"
                style={{ gap: '16px', marginTop: '16px' }}
              >
                {t.stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      background: '#F7F8F6',
                      padding: '24px',
                      borderRadius: '4px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                        fontSize: '36px',
                        color: '#0B1D2A',
                        lineHeight: 1,
                        marginBottom: '6px',
                        fontWeight: 500,
                      }}
                    >
                      {stat.num}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#6B7884',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
