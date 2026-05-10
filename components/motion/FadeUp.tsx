'use client'

import { motion } from 'framer-motion'

interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export default function FadeUp({
  children,
  delay = 0,
  duration = 0.8,
  className,
  once = true,
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
