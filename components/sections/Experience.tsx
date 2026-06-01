'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { i18n, type Locale } from '@/lib/i18n'

const panelVariants = {
  left: {
    hidden: { x: '-7%' },
    visible: {
      x: 0,
      transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    },
  },
  right: {
    hidden: { x: '7%' },
    visible: {
      x: 0,
      transition: { duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    },
  },
}

function Panel({
  side,
  eyebrow,
  heading,
  body,
  imageSrc,
  imageAlt,
  hoverImageSrc,
  overlay,
}: {
  side: 'left' | 'right'
  eyebrow: string
  heading: string
  body: string
  imageSrc: string
  imageAlt: string
  hoverImageSrc?: string
  overlay: string
}) {
  return (
    <motion.div
      variants={panelVariants[side]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-120px' }}
      className="flex flex-col lg:justify-center gap-10 px-6 py-20 md:px-12 lg:px-16 relative overflow-hidden"
      style={{ background: side === 'right' ? 'rgba(11,28,44,0.4)' : 'transparent' }}
    >
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          style={{ objectPosition: side === 'left' ? 'center 20%' : 'center 30%' }}
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={82}
        />
        {hoverImageSrc && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={hoverImageSrc}
              alt=""
              fill
              className="object-cover"
              style={{ transform: 'rotate(180deg)', objectPosition: 'center' }}
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={82}
            />
          </motion.div>
        )}
        <div className="absolute inset-0" style={{ background: overlay }} />
      </div>

      <div className="relative z-10 max-w-md">
        <p className="eyebrow mb-5">{eyebrow}</p>
        <h2
          className="font-display font-light italic text-display-xl mb-6"
          style={{ color: '#E8D5B7' }}
        >
          {heading}
        </h2>
        <p
          className="font-body text-base leading-relaxed"
          style={{ color: 'rgba(232,213,183,0.92)', fontWeight: 400, maxWidth: '38ch' }}
        >
          {body}
        </p>
      </div>
    </motion.div>
  )
}

interface ExperienceProps {
  locale: Locale
  t?: typeof i18n['en']['experience']
}

export default function Experience({ locale, t: tProp }: ExperienceProps) {
  const t = tProp ?? i18n[locale].experience
  const lineRef = useRef<HTMLDivElement>(null)
  const lineInView = useInView(lineRef, { once: true, margin: '-100px' })

  return (
    <section id="experience" className="relative" style={{ minHeight: '100svh', backgroundColor: '#0B1D2A' }}>

<div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: '100svh' }}>
        <Panel
          side="left"
          eyebrow={t.above.eyebrow}
          heading={t.above.heading}
          body={t.above.body}
          imageSrc="/images/above-surface.jpg"
          imageAlt=""
          hoverImageSrc="/images/above-surface-2.jpg"
          overlay="linear-gradient(135deg, rgba(11,28,44,0.82) 0%, rgba(11,28,44,0.6) 60%, rgba(11,28,44,0.45) 100%)"
        />

        <div
          ref={lineRef}
          className="hidden lg:block absolute left-1/2 -translate-x-px top-0 bottom-0 z-10 w-px"
        >
          <motion.div
            className="w-full h-full"
            initial={{ scaleY: 0 }}
            animate={lineInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: 'top',
              background:
                'linear-gradient(to bottom, transparent, rgba(74,155,184,0.6), rgba(212,168,83,0.8), rgba(74,155,184,0.6), transparent)',
            }}
          />
        </div>

        <div className="lg:hidden w-full h-px relative overflow-hidden">
          <motion.div
            className="waterline-gradient absolute inset-0"
            initial={{ scaleX: 0 }}
            animate={lineInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'left' }}
          />
        </div>

        <Panel
          side="right"
          eyebrow={t.below.eyebrow}
          heading={t.below.heading}
          body={t.below.body}
          imageSrc="/images/below-surface.jpeg"
          imageAlt=""
          overlay="linear-gradient(135deg, rgba(11,28,44,0.45) 0%, rgba(11,28,44,0.65) 50%, rgba(11,28,44,0.85) 100%)"
        />
      </div>
    </section>
  )
}
