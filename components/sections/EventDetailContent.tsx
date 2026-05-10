'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { Locale, I18n } from '@/lib/i18n'
import type { Event } from '@/lib/events'
import SpotsCounter from '@/components/ui/SpotsCounter'
import FadeUp from '@/components/motion/FadeUp'

interface EventDetailContentProps {
  locale: Locale
  event: Event
  t: I18n['events']
}

export default function EventDetailContent({ locale, event, t }: EventDetailContentProps) {
  const [activeGallery, setActiveGallery] = useState(0)
  const pricing = locale === 'he' ? event.pricingILS : event.pricingEUR
  const altPricing = locale === 'he' ? event.pricingEUR : event.pricingILS
  const isOpen = event.status === 'open'

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: '70vh' }}>
        <div className="absolute inset-0">
          <Image
            src={event.heroImage}
            alt={event.title[locale]}
            fill
            className="object-cover"
            style={{ objectPosition: 'center 40%' }}
            sizes="100vw"
            quality={85}
            preload
            fetchPriority="high"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(11,28,44,0.3) 0%, rgba(11,28,44,0.1) 30%, rgba(11,28,44,0.85) 80%, #0B1C2C 100%)',
            }}
          />
        </div>

        <div className="relative z-10 section-container pb-16 pt-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={`/${locale}/events`}
              className="eyebrow mb-8 inline-block transition-colors duration-300"
              style={{ color: 'rgba(212,168,83,0.6)', textDecoration: 'none', fontSize: '0.65rem' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#D4A853')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(212,168,83,0.6)')}
            >
              {t.backToEvents}
            </Link>
            <h1
              className="font-display font-light italic text-display-xl mt-3"
              style={{ color: '#E8D5B7' }}
            >
              {event.title[locale]}
            </h1>
            <div className="flex flex-wrap gap-6 mt-5">
              {[
                { label: t.location, value: event.location[locale] },
                { label: t.dates,    value: event.dates[locale] },
                { label: t.duration, value: event.duration[locale] },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="eyebrow" style={{ fontSize: '0.58rem', marginBottom: '0.2rem' }}>{label}</p>
                  <p className="font-body text-sm" style={{ color: 'rgba(232,213,183,0.75)' }}>{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 md:py-24">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Left: description + gallery */}
            <div className="lg:col-span-3 flex flex-col gap-14">
              <FadeUp>
                <p className="eyebrow mb-5">{t.aboutRetreat}</p>
                <div
                  className="font-body text-base leading-relaxed"
                  style={{ color: 'rgba(232,213,183,0.65)', fontWeight: 300, whiteSpace: 'pre-line' }}
                >
                  {event.description[locale]}
                </div>
              </FadeUp>

              {/* Gallery */}
              {event.galleryImages.length > 0 && (
                <FadeUp delay={0.1}>
                  <p className="eyebrow mb-5">{t.gallery}</p>

                  {/* Main image */}
                  <div
                    className="relative rounded-xl overflow-hidden mb-3"
                    style={{ aspectRatio: '16/9' }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeGallery}
                        className="absolute inset-0"
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.55, ease: 'easeOut' }}
                      >
                        <Image
                          src={event.galleryImages[activeGallery]}
                          alt={`Gallery ${activeGallery + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          quality={85}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {event.galleryImages.map((src, i) => (
                      <button
                        key={src}
                        onClick={() => setActiveGallery(i)}
                        className="flex-shrink-0 relative rounded-lg overflow-hidden transition-all duration-300"
                        style={{
                          width: '72px',
                          height: '48px',
                          border: i === activeGallery ? '2px solid #D4A853' : '2px solid transparent',
                          opacity: i === activeGallery ? 1 : 0.5,
                        }}
                      >
                        <Image
                          src={src}
                          alt={`Thumbnail ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="72px"
                          quality={60}
                        />
                      </button>
                    ))}
                  </div>
                </FadeUp>
              )}
            </div>

            {/* Right: booking card */}
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-heavy rounded-2xl p-8 flex flex-col gap-8"
                >
                  {/* Price */}
                  <div>
                    <p className="eyebrow mb-2" style={{ fontSize: '0.6rem' }}>{t.investment}</p>
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span
                        className="font-display font-light"
                        style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', lineHeight: 1, color: '#D4A853' }}
                      >
                        {pricing}
                      </span>
                      <span style={{ color: 'rgba(232,213,183,0.3)' }}>/</span>
                      <span
                        className="font-display font-light"
                        style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', lineHeight: 1, color: 'rgba(232,213,183,0.4)' }}
                      >
                        {altPricing}
                      </span>
                    </div>
                  </div>

                  {/* Spots */}
                  {isOpen && (
                    <SpotsCounter
                      remaining={event.spotsRemaining}
                      total={event.spotsTotal}
                      spotsLabel={t.spotsLeft}
                    />
                  )}

                  {/* Includes */}
                  <div>
                    <p className="eyebrow mb-4" style={{ fontSize: '0.6rem' }}>{t.includes}</p>
                    <ul className="flex flex-col gap-2.5">
                      {event.includes[locale].map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 font-body text-sm"
                          style={{ color: 'rgba(232,213,183,0.6)', fontWeight: 300 }}
                        >
                          <span
                            className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                            style={{ background: '#D4A853', opacity: 0.6 }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col gap-3">
                    {isOpen ? (
                      <motion.a
                        href={`mailto:yuvaloz@gmail.com?subject=UpsideDown Retreat — ${event.title.en}`}
                        className="btn-solid-gold text-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {t.registerNow}
                      </motion.a>
                    ) : (
                      <motion.a
                        href={`mailto:yuvaloz@gmail.com?subject=Interest — ${event.title.en}`}
                        className="btn-ghost-gold justify-center"
                        style={{ borderRadius: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {t.registerCta}
                      </motion.a>
                    )}
                    <p
                      className="font-body text-xs text-center"
                      style={{ color: 'rgba(232,213,183,0.3)', letterSpacing: '0.04em' }}
                    >
                      {t.disclaimer}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
