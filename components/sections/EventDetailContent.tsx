'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { Locale, I18n } from '@/lib/i18n'
import { i18n } from '@/lib/i18n'
import type { Event, PricingTier } from '@/lib/events'
import { formatTierPrice } from '@/lib/events'
import WaitlistForm from '@/components/ui/WaitlistForm'
import NewsletterInline from '@/components/ui/NewsletterInline'
import RegisterForm from '@/components/ui/RegisterForm'
import SoldOutPopup from '@/components/ui/SoldOutPopup'

interface EventDetailContentProps {
  locale: Locale
  event: Event
  t: I18n['events']
}

const ease = [0.16, 1, 0.3, 1] as const

function tierPrice(tier: PricingTier, isHe: boolean): string {
  const useIls = isHe && !!tier.price_ils
  return formatTierPrice(useIls ? tier.price_ils : tier.price_eur, useIls)
}

function extractShortcode(url: string): { type: string; code: string } | null {
  const m = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/)
  return m ? { type: m[1], code: m[2] } : null
}

function VenueCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0)
  const [dir, setDir] = useState(1)

  function go(next: number) {
    setDir(next > current ? 1 : -1)
    setCurrent(next)
  }

  if (images.length === 0) return null

  return (
    <div style={{ marginTop: '3rem' }}>
      <div style={{ position: 'relative', height: '58vh', overflow: 'hidden', borderRadius: '2px' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%' }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d > 0 ? '-40%' : '40%', opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Image src={images[current]} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 70vw" quality={85} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(11,29,42,0.45) 100%)' }} />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              onClick={() => go((current - 1 + images.length) % images.length)}
              aria-label="Previous"
              style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(11,29,42,0.55)', border: '1px solid rgba(232,213,183,0.15)', borderRadius: '50%', width: 44, height: 44, color: '#E8D5B7', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, fontSize: '1.1rem', transition: 'background 0.2s' }}
            >&#8592;</button>
            <button
              onClick={() => go((current + 1) % images.length)}
              aria-label="Next"
              style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(11,29,42,0.55)', border: '1px solid rgba(232,213,183,0.15)', borderRadius: '50%', width: 44, height: 44, color: '#E8D5B7', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, fontSize: '1.1rem', transition: 'background 0.2s' }}
            >&#8594;</button>
            <p style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', fontSize: '13px', color: 'rgba(232,213,183,0.85)', letterSpacing: '0.1em', zIndex: 10, fontWeight: 500 }}>
              {current + 1} / {images.length}
            </p>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.85rem' }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to image ${i + 1}`}
              style={{ width: i === current ? 22 : 6, height: 6, borderRadius: 3, background: i === current ? '#D4A853' : 'rgba(232,213,183,0.18)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function BookingDetails({
  event, locale, t, activeTier, pricingFallback, isSoldOut, onApply,
}: { event: Event; locale: Locale; t: I18n['events']; activeTier: PricingTier | null; pricingFallback: string; isSoldOut: boolean; onApply: () => void }) {
  const isHe = locale === 'he'
  const pricing = activeTier ? tierPrice(activeTier, isHe) : pricingFallback
  const showEB = !!(event.earlyBirdActive && event.earlyBirdEnabled)
  const isILS = pricing.startsWith('₪')
  const ebDiscount = isILS
    ? Number(event.earlyBirdDiscountILS ?? 0)
    : Number(event.earlyBirdDiscountEUR ?? 0)
  const regularNum = parseFloat(pricing.replace(/[^0-9.]/g, ''))
  const sym = isILS ? '₪' : '€'
  const eb = (showEB && ebDiscount > 0 && !isNaN(regularNum)) ? {
    regular: pricing,
    earlyBird: `${sym}${Math.round(regularNum - ebDiscount).toLocaleString()}`,
    saving: `${sym}${ebDiscount.toLocaleString()}`,
  } : null
  return (
    <>
      <p className="eyebrow" style={{ fontSize: '12px', marginBottom: '0.6rem' }}>{t.investment}</p>
      {eb ? (
        <div style={{ marginBottom: '1.5rem', background: 'rgba(212,168,83,0.07)', border: '1px solid rgba(212,168,83,0.25)', borderRadius: '6px', padding: '0.9rem 1.1rem' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8C87A', fontWeight: 700, marginBottom: '0.4rem' }}>
            ✦ {isHe ? 'מחיר ציפור מוקדמת' : 'Early Bird Price'}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.7rem', flexWrap: 'wrap' }}>
            <span className="font-display font-light" style={{ fontSize: 'clamp(1.8rem, 2.5vw, 2.6rem)', color: '#D4A853', lineHeight: 1 }}>{eb.earlyBird}</span>
            <span style={{ fontSize: '1rem', color: 'rgba(232,213,183,0.35)', textDecoration: 'line-through' }}>{eb.regular}</span>
            <span style={{ fontSize: '12px', color: 'rgba(90,200,120,0.8)', fontWeight: 600 }}>
              {isHe ? `חיסכון ${eb.saving}` : `Save ${eb.saving}`}
            </span>
          </div>
          {event.earlyBirdSpotsRemaining != null && (
            <p style={{ fontSize: '12px', color: 'rgba(232,213,183,0.5)', marginTop: '0.4rem', letterSpacing: '0.04em' }}>
              {event.earlyBirdSpotsRemaining} {isHe ? 'מקומות נותרו במחיר זה' : 'spots remaining at this price'}
            </p>
          )}
          {event.earlyBirdDeadline && (
            <p style={{ fontSize: '11px', color: 'rgba(232,213,183,0.35)', marginTop: '0.2rem' }}>
              {isHe ? `עד ${event.earlyBirdDeadline}` : `Until ${event.earlyBirdDeadline}`}
            </p>
          )}
        </div>
      ) : (
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="font-display font-light" style={{ fontSize: 'clamp(1.8rem, 2.5vw, 2.6rem)', color: '#D4A853', lineHeight: 1 }}>{pricing}</span>
        </div>
      )}

      <div style={{ borderTop: '1px solid rgba(232,213,183,0.07)', paddingTop: '1.25rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {[
          { label: t.location, val: event.location[locale] },
          { label: t.dates,    val: event.dates[locale] },
          { label: t.duration, val: event.duration[locale] },
        ].map(({ label, val }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <p style={{ fontSize: '12px', color: 'rgba(232,213,183,0.78)', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0, fontWeight: 600 }}>{label}</p>
            <p style={{ fontSize: '14px', color: 'rgba(232,213,183,0.92)', textAlign: 'right', fontWeight: 400 }}>{val}</p>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(232,213,183,0.07)', paddingTop: '1.25rem', marginBottom: '1.75rem' }}>
        <p className="eyebrow" style={{ fontSize: '12px', marginBottom: '0.75rem' }}>{t.includes}</p>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {event.includes[locale].map(item => (
            <li key={item} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <span style={{ marginTop: '0.45rem', width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(212,168,83,0.5)', flexShrink: 0, display: 'inline-block' }} />
              <p className="font-body" style={{ fontSize: '14px', color: 'rgba(232,213,183,0.85)', fontWeight: 400, lineHeight: 1.5 }}>{item}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {isSoldOut ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <WaitlistForm retreatSlug={event.slug} locale={locale} />
            <div style={{ borderTop: '1px solid rgba(232,213,183,0.1)', paddingTop: '1.5rem' }}>
              <NewsletterInline locale={locale} heading={isHe ? 'או היו הראשונים לדעת על הריטריטים הבאים' : 'Or be first to know about our next retreats'} />
            </div>
          </div>
        ) : (
          <>
            <motion.button
              onClick={onApply}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="btn-solid-gold"
              style={{ justifyContent: 'center', width: '100%', borderRadius: '4px', padding: '0.85rem 1.5rem', fontSize: '13px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              {isHe ? 'למידע ורישום' : 'Apply Now'}
            </motion.button>
            <p className="font-body" style={{ fontSize: '12px', color: 'rgba(232,213,183,0.7)', textAlign: 'center', letterSpacing: '0.03em', marginTop: '0.65rem' }}>{t.disclaimer}</p>
          </>
        )}
      </div>
    </>
  )
}

function BookingCard({
  event, locale, t, pricing, activeTier, onSelectTier, onApply,
}: { event: Event; locale: Locale; t: I18n['events']; pricing: string; activeTier: PricingTier | null; onSelectTier: (tier: PricingTier) => void; onApply: () => void }) {
  const isHe = locale === 'he'
  const isSoldOut = event.status === 'sold-out'
  const tiers = event.tiers ?? []
  const hasTierChoice = tiers.length > 1
  const showSplit = hasTierChoice && !!activeTier?.photo

  if (showSplit && activeTier) {
    return (
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,213,183,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
        <div className="flex flex-col md:flex-row">
          {/* Photo panel — left on desktop, top on mobile */}
          <div className="relative md:w-1/2" style={{ minHeight: '320px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTier.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Image src={activeTier.photo} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 320px" quality={85} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, rgba(11,29,42,0.9) 100%)' }} />
                <div style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem' }} dir={isHe ? 'rtl' : 'ltr'}>
                  <p style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(232,213,183,0.78)', marginBottom: '0.15rem', fontWeight: 600 }}>
                    {isHe ? 'נבחר' : 'Selected'}
                  </p>
                  <p style={{ fontSize: '1rem', color: '#E8D5B7', fontWeight: 400 }}>
                    {isHe ? activeTier.name_he : activeTier.name_en}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Details panel — right on desktop */}
          <div className="flex-1 border-t md:border-t-0 md:border-l border-white/5" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} dir={isHe ? 'rtl' : 'ltr'}>
            {/* Tier picker */}
            <div>
              <p className="eyebrow" style={{ fontSize: '12px', marginBottom: '0.5rem' }}>{isHe ? 'בחרו חדר' : 'Choose your room'}</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {tiers.map((tier, i) => {
                  const isActive = tier === activeTier
                  const name = isHe ? tier.name_he : tier.name_en
                  const price = tierPrice(tier, isHe)
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onSelectTier(tier)}
                      style={{
                        background: isActive ? 'rgba(212,168,83,0.1)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isActive ? 'rgba(212,168,83,0.45)' : 'rgba(232,213,183,0.1)'}`,
                        borderRadius: 4, padding: '0.45rem 0.75rem',
                        cursor: 'pointer', transition: 'all 0.18s',
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.05rem',
                      }}
                    >
                      <p style={{ fontSize: '13px', color: isActive ? '#E8D5B7' : 'rgba(232,213,183,0.85)', fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>{name}</p>
                      <p style={{ fontSize: '13px', color: '#D4A853', whiteSpace: 'nowrap', fontWeight: 600 }}>{price}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Booking details */}
            <BookingDetails event={event} locale={locale} t={t} activeTier={activeTier} pricingFallback={pricing} isSoldOut={isSoldOut} onApply={onApply} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(232,213,183,0.1)', borderRadius: '6px', padding: '2rem' }}>
      {hasTierChoice && activeTier && event.tiers && (
        <div style={{ marginBottom: '1.25rem' }}>
          <p className="eyebrow" style={{ fontSize: '12px', marginBottom: '0.6rem' }}>{isHe ? 'בחרו חדר' : 'Choose your room'}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {tiers.map((tier, i) => {
              const isActive = tier === activeTier
              const price = tierPrice(tier, isHe)
              const name = isHe ? tier.name_he : tier.name_en
              const desc = isHe ? tier.description_he : tier.description_en
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectTier(tier)}
                  style={{
                    background: isActive ? 'rgba(212,168,83,0.07)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isActive ? 'rgba(212,168,83,0.35)' : 'rgba(232,213,183,0.07)'}`,
                    borderRadius: 4, padding: '0.75rem 0.9rem',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s',
                    display: 'flex', gap: '0.75rem', alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <p style={{ fontSize: '0.95rem', color: isActive ? '#E8D5B7' : 'rgba(232,213,183,0.9)', fontWeight: isActive ? 600 : 500 }}>{name}</p>
                      <p style={{ fontSize: '0.95rem', color: '#D4A853', fontWeight: 600, whiteSpace: 'nowrap' }}>{price}</p>
                    </div>
                    {desc && <p className="font-body" style={{ fontSize: '13px', color: 'rgba(232,213,183,0.78)', marginTop: '0.15rem', lineHeight: 1.5 }}>{desc}</p>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
      <BookingDetails event={event} locale={locale} t={t} activeTier={activeTier} pricingFallback={pricing} isSoldOut={isSoldOut} onApply={onApply} />
    </div>
  )
}

export default function EventDetailContent({ locale, event, t }: EventDetailContentProps) {
  const [activeGallery, setActiveGallery] = useState(0)
  const [activeTierIdx, setActiveTierIdx] = useState(0)
  const activeTier = event.tiers?.[activeTierIdx] ?? null
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!showModal) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowModal(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [showModal])
  const hasTiers = (event.tiers?.length ?? 0) >= 1
  const pricing = hasTiers && activeTier
    ? tierPrice(activeTier, locale === 'he')
    : ((locale === 'he' && event.pricingILS) ? event.pricingILS : event.pricingEUR)
  const isOpen = event.status === 'open' || event.status === 'last-spots'
  const isSoldOut = event.status === 'sold-out'
  const inst = i18n[locale].instructors
  const timeline = i18n[locale].timeline
  const isHe = locale === 'he'
  const venueDesc = isHe ? (event.venueDescriptionHe || event.venueDescriptionEn) : event.venueDescriptionEn
  const whoFor   = isHe ? (event.whoForHe || event.whoForEn) : event.whoForEn

  const statusLabel =
    event.status === 'open'        ? (isHe ? 'פתוח להרשמה' : 'Open for Registration') :
    event.status === 'last-spots'  ? (isHe ? 'מקומות אחרונים' : 'Last Spots') :
    event.status === 'sold-out'    ? (isHe ? 'מלא' : 'Sold Out') :
    event.status === 'coming-soon' ? (isHe ? 'בקרוב' : 'Coming Soon') : ''

  return (
    <div style={{ background: '#0B1D2A', minHeight: '100vh' }}>
      {/* Fixed nav gradient */}
      <div aria-hidden style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '140px', background: 'linear-gradient(to bottom, rgba(5,11,20,0.92) 0%, transparent 100%)', zIndex: 40, pointerEvents: 'none' }} />

      {/* Hero */}
      <section style={{ minHeight: '88vh', display: 'flex', alignItems: 'flex-end', position: 'relative', overflow: 'hidden' }}>
        <div className="absolute inset-0">
          <Image src={event.heroImage} alt="" fill className="object-cover" style={{ objectPosition: 'center 58%' }} sizes="100vw" quality={88} fetchPriority="high" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,11,20,0.85) 0%, rgba(11,28,44,0.2) 40%, rgba(11,28,44,0.9) 80%, #0B1D2A 100%)' }} />
        </div>
        <div className="relative z-10 section-container w-full" style={{ paddingBottom: '5rem', paddingTop: '9rem' }} dir={isHe ? 'rtl' : 'ltr'}>
          <motion.div initial={{ y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease }}>
            <Link href={`/${locale}/events`} className="eyebrow" style={{ color: '#D4A853', textDecoration: 'underline', textUnderlineOffset: '4px', display: 'inline-block', marginBottom: '2rem', transition: 'color 0.25s' }} onMouseEnter={e => (e.currentTarget.style.color = '#E8C87A')} onMouseLeave={e => (e.currentTarget.style.color = '#D4A853')}>
              {t.backToEvents}
            </Link>
            <h1 className="font-display font-light italic" style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', lineHeight: 1.02, color: '#E8D5B7', marginBottom: '2rem', letterSpacing: '-0.01em' }}>
              {event.title[locale]}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }} dir={isHe ? 'rtl' : 'ltr'}>
              {[
                { label: t.location, value: event.location[locale] },
                { label: t.dates,    value: event.dates[locale] },
                { label: t.duration, value: event.duration[locale] },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="eyebrow" style={{ fontSize: '12px', marginBottom: '0.3rem' }}>{label}</p>
                  <p className="font-body" style={{ fontSize: '0.95rem', color: 'rgba(232,213,183,0.82)', fontWeight: 400 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Hero CTA */}
            {isOpen && (
              <div style={{ marginTop: '2.5rem' }}>
                <motion.button
                  onClick={() => setShowModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-solid-gold"
                  style={{ padding: '0.9rem 2.5rem', fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '4px' }}
                >
                  {isHe ? 'למידע ורישום' : 'Apply Now'}
                </motion.button>
                <p style={{ fontSize: '12px', color: 'rgba(232,213,183,0.55)', marginTop: '0.65rem', letterSpacing: '0.04em' }}>
                  {t.disclaimer}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main content + sticky sidebar */}
      <div className="section-container" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', alignItems: 'start' }} className="lg:grid-cols-[1fr_340px]">

          {/* Left: content sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }} dir={isHe ? 'rtl' : 'ltr'}>

            {/* About */}
            <FadeSection>
              <h2 className="font-display font-light italic" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#E8D5B7', marginBottom: '1.5rem', lineHeight: 1.1 }}>{t.aboutRetreat}</h2>
              <div className="font-body" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', lineHeight: 1.85, color: 'rgba(232,213,183,0.82)', fontWeight: 400, maxWidth: '65ch', whiteSpace: 'pre-line' }}>
                {event.description[locale]}
              </div>
            </FadeSection>

            {/* Daily schedule */}
            <FadeSection>
              <h2 className="font-display font-light italic" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#E8D5B7', marginBottom: '1.5rem', lineHeight: 1.1 }}>{t.scheduleSection}</h2>
              <div>
                {timeline.items.map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '1.5rem', padding: '1.25rem 0', borderBottom: '1px solid rgba(232,213,183,0.06)' }}>
                    <div style={{ paddingTop: '0.1rem' }}>
                      <p style={{ fontSize: '13px', color: '#D4A853', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 700 }}>{item.time}</p>
                      <span style={{ fontSize: '1.1rem', color: 'rgba(232,213,183,0.12)' }}>{item.icon}</span>
                    </div>
                    <div>
                      <p style={{ fontSize: '1rem', color: '#E8D5B7', marginBottom: '0.3rem' }}>{item.title}</p>
                      <p className="font-body" style={{ fontSize: '0.95rem', color: 'rgba(232,213,183,0.85)', fontWeight: 400, lineHeight: 1.65 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeSection>

            {/* Who is it for */}
            <FadeSection>
              <h2 className="font-display font-light italic" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#E8D5B7', marginBottom: '1.5rem', lineHeight: 1.1 }}>{t.whoForSection}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }} className="md:grid-cols-2">
                <div>
                  <p className="font-body" style={{ fontSize: '1.1rem', color: 'rgba(232,213,183,0.78)', lineHeight: 1.85, fontWeight: 400, maxWidth: '52ch', whiteSpace: 'pre-line' }}>
                    {whoFor || (isHe
                      ? 'לאנשים סקרנים ומסוגלים. לא צריך להיות מתקדמים, צריך להיות מוכנים לנסות.\n\nמגיעים מכל רמה, מפאנים מוחלטים ועד מתאמנים מנוסים. מה שמשותף לכל המשתתפים: סקרנות אמיתית ומוכנות להתמסר לתהליך.'
                      : "For the curious and capable. You don't need to be advanced, you need to be ready to try.\n\nPeople come from all levels, from complete beginners to experienced movers. What everyone shares: genuine curiosity and willingness to go deep.")}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    {
                      label: isHe ? 'עמידות ידיים' : 'Handstands',
                      text: isHe
                        ? "עמידה על ידיים מול קיר לפחות 20 שניות. זה הבסיס שממנו בונים. אם אתם מתקדמים יותר, נמשיך אתכם הלאה."
                        : "Wall handstand for 20 seconds minimum. That's the baseline we build from. More advanced practitioners get taken further.",
                    },
                    {
                      label: isHe ? 'צלילה חופשית' : 'Freediving',
                      text: isHe
                        ? 'לא נדרש נסיון קודם. מתחילים משיעורי תאוריה ביבש, מתרגלים נשימה נכונה ותנועה יעילה, ומשם ממשיכים לתרגול בים בקבוצות קטנות עם צוות המדריכים שלנו. בזמן הצלילה מתחלקים לקבוצות של לא יותר מ-3 צוללים למדריך.'
                        : 'Zero experience required. We start from breath and pool work, build to open water. Everyone gets individual guidance.',
                    },
                    {
                      label: isHe ? 'כושר גופני' : 'Fitness',
                      text: isHe
                        ? 'בריא ופעיל. לא נדרשת רמת כושר ספציפית, הריטריט מדורג לפי הרמה האישית שלכם.'
                        : 'Generally healthy and active. No specific fitness level. The retreat is progressive — each person works from where they are.',
                    },
                  ].map(req => (
                    <div key={req.label}>
                      <p style={{ fontSize: '13px', color: '#D4A853', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 700 }}>{req.label}</p>
                      <p className="font-body" style={{ fontSize: '1rem', color: 'rgba(232,213,183,0.92)', fontWeight: 400, lineHeight: 1.65 }}>{req.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeSection>

            {/* Instructors */}
            <FadeSection>
              <h2 className="font-display font-light italic" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#E8D5B7', marginBottom: '1.5rem', lineHeight: 1.1 }}>{t.instructorsSection}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
                {[
                  {
                    name: inst.yuval.name, role: inst.yuval.role, bio: inst.yuval.bio, tags: inst.yuval.tags, photo: '/images/yuval-portrait.jpg',
                    quote: isHe ? 'המטרה היא לא רק להשתפר, אלא להתאהב בתרגול.' : 'The goal is not just to improve, but to fall in love with the practice.',
                  },
                  {
                    name: inst.gil.name, role: inst.gil.role, bio: inst.gil.bio, tags: inst.gil.tags, photo: '/images/gil-portrait.jpeg',
                    quote: isHe ? 'צלילה חופשית היא לא רק עומק. זה כמה רכות אנחנו פוגשים את עצמנו.' : 'Freediving isn\'t just about depth. It\'s about how softly we meet ourselves.',
                  },
                ].map(({ name, role, bio, tags, photo, quote }) => (
                  <div key={name} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '2.5rem', alignItems: 'start' }}>
                    <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '2px', flexShrink: 0, direction: 'ltr' }}>
                      <Image src={photo} alt="" fill className="object-cover" sizes="160px" quality={85} />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#D4A853', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>
                        {role.split('·')[0]?.trim()}
                      </p>
                      <h3 className="font-display font-light italic" style={{ fontSize: '1.8rem', color: '#E8D5B7', marginBottom: '0.75rem' }}>{name}</h3>
                      <p className="font-body" style={{ fontSize: '1rem', color: 'rgba(232,213,183,0.65)', fontWeight: 400, lineHeight: 1.8, marginBottom: '1rem' }}>{bio}</p>
                      <blockquote style={{ borderLeft: '2px solid rgba(212,168,83,0.35)', paddingLeft: '1rem', margin: '0 0 1rem', fontStyle: 'italic', color: 'rgba(232,213,183,0.5)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                        {quote}
                      </blockquote>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {tags.map(tag => (
                          <span key={tag} style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'rgba(232,213,183,0.85)', border: '1px solid rgba(232,213,183,0.3)', padding: '4px 11px', borderRadius: '20px', textTransform: 'uppercase', fontWeight: 500 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeSection>

            {/* Cancellation policy */}
            <FadeSection>
              <h2 className="font-display font-light italic" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#E8D5B7', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                {isHe ? 'מדיניות ביטול' : 'Cancellation Policy'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(isHe ? [
                  { period: 'יותר מ-6 שבועות לפני', policy: 'החזר מלא בניכוי דמי טיפול של €50' },
                  { period: '3–6 שבועות לפני', policy: 'החזר של 50%' },
                  { period: 'פחות מ-3 שבועות', policy: 'אין החזר' },
                  { period: 'העברת מקום לחבר', policy: 'ללא עלות, בכל שלב' },
                ] : [
                  { period: 'More than 6 weeks before', policy: 'Full refund minus €50 admin fee' },
                  { period: '3–6 weeks before', policy: '50% refund' },
                  { period: 'Less than 3 weeks', policy: 'No refund' },
                  { period: 'Transfer spot to a friend', policy: 'Free of charge, at any stage' },
                ]).map(({ period, policy }) => (
                  <div key={period} style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(232,213,183,0.06)' }}>
                    <p style={{ fontSize: '14px', color: 'rgba(232,213,183,0.55)', letterSpacing: '0.03em', flexShrink: 0 }}>{period}</p>
                    <p className="font-body" style={{ fontSize: '14px', color: 'rgba(232,213,183,0.85)', textAlign: isHe ? 'left' : 'right', fontWeight: 400 }}>{policy}</p>
                  </div>
                ))}
              </div>
              <p className="font-body" style={{ fontSize: '13px', color: 'rgba(232,213,183,0.35)', marginTop: '1rem', lineHeight: 1.6 }}>
                {isHe
                  ? 'טיסות, ביטוח נסיעות והעברות שדה תעופה אינם כלולים במחיר. העברות ניתנות לתיאום על בסיס בקשה.'
                  : 'Flights, travel insurance, and airport transfers are not included. Transfers can be arranged on request.'}
              </p>
            </FadeSection>
          </div>

          {/* Right: sticky booking card (desktop only) */}
          <div className="hidden lg:block" dir={isHe ? 'rtl' : 'ltr'}>
            <motion.div style={{ position: 'sticky', top: '7rem' }} initial={{ y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.9, ease }}>
              <BookingCard event={event} locale={locale} t={t} pricing={pricing} activeTier={activeTier} onSelectTier={(tier) => setActiveTierIdx(event.tiers?.indexOf(tier) ?? 0)} onApply={() => setShowModal(true)} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Venue section */}
      {(venueDesc || (event.venueImages && event.venueImages.length > 0)) && (
        <FadeSection>
          <section>
            {event.venueImages && event.venueImages.length > 0 && (
              <div style={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
                <Image src={event.venueImages[0]} alt="" fill className="object-cover" sizes="100vw" quality={85} style={{ objectPosition: 'center 40%' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(11,28,44,0.25) 0%, rgba(11,28,44,0) 30%, rgba(11,29,42,0.85) 90%, #0B1D2A 100%)' }} />
                <div className="section-container" style={{ position: 'absolute', bottom: '3rem', left: 0, right: 0 }}>
                  <h2 className="font-display font-light italic" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#E8D5B7', lineHeight: 1.05 }}>{event.location[locale]}</h2>
                </div>
              </div>
            )}
            {venueDesc && (
              <div className="section-container" style={{ paddingTop: '4rem', paddingBottom: event.venueImages && event.venueImages.length > 1 ? '2rem' : '4rem' }} dir={isHe ? 'rtl' : 'ltr'}>
                <h2 className="font-display font-light italic" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#E8D5B7', marginBottom: '1.5rem', lineHeight: 1.1 }}>{t.venueSection}</h2>
                <p className="font-body" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: 'rgba(232,213,183,0.75)', lineHeight: 1.9, maxWidth: '65ch', fontWeight: 400, whiteSpace: 'pre-line' }}>{venueDesc}</p>
                {event.venueImages && event.venueImages.length > 1 && (
                  <VenueCarousel images={event.venueImages.slice(1)} alt={event.location[locale]} />
                )}
              </div>
            )}
          </section>
        </FadeSection>
      )}

      {/* Instagram */}
      {(() => {
        const igUrls = (isHe ? event.instagramUrlsHe : event.instagramUrlsEn)?.length
          ? (isHe ? event.instagramUrlsHe! : event.instagramUrlsEn!)
          : (event.instagramUrls ?? [])
        if (!igUrls.length) return null
        return (
          <section>
            <div className="section-container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
              <FadeSection>
                <h2 className="font-display font-light italic" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#E8D5B7', marginBottom: '2rem', lineHeight: 1.1 }} dir={isHe ? 'rtl' : 'ltr'}>
                  {isHe ? 'ראו באינסטגרם' : 'Seen on Instagram'}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }} dir="ltr">
                  {igUrls.map(url => {
                    const sc = extractShortcode(url)
                    if (!sc) return null
                    return (
                      <iframe
                        key={url}
                        src={`https://www.instagram.com/${sc.type}/${sc.code}/embed/`}
                        style={{ width: '100%', height: '560px', border: 'none', borderRadius: '4px', display: 'block' }}
                        scrolling="no"
                        title="Instagram"
                      />
                    )
                  })}
                </div>
              </FadeSection>
            </div>
          </section>
        )
      })()}

      {/* Gallery */}
      {event.galleryImages.length > 0 && (
        <section>
          <div className="section-container" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
            <h2 className="font-display font-light italic" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#E8D5B7', marginBottom: '2rem', lineHeight: 1.1 }}>{t.gallery}</h2>
            <div style={{ position: 'relative', aspectRatio: '16/9', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.4rem' }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeGallery} className="absolute inset-0" initial={{ scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                  <Image src={event.galleryImages[activeGallery]} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 70vw" quality={85} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem' }} dir="ltr">
              {event.galleryImages.map((src, i) => (
                <button key={src} onClick={() => setActiveGallery(i)} style={{ flexShrink: 0, position: 'relative', width: '80px', height: '54px', borderRadius: '2px', overflow: 'hidden', cursor: 'pointer', border: i === activeGallery ? '2px solid #D4A853' : '2px solid transparent', opacity: i === activeGallery ? 1 : 0.4, transition: 'all 0.2s' }}>
                  <Image src={src} alt="" fill className="object-cover" sizes="80px" quality={60} />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mobile booking card */}
      <div className="lg:hidden section-container" style={{ paddingBottom: '3rem' }} dir={isHe ? 'rtl' : 'ltr'}>
        <BookingCard event={event} locale={locale} t={t} pricing={pricing} activeTier={activeTier} onSelectTier={(tier) => setActiveTierIdx(event.tiers?.indexOf(tier) ?? 0)} onApply={() => setShowModal(true)} />
      </div>

      {/* Registration modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(5,11,20,0.82)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
          >
            <motion.div
              initial={{ y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#0d1e2d', border: '1px solid rgba(232,213,183,0.1)', borderRadius: '8px', padding: '2.5rem', maxWidth: '460px', width: '100%', position: 'relative' }}
            >
              <button
                onClick={() => setShowModal(false)}
                aria-label="Close"
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'rgba(232,213,183,0.85)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: '0.25rem 0.5rem', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,213,183,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,213,183,0.35)')}
              >×</button>
              <RegisterForm
                eventSlug={event.slug}
                locale={locale}
                defaultAmount={pricing}
                tiers={event.tiers}
                defaultTierId={activeTier?.id}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sold-out popup */}
      {isSoldOut && <SoldOutPopup retreat={event} locale={locale} />}

      {/* Bottom CTA */}
      <section style={{ background: '#060e17', borderTop: '1px solid rgba(232,213,183,0.05)' }}>
        <div className="section-container" style={{ paddingTop: '6rem', paddingBottom: '6rem', textAlign: 'center' }}>
          <motion.div initial={{ y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.9, ease }}>
            <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>{statusLabel}</p>
            <h2 className="font-display font-light italic" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', color: '#E8D5B7', lineHeight: 1.05, marginBottom: '1rem' }}>{event.title[locale]}</h2>
            <p className="font-body" style={{ fontSize: '1rem', color: 'rgba(232,213,183,0.85)', marginBottom: '2.5rem', fontWeight: 400, letterSpacing: '0.04em' }}>
              {event.dates[locale]} · {event.location[locale]}
            </p>
            <div style={{ marginBottom: '2.5rem' }}>
              {(() => {
                const showEB = !!(event.earlyBirdActive && event.earlyBirdEnabled)
                const isILS = pricing.startsWith('₪')
                const ebDiscount = isILS ? Number(event.earlyBirdDiscountILS ?? 0) : Number(event.earlyBirdDiscountEUR ?? 0)
                const regularNum = parseFloat(pricing.replace(/[^0-9.]/g, ''))
                const sym = isILS ? '₪' : '€'
                const eb = (showEB && ebDiscount > 0 && !isNaN(regularNum)) ? {
                  earlyBird: `${sym}${Math.round(regularNum - ebDiscount).toLocaleString()}`,
                  saving: `${sym}${ebDiscount.toLocaleString()}`,
                } : null
                if (eb) {
                  return (
                    <div style={{ background: 'rgba(212,168,83,0.07)', border: '1px solid rgba(212,168,83,0.25)', borderRadius: '6px', padding: '1.1rem 1.4rem', display: 'inline-block', minWidth: '220px' }}>
                      <p style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8C87A', fontWeight: 700, marginBottom: '0.5rem' }}>
                        ✦ {isHe ? 'מחיר ציפור מוקדמת' : 'Early Bird Price'}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <span className="font-display font-light" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: '#D4A853', lineHeight: 1 }}>{eb.earlyBird}</span>
                        <span style={{ fontSize: '1.1rem', color: 'rgba(232,213,183,0.35)', textDecoration: 'line-through' }}>{pricing}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'rgba(90,200,120,0.85)', fontWeight: 600, marginTop: '0.4rem' }}>
                        {isHe ? `חיסכון ${eb.saving}` : `Save ${eb.saving}`}
                      </p>
                      {event.earlyBirdSpotsRemaining != null && (
                        <p style={{ fontSize: '12px', color: 'rgba(232,213,183,0.45)', marginTop: '0.3rem', letterSpacing: '0.04em' }}>
                          {event.earlyBirdSpotsRemaining} {isHe ? 'מקומות נותרו במחיר זה' : 'spots remaining at this price'}
                        </p>
                      )}
                      {event.earlyBirdDeadline && (
                        <p style={{ fontSize: '11px', color: 'rgba(232,213,183,0.3)', marginTop: '0.2rem' }}>
                          {isHe ? `עד ${event.earlyBirdDeadline}` : `Until ${event.earlyBirdDeadline}`}
                        </p>
                      )}
                    </div>
                  )
                }
                return (
                  <>
                    <p style={{ fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4A853', marginBottom: '0.3rem', fontWeight: 700 }}>
                      {isHe ? 'החל מ' : 'Starting from'}
                    </p>
                    <p className="font-display font-light" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: '#D4A853', lineHeight: 1 }}>{pricing}</p>
                  </>
                )
              })()}
            </div>
            <div style={{ maxWidth: '420px', margin: '0 auto', width: '100%' }}>
              {hasTiers && event.tiers && event.tiers.length > 1 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <p className="eyebrow" style={{ marginBottom: '0.65rem' }}>{isHe ? 'בחרו חדר' : 'Choose your room'}</p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {event.tiers.map((tier, i) => {
                      const isActive = i === activeTierIdx
                      const name = isHe ? tier.name_he : tier.name_en
                      const price = tierPrice(tier, isHe)
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => setActiveTierIdx(i)}
                          style={{
                            background: isActive ? 'rgba(212,168,83,0.1)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${isActive ? 'rgba(212,168,83,0.45)' : 'rgba(232,213,183,0.12)'}`,
                            borderRadius: 4, padding: '0.5rem 0.9rem',
                            cursor: 'pointer', transition: 'all 0.18s',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.05rem',
                          }}
                        >
                          <p style={{ fontSize: '13px', color: isActive ? '#E8D5B7' : 'rgba(232,213,183,0.85)', fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>{name}</p>
                          <p style={{ fontSize: '13px', color: '#D4A853', whiteSpace: 'nowrap', fontWeight: 600 }}>{price}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
              {isSoldOut ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <WaitlistForm retreatSlug={event.slug} locale={locale} />
                  <div style={{ borderTop: '1px solid rgba(232,213,183,0.1)', paddingTop: '1.5rem' }}>
                    <NewsletterInline locale={locale} heading={isHe ? 'או היו הראשונים לדעת על הריטריטים הבאים' : 'Or be first to know about our next retreats'} />
                  </div>
                </div>
              ) : (
                <>
                  <motion.button
                    onClick={() => setShowModal(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-solid-gold"
                    style={{ justifyContent: 'center', width: '100%', borderRadius: '4px', padding: '1rem 2rem', fontSize: '13px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}
                  >
                    {isHe ? 'למידע ורישום' : 'Apply Now'}
                  </motion.button>
                  <p className="font-body" style={{ fontSize: '12px', color: 'rgba(232,213,183,0.7)', letterSpacing: '0.04em', textAlign: 'center', marginTop: '0.65rem' }}>{t.disclaimer}</p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
