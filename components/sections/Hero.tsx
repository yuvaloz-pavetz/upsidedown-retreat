'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, type Easing } from 'framer-motion'
import { i18n, type Locale } from '@/lib/i18n'

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

interface HeroProps {
  locale: Locale
  t?: typeof i18n['en']['hero']
}

export default function Hero({ locale, t: tProp }: HeroProps) {
  const t = tProp ?? i18n[locale].hero

  return (
    <section
      className="relative flex items-center justify-start"
      style={{ minHeight: '100svh' }}
      aria-label="UpsideDown Retreat"
    >
      {/* Video background — falls back to poster if no video file */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-new.jpeg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '70% 35%',
        }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Overlay: darker top (nav area) + bottom (depth), open center */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(11,29,42,0.82) 0%, rgba(11,29,42,0.3) 38%, rgba(11,29,42,0.3) 62%, rgba(11,29,42,0.78) 100%)',
        }}
      />

      {/* Grain texture */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          pointerEvents: 'none',
          opacity: 0.5,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Centered content column */}
      <div
        className="relative z-10 flex flex-col items-center w-3/4 sm:w-1/2"
        dir="ltr"
        style={{
          textAlign: 'center',
          paddingTop: 'clamp(72px, 12vh, 100px)',
          paddingBottom: 'clamp(48px, 8vh, 64px)',
          paddingLeft: 'clamp(16px, 4vw, 48px)',
          paddingRight: 'clamp(16px, 4vw, 48px)',
        }}
      >
        {/* Icon logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, delay: 0.3, ease }}
          style={{ marginBottom: '16px' }}
        >
          <Image
            src="/images/UpsideDown Retreat - LOGO.png"
            alt="UpsideDown Retreat"
            width={400}
            height={400}
            priority
            style={{
              objectFit: 'contain',
              filter: 'brightness(0) invert(1) opacity(0.92)',
              display: 'block',
              width: '100%',
              maxWidth: '380px',
              height: 'auto',
            }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.75, ease }}
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(18px, 2.4vw, 32px)',
            fontWeight: 300,
            lineHeight: 1.25,
            letterSpacing: '0.01em',
            color: '#E6D7C0',
            marginBottom: '40px',
            maxWidth: '28ch',
          }}
        >
          {t.titleLine1} {t.titleLine2}
          <br />
          <span style={{ color: '#F7F8F6', fontWeight: 400 }}>{t.titleLine3}</span>
        </motion.h1>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.3, ease: 'easeOut' as Easing }}
        >
          <Link
            href={`/${locale}/events`}
            className="btn-solid-gold"
            style={{ fontSize: '0.65rem' }}
          >
            {t.cta}
          </Link>
        </motion.div>
      </div>

    </section>
  )
}
