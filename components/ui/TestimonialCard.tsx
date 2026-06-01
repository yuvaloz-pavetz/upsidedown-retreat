'use client'

import { motion } from 'framer-motion'
import type { Testimonial } from '@/lib/constants'

interface TestimonialCardProps {
  testimonial: Testimonial
  direction: number
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 280 : -280,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 280 : -280,
    scale: 0.96,
    transition: { duration: 0.4 },
  }),
}

export default function TestimonialCard({ testimonial, direction }: TestimonialCardProps) {
  return (
    <motion.div
      key={testimonial.name}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col items-center text-center px-4 py-8 md:px-12 md:py-16"
      style={{ maxWidth: '56rem', margin: '0 auto', width: '100%' }}
    >
      <div
        className="font-display text-4xl mb-8"
        style={{ color: 'rgba(212,168,83,0.5)', lineHeight: 1, fontStyle: 'normal', fontSize: '5rem' }}
        aria-hidden
      >
        &ldquo;
      </div>

      <p
        className="font-display italic"
        style={{
          fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)',
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          color: '#E8D5B7',
          marginBottom: '2.5rem',
        }}
      >
        {testimonial.quote}
      </p>

      <div className="waterline-gradient w-16 mb-6" style={{ opacity: 0.5 }} />

      <p className="eyebrow" style={{ color: 'rgba(212,168,83,0.7)' }}>
        — {testimonial.name}
      </p>
    </motion.div>
  )
}
