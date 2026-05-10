'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring, motion } from 'framer-motion'

interface SpotsCounterProps {
  remaining: number
  total: number
  spotsLabel?: string
  filledLabel?: string
}

export default function SpotsCounter({
  remaining,
  total,
  spotsLabel = 'spots remaining',
  filledLabel,
}: SpotsCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const count = useMotionValue(0)
  const spring = useSpring(count, { stiffness: 60, damping: 20 })
  const displayRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isInView) count.set(remaining)
  }, [isInView, count, remaining])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (displayRef.current) displayRef.current.textContent = Math.round(v).toString()
    })
  }, [spring])

  const pct = (remaining / total) * 100
  const isUrgent = remaining <= 3

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <span
          ref={displayRef}
          className="font-display text-4xl"
          style={{ color: isUrgent ? '#B5521A' : '#D4A853', fontStyle: 'italic' }}
        >
          0
        </span>
        <span
          className="font-body text-sm"
          style={{ color: 'rgba(232,213,183,0.6)', letterSpacing: '0.05em' }}
        >
          {spotsLabel}
        </span>
      </div>

      <div className="h-px w-full" style={{ background: 'rgba(232,213,183,0.1)' }}>
        <motion.div
          className="h-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{
            background: isUrgent
              ? 'linear-gradient(90deg, #B5521A, #D4A853)'
              : 'linear-gradient(90deg, #4A9BB8, #D4A853)',
          }}
        />
      </div>

      {filledLabel && (
        <p className="font-body text-xs" style={{ color: 'rgba(232,213,183,0.45)', letterSpacing: '0.05em' }}>
          {filledLabel}
        </p>
      )}
    </div>
  )
}
