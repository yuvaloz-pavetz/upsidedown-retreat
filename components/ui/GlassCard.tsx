'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

type Variant = 'subtle' | 'mid' | 'heavy'

interface GlassCardProps {
  children: React.ReactNode
  variant?: Variant
  hover?: boolean
  className?: string
  onClick?: () => void
}

const variantClass: Record<Variant, string> = {
  subtle: 'glass',
  mid:    'glass-mid',
  heavy:  'glass-heavy',
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(function GlassCard(
  { children, variant = 'subtle', hover = false, className = '', onClick },
  ref
) {
  const base = `${variantClass[variant]}${hover ? ' glass-hover' : ''} ${className}`

  if (hover) {
    return (
      <motion.div
        ref={ref}
        className={base}
        whileHover={{ scale: 1.003 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div ref={ref} className={base} onClick={onClick}>
      {children}
    </div>
  )
})

export default GlassCard
