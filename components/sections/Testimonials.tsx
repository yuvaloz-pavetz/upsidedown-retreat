'use client'

import Image from 'next/image'
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
  void t
  const [[index], setSlide] = useState([0, 0])

  const paginate = useCallback((dir: 1 | -1) => {
    setSlide(([prev]) => {
      const next = (prev + dir + testimonials.length) % testimonials.length
      return [next, dir]
    })
  }, [])

  const current = testimonials[index]

  return (
    <section id="testimonials" className="relative py-32 md:py-48 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/testimonials-bg.jpeg"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: 'center 55%' }}
          sizes="100vw"
          quality={70}
          aria-hidden
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, #0B1C2C 0%, rgba(11,28,44,0.88) 30%, rgba(11,28,44,0.88) 70%, #0B1C2C 100%)',
          }}
        />
      </div>

      <div className="section-container">
        <div className="flex items-start gap-8 md:gap-16" dir="ltr">
          {/* Large index number */}
          <div className="hidden md:block shrink-0 w-36 pt-1 select-none">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="font-display font-light"
                style={{
                  fontSize: 'clamp(6rem, 10vw, 9rem)',
                  lineHeight: 1,
                  color: 'rgba(232,213,183,0.06)',
                  display: 'block',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Quote + navigation */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote
                  className="font-display italic"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2.6rem)',
                    lineHeight: 1.28,
                    letterSpacing: '-0.01em',
                    color: '#E8D5B7',
                    marginBottom: '1.75rem',
                  }}
                >
                  {current.quote}
                </blockquote>

                <p
                  className="eyebrow"
                  style={{ color: 'rgba(212,168,83,0.6)', fontSize: '0.62rem' }}
                >
                  — {current.name}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-5 mt-14">
              {/* Dash selectors */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide([i, i > index ? 1 : -1])}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className="py-3 group"
                  >
                    <span
                      className="block transition-all duration-500"
                      style={{
                        width: i === index ? '2.75rem' : '1.25rem',
                        height: '1px',
                        background: i === index ? '#D4A853' : 'rgba(212,168,83,0.2)',
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Count */}
              <span
                className="font-body"
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(232,213,183,0.22)',
                }}
              >
                {String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </span>

              {/* Prev / Next */}
              <div className="ml-auto flex items-center gap-1">
                <button
                  onClick={() => paginate(-1)}
                  aria-label="Previous"
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
                  style={{ border: '1px solid rgba(212,168,83,0.2)', color: 'rgba(212,168,83,0.45)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,168,83,0.6)'
                    e.currentTarget.style.color = '#D4A853'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,168,83,0.2)'
                    e.currentTarget.style.color = 'rgba(212,168,83,0.45)'
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M7 1.5L2.5 5.5L7 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => paginate(1)}
                  aria-label="Next"
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
                  style={{ border: '1px solid rgba(212,168,83,0.2)', color: 'rgba(212,168,83,0.45)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,168,83,0.6)'
                    e.currentTarget.style.color = '#D4A853'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(212,168,83,0.2)'
                    e.currentTarget.style.color = 'rgba(212,168,83,0.45)'
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
