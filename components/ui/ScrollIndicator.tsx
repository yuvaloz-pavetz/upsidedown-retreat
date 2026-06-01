'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

export default function ScrollIndicator() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 120], [1, 0])

  return (
    <motion.div
      style={{ opacity }}
      className="flex flex-col items-center gap-2 cursor-default select-none"
    >
      <span className="eyebrow" style={{ letterSpacing: '0.25em' }}>
        Scroll
      </span>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-1"
      >
        <div
          className="w-px bg-gradient-to-b from-transparent via-gold to-transparent"
          style={{ height: '40px', opacity: 0.6 }}
        />
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className="opacity-60"
          style={{ color: '#D4A853' }}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
