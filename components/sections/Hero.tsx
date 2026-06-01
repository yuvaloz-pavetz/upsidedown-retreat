'use client'

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
      style={{ minHeight: '100svh', overflowX: 'hidden', backgroundColor: '#0B1D2A' }}
    >
      {/* Video background — decorative, no audio */}
      <video
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
        poster="/images/hero-new.jpeg"
        className="hero-bg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
        <track kind="captions" src="/videos/hero-captions.vtt" srcLang="en" label="No audio (decorative video)" default />
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

      {/* Content column — left aligned */}
      <div
        className="relative z-10 flex flex-col items-start"
        dir={locale === 'he' ? 'rtl' : 'ltr'}
        style={{
          width: '100%',
          maxWidth: '640px',
          paddingTop: 'clamp(64px, 12vh, 100px)',
          paddingBottom: 'clamp(36px, 6vh, 64px)',
          paddingLeft: 'clamp(20px, 6vw, 80px)',
          paddingRight: 'clamp(20px, 6vw, 60px)',
        }}
      >
        {/* Icon logo */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, delay: 0.3, ease }}
          style={{ marginBottom: 'clamp(6px, 1.5vh, 18px)' }}
        >
          <Image
            src="/images/UpsideDown Retreat - LOGO.png"
            alt=""
            width={400}
            height={400}
            priority
            style={{
              objectFit: 'contain',
              objectPosition: 'left center',
              filter: 'brightness(0) invert(1) opacity(0.92)',
              display: 'block',
              width: 'auto',
              maxWidth: 'clamp(160px, 38vw, 300px)',
              maxHeight: 'clamp(80px, 14vh, 180px)',
              height: 'auto',
            }}
          />
        </motion.div>

        {/* Tagline */}
        <h1
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: 'clamp(22px, 5vw, 80px)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '0.01em',
            color: '#E6D7C0',
            marginBottom: 'clamp(20px, 3.5vh, 48px)',
            maxWidth: '16ch',
          }}
        >
          {t.titleLine1} {t.titleLine2}
          <br />
          <span style={{ color: '#F7F8F6', fontWeight: 400 }}>{t.titleLine3}</span>
        </h1>

        {/* CTA */}
        <a
          href="#retreats"
          className="btn-solid-gold"
          style={{ fontSize: '0.8rem' }}
        >
          {t.cta}
        </a>
      </div>

    </section>
  )
}
