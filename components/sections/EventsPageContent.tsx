'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Locale, I18n } from '@/lib/i18n'
import type { Event } from '@/lib/events'

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
        fontSize: '0.6rem',
        background: status === 'sold-out' ? 'rgba(181,82,26,0.2)' : 'rgba(74,155,184,0.2)',
        border: `1px solid ${status === 'sold-out' ? 'rgba(181,82,26,0.4)' : 'rgba(74,155,184,0.4)'}`,
        color: status === 'sold-out' ? '#B5521A' : '#4A9BB8',
      }}
    >
      {label}
    </span>
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
          fontSize: '0.58rem',
          background: 'rgba(212,168,83,0.18)',
          border: '1px solid rgba(212,168,83,0.55)',
          color: '#D4A853',
          boxShadow: '0 0 16px rgba(212,168,83,0.2)',
          backdropFilter: 'blur(8px)',
          letterSpacing: '0.12em',
        }}
      >
        {label}
      </div>
    </div>
  )
}

export default function EventsPageContent({ locale, events, t }: EventsPageContentProps) {
  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: '45vh', paddingTop: '8rem', paddingBottom: '4rem' }}
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
                'linear-gradient(to bottom, rgba(11,28,44,0.5) 0%, rgba(11,28,44,0.75) 60%, #0B1C2C 100%)',
            }}
          />
        </div>
        <div className="section-container w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
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
              style={{ color: 'rgba(232,213,183,0.5)', fontWeight: 300, letterSpacing: '0.04em' }}
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
            <p className="font-display italic text-2xl" style={{ color: 'rgba(232,213,183,0.4)' }}>
              {t.noEvents}
            </p>
          </div>
        ) : (
          events.map((event, i) => {
            const pricing = locale === 'he' ? event.pricingILS : event.pricingEUR
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
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 1.0, ease: 'easeOut' }}
              >
                {/* Last Spots sticker */}
                {event.status === 'last-spots' && (
                  <LastSpotsBadge label={t.lastSpots} />
                )}

                {/* Full-bleed background */}
                <div className="absolute inset-0">
                  <Image
                    src={event.heroImage}
                    alt={event.title[locale]}
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
                <div className="relative z-10 section-container w-full py-16 md:py-24">
                  <div
                    className={`flex flex-col gap-10 lg:gap-0 lg:flex-row lg:items-end ${
                      flipLayout ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Title + details */}
                    <motion.div
                      className="flex-1"
                      initial={{ opacity: 0, y: 28 }}
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
                              color: 'rgba(232,213,183,0.52)',
                              letterSpacing: '0.04em',
                              fontWeight: 300,
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
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.95, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className={flipLayout ? 'text-left' : 'text-right lg:text-right'}>
                        <p
                          className="font-display font-light"
                          style={{
                            fontSize: 'clamp(2.4rem, 4vw, 3.5rem)',
                            color: '#D4A853',
                            lineHeight: 1,
                          }}
                        >
                          {pricing}
                        </p>
                        {isOpen && (
                          <p
                            className="font-body text-xs mt-1.5"
                            style={{ color: 'rgba(212,168,83,0.5)', letterSpacing: '0.08em' }}
                          >
                            {event.spotsRemaining} {t.spotsLeft}
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
    </>
  )
}
