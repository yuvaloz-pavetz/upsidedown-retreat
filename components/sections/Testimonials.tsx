'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { testimonials } from '@/lib/constants'
import { i18n, type Locale } from '@/lib/i18n'

interface TestimonialsProps {
  locale: Locale
  t?: typeof i18n['en']['testimonials']
}

export default function Testimonials({ locale, t: tProp }: TestimonialsProps) {
  const t = tProp ?? i18n[locale].testimonials
  const [[index], setSlide] = useState([0, 0])
  const isHe = locale === 'he'

  const paginate = useCallback((dir: 1 | -1) => {
    setSlide(([prev]) => {
      const next = (prev + dir + testimonials.length) % testimonials.length
      return [next, dir]
    })
  }, [])

  const current = testimonials[index]
  const currentQuote = isHe && current.quoteHE ? current.quoteHE : current.quote

  return (
    <section
      id="testimonials"
      className="relative py-28 md:py-40 overflow-hidden"
      style={{ background: '#F7F8F6' }}
    >
      <div className="section-container" dir={locale === 'he' ? 'rtl' : 'ltr'}>
        {/* Section label */}
        <motion.p
          initial={{ y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: '13px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#6B5535',
            marginBottom: '3.5rem',
            fontWeight: 600,
          }}
        >
          {t.sectionLabel}
        </motion.p>

        <div className="flex items-start gap-8 md:gap-16">
          {/* Large quote mark — decorative */}
          <div className="hidden md:block shrink-0 w-24 pt-1 select-none" aria-hidden="true">
            <span
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(7rem, 11vw, 10rem)',
                lineHeight: 0.8,
                color: 'rgba(11,29,42,0.4)',
                display: 'block',
              }}
            >
              &ldquo;
            </span>
          </div>

          {/* Quote + navigation */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote
                  style={{
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.6rem, 3.2vw, 2.8rem)',
                    lineHeight: 1.25,
                    letterSpacing: '-0.01em',
                    color: '#0B1D2A',
                    marginBottom: '2rem',
                    fontWeight: 400,
                  }}
                >
                  {currentQuote}
                </blockquote>

                <p
                  style={{
                    fontSize: '13px',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#6B5535',
                    fontWeight: 700,
                  }}
                >
                  — {current.name}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-5 mt-12" dir="ltr">
              {/* Dash selectors */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide([i, i > index ? 1 : -1])}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className="py-3"
                    style={{ cursor: 'pointer' }}
                  >
                    <span
                      className="block transition-all duration-500"
                      style={{
                        width: i === index ? '2.75rem' : '1rem',
                        height: '2px',
                        background: i === index ? '#0B1D2A' : 'rgba(11,29,42,0.18)',
                        borderRadius: '1px',
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Count */}
              <span
                style={{
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  color: 'rgba(11,29,42,0.7)',
                  fontWeight: 500,
                  fontFamily: 'var(--font-manrope), sans-serif',
                }}
              >
                {String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </span>

              {/* Prev / Next */}
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() => paginate(isHe ? 1 : -1)}
                  aria-label="Previous"
                  className="flex items-center justify-center w-9 h-9"
                  style={{
                    border: '1px solid #0B1D2A',
                    borderRadius: '50%',
                    color: '#0B1D2A',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(11,29,42,0.5)'
                    e.currentTarget.style.color = '#0B1D2A'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#0B1D2A'
                    e.currentTarget.style.color = '#0B1D2A'
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M7 1.5L2.5 5.5L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => paginate(isHe ? -1 : 1)}
                  aria-label="Next"
                  className="flex items-center justify-center w-9 h-9"
                  style={{
                    border: '1px solid #0B1D2A',
                    borderRadius: '50%',
                    color: '#0B1D2A',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(11,29,42,0.5)'
                    e.currentTarget.style.color = '#0B1D2A'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#0B1D2A'
                    e.currentTarget.style.color = '#0B1D2A'
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M4 1.5L8.5 5.5L4 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
