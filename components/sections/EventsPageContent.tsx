'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Locale, I18n } from '@/lib/i18n'
import type { Event } from '@/lib/events'
import { getEventPricing, getEarlyBirdPricing } from '@/lib/events'

interface EventsPageContentProps {
  locale: Locale
  events: Event[]
  t: I18n['events']
}

function StatusBadge({ status, t }: { status: Event['status']; t: I18n['events'] }) {
  const labelMap: Partial<Record<Event['status'], string>> = {
    'sold-out': t.soldOut,
    'coming-soon': t.comingSoon,
  }
  const label = labelMap[status]
  if (!label) return null

  return (
    <span
      className="eyebrow px-3 py-1 rounded-full"
      style={{
        background: status === 'sold-out' ? 'rgba(255,140,90,0.18)' : 'rgba(110,190,220,0.18)',
        border: `1px solid ${status === 'sold-out' ? 'rgba(255,140,90,0.7)' : 'rgba(110,190,220,0.7)'}`,
        color: status === 'sold-out' ? '#FF8C5A' : '#6EBEDC',
      }}
    >
      {label}
    </span>
  )
}

function EarlyBirdCornerBadge({ locale }: { locale: Locale }) {
  return (
    <div className="absolute top-6 left-6 z-20 pointer-events-none">
      <div
        className="eyebrow px-3 py-1.5 rounded-sm"
        style={{
          background: 'rgba(212,168,83,0.15)',
          border: '1px solid rgba(212,168,83,0.65)',
          color: '#E8C87A',
          backdropFilter: 'blur(8px)',
          letterSpacing: '0.1em',
          fontWeight: 700,
          fontSize: '0.6rem',
        }}
      >
        ✦ {locale === 'he' ? 'מחיר ציפור מוקדמת' : 'Early Bird'}
      </div>
    </div>
  )
}

function LastSpotsBadge({ label }: { label: string }) {
  return (
    <div
      className="absolute top-6 right-6 z-20 pointer-events-none"
      style={{ transform: 'rotate(3deg)' }}
    >
      <div
        className="eyebrow px-3 py-1.5 rounded-sm"
        style={{
          background: 'rgba(212,168,83,0.2)',
          border: '1px solid rgba(212,168,83,0.8)',
          color: '#E8C87A',
          boxShadow: '0 0 16px rgba(212,168,83,0.2)',
          backdropFilter: 'blur(8px)',
          letterSpacing: '0.12em',
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  )
}

export default function EventsPageContent({ locale, events, t }: EventsPageContentProps) {
  return (
    <div style={{ background: '#0B1D2A', minHeight: '100vh' }}>
      {/* Fixed nav gradient — keeps nav readable over any hero image */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, rgba(5,11,20,0.92) 0%, transparent 100%)',
          zIndex: 40,
          pointerEvents: 'none',
        }}
      />

      {/* Hero */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: '60vh', paddingTop: '10rem', paddingBottom: '5rem' }}
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-bg.jpeg"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: 'center 40%' }}
            sizes="100vw"
            quality={82}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(5,11,20,0.88) 0%, rgba(11,28,44,0.6) 50%, #0B1C2C 100%)',
            }}
          />
        </div>
        <div className="section-container w-full" dir={locale === 'he' ? 'rtl' : 'ltr'}>
          <motion.div
            initial={{ y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="font-display font-light italic text-display-xl"
              style={{ color: '#E8D5B7' }}
            >
              {t.pageTitle}
            </h1>
            <p
              className="font-body text-base mt-3"
              style={{ color: 'rgba(232,213,183,0.9)', fontWeight: 400, letterSpacing: '0.04em' }}
            >
              {t.pageSubtext}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Events — full-width immersive rows */}
      <section className="relative">
        {events.length === 0 ? (
          <div className="section-container py-32 text-center">
            <p className="font-display italic text-2xl" style={{ color: 'rgba(232,213,183,0.8)' }}>
              {t.noEvents}
            </p>
          </div>
        ) : (
          events.map((event, i) => {
            const { price: pricingVal } = getEventPricing(event, locale)
            const eb = getEarlyBirdPricing(event, locale)
            const isOpen = event.status === 'open' || event.status === 'last-spots'
            const flipLayout = i % 2 !== 0

            return (
              <motion.div
                key={event.slug}
                className="relative overflow-hidden flex items-end"
                style={{
                  minHeight: '78vh',
                  borderTop: i > 0 ? '1px solid rgba(232,213,183,0.05)' : undefined,
                }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
              >
                {/* Early Bird corner badge */}
                {event.earlyBirdActive && <EarlyBirdCornerBadge locale={locale} />}

                {/* Last Spots sticker */}
                {event.status === 'last-spots' && (
                  <LastSpotsBadge label={t.lastSpots} />
                )}

                {/* Full-bleed background */}
                <div className="absolute inset-0">
                  <Image
                    src={event.heroImage}
                    alt=""
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'center 35%' }}
                    sizes="100vw"
                    quality={85}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: flipLayout
                        ? 'linear-gradient(to left, rgba(11,28,44,0.95) 0%, rgba(11,28,44,0.65) 55%, rgba(11,28,44,0.2) 100%), linear-gradient(to bottom, rgba(11,28,44,0.25) 0%, transparent 35%, rgba(11,28,44,0.7) 100%)'
                        : 'linear-gradient(to right, rgba(11,28,44,0.95) 0%, rgba(11,28,44,0.65) 55%, rgba(11,28,44,0.2) 100%), linear-gradient(to bottom, rgba(11,28,44,0.25) 0%, transparent 35%, rgba(11,28,44,0.7) 100%)',
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 section-container w-full py-16 md:py-24" dir={locale === 'he' ? 'rtl' : 'ltr'}>
                  <div
                    className={`flex flex-col gap-10 lg:gap-0 lg:flex-row lg:items-end ${
                      flipLayout ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Title + details */}
                    <motion.div
                      className="flex-1"
                      initial={{ y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.95, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="mb-5">
                        <StatusBadge status={event.status} t={t} />
                      </div>
                      <h2
                        className="font-display font-light italic text-display-xl mb-6"
                        style={{ color: '#E8D5B7', maxWidth: '14ch' }}
                      >
                        {event.title[locale]}
                      </h2>
                      <div className="flex flex-wrap gap-x-8 gap-y-1.5">
                        {[event.location[locale], event.dates[locale], event.duration[locale]].map((val) => (
                          <p
                            key={val}
                            className="font-body text-sm"
                            style={{
                              color: 'rgba(232,213,183,0.85)',
                              letterSpacing: '0.04em',
                              fontWeight: 400,
                            }}
                          >
                            {val}
                          </p>
                        ))}
                      </div>
                    </motion.div>

                    {/* Price + CTA */}
                    <motion.div
                      className={`flex flex-col gap-5 shrink-0 ${flipLayout ? 'lg:mr-auto lg:items-start' : 'lg:ml-auto lg:items-end'}`}
                      initial={{ y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.95, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className={flipLayout ? 'text-left' : 'text-right lg:text-right'}>
                        {eb ? (
                          <div>
                            <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8C87A', display: 'block', marginBottom: '0.3rem', fontWeight: 700 }}>
                              ✦ {locale === 'he' ? 'מחיר ציפור מוקדמת' : 'Early Bird'}
                            </span>
                            <p className="font-display font-light" style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', color: '#D4A853', lineHeight: 1 }}>
                              {eb.earlyBird}
                            </p>
                            <p style={{ fontSize: '13px', color: 'rgba(232,213,183,0.4)', marginTop: '0.3rem', textDecoration: 'line-through' }}>
                              {eb.regular}
                            </p>
                            {event.earlyBirdSpotsRemaining != null && (
                              <p style={{ fontSize: '11px', color: 'rgba(232,213,183,0.5)', marginTop: '0.2rem', letterSpacing: '0.06em' }}>
                                {event.earlyBirdSpotsRemaining} {locale === 'he' ? 'מקומות במחיר זה' : 'spots at this price'}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p
                            className="font-display font-light"
                            style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', color: '#D4A853', lineHeight: 1 }}
                          >
                            <span style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4A853', display: 'block', marginBottom: '0.2rem', fontWeight: 600 }}>
                              {locale === 'he' ? 'החל מ' : 'Starting from'}
                            </span>
                            {pricingVal}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/${locale}/events/${event.slug}`}
                        className="btn-ghost-gold"
                        style={{ borderRadius: 0, padding: '0.75rem 2rem' }}
                      >
                        {t.learnMore}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </section>
    </div>
  )
}
