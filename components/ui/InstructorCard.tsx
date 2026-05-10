'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Instructor } from '@/lib/constants'

interface InstructorCardProps {
  instructor: Instructor
  delay?: number
}

export default function InstructorCard({ instructor, delay = 0 }: InstructorCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay, duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-7"
    >
      {/* Photo */}
      <motion.div
        className="relative overflow-hidden rounded-xl"
        style={{ aspectRatio: '3/4' }}
        whileHover="hover"
        initial="rest"
      >
        <motion.div
          className="absolute inset-0"
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.04, transition: { duration: 0.8, ease: 'easeOut' } },
          }}
        >
          <Image
            src={instructor.image}
            alt={instructor.name}
            fill
            className="object-cover"
            style={{ objectPosition: 'center top' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
          />
        </motion.div>

        {/* Bottom gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(11,28,44,0.7) 0%, transparent 50%)',
          }}
        />

        {/* Name overlay */}
        <motion.div
          className="absolute bottom-6 left-6"
          variants={{
            rest: { y: 0 },
            hover: { y: -4, transition: { duration: 0.5, ease: 'easeOut' } },
          }}
        >
          <h3
            className="font-display italic"
            style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: '#E8D5B7', lineHeight: 1 }}
          >
            {instructor.name}
          </h3>
          <p className="eyebrow mt-1" style={{ fontSize: '0.62rem' }}>
            {instructor.role}
          </p>
        </motion.div>
      </motion.div>

      {/* Bio */}
      <p
        className="font-body text-sm leading-relaxed"
        style={{ color: 'rgba(232,213,183,0.6)', fontWeight: 300, maxWidth: '38ch' }}
      >
        {instructor.bio}
      </p>
    </motion.article>
  )
}
