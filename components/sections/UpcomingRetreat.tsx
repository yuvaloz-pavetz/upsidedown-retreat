'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { i18n, type Locale } from '@/lib/i18n'
import type { Event } from '@/lib/events'

interface UpcomingRetreatProps {
  locale: Locale
  events: Event[]
  t?: Partial<typeof i18n['en']['retreat']>
}

function RetreatCard({ event, locale, index }: { event: Event; locale: Locale; index: number }) {
  const [hovered, setHovered] = useState(false)
  const t = i18n[locale].events
  const pricing = locale === 'he' ? event.pricingILS : event.pricingEUR

  const statusLabel =
    event.status === 'open' ? (locale === 'he' ? 'פתוח להרשמה' : 'Open') :
    event.status === 'last-spots' ? t.lastSpots :
    event.status === 'coming-soon' ? t.comingSoon :
    t.soldOut

  const statusBg =
    event.status === 'last-spots' ? '#E3B23C' :
    event.status === 'coming-soon' ? 'rgba(26,26,46,0.8)' :
    '#E3B23C'

  const statusColor =
    event.status === 'last-spots' ? '#0B1D2A' :
    event.status === 'coming-soon' ? '#F7F8F6' :
    '#0B1D2A'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#F7F8F6',
        borderRadius: '4px',
        overflow: 'hidden',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? '0 28px 60px rgba(26,26,46,0.12)' : '0 4px 20px rgba(26,26,46,0.06)',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
        <Image
          src={event.heroImage}
          alt={event.location[locale]}
          fill
          className="object-cover"
          style={{
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
          }}
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        {/* Status badge */}
        <span
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: statusBg,
            color: statusColor,
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '5px 12px',
            borderRadius: '20px',
            fontWeight: 500,
          }}
        >
          {statusLabel}
        </span>
        {/* Spots badge */}
        {event.spotsRemaining > 0 && event.status !== 'coming-soon' && (
          <span
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(26,26,46,0.8)',
              color: '#F7F8F6',
              fontSize: '11px',
              padding: '5px 12px',
              borderRadius: '20px',
              backdropFilter: 'blur(8px)',
            }}
          >
            {event.spotsRemaining} {t.spotsLeft}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '32px' }}>
        <p
          style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C8A97A',
            marginBottom: '10px',
          }}
        >
          {event.location[locale]}
        </p>
        <h3
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontSize: '22px',
            color: '#0B1D2A',
            marginBottom: '8px',
            fontWeight: 400,
          }}
        >
          {event.title[locale]}
        </h3>
        <p
          style={{
            fontSize: '14px',
            color: '#6B7884',
            marginBottom: '12px',
          }}
        >
          {event.dates[locale]}
        </p>
        <p
          style={{
            fontSize: '14px',
            color: '#6B7884',
            lineHeight: 1.6,
            marginBottom: '28px',
            fontStyle: 'italic',
          }}
        >
          {event.duration[locale]}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '22px',
                color: '#0B1D2A',
                fontWeight: 400,
              }}
            >
              {pricing}
            </span>
            <span style={{ fontSize: '12px', color: '#6B7884', marginLeft: '4px' }}>
              / person
            </span>
          </div>
          <Link
            href={`/${locale}/events`}
            style={{
              background: '#0B1D2A',
              color: '#F7F8F6',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '24px',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background 0.3s',
              textDecoration: 'none',
              display: 'inline-block',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#123A4A')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0B1D2A')}
          >
            {i18n[locale].events.learnMore}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function UpcomingRetreat({ locale, events, t: tProp }: UpcomingRetreatProps) {
  const base = i18n[locale].retreat
  const t = tProp ? { ...base, ...tProp } : base

  return (
    <section id="retreats" className="py-28 md:py-40 relative" style={{ background: '#E8DECD' }}>
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16"
          dir="ltr"
        >
          <div>
            <p
              style={{
                fontFamily: 'var(--font-manrope), sans-serif',
                fontSize: '11px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#E3B23C',
                marginBottom: '24px',
                fontWeight: 500,
              }}
            >
              {t.sectionLabel}
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 'clamp(36px, 4.5vw, 64px)',
                fontWeight: 500,
                lineHeight: 1.05,
                color: '#0B1D2A',
                letterSpacing: '-0.01em',
              }}
            >
              {locale === 'he' ? 'תאריכי ריטריט' : 'Retreat dates'}
            </h2>
          </div>
          <Link
            href={`/${locale}/events`}
            style={{ color: '#C8A97A', textDecoration: 'none', fontSize: '14px', letterSpacing: '0.05em' }}
          >
            {locale === 'he' ? 'לכל הריטריטים →' : 'View all retreats →'}
          </Link>
        </motion.div>

        {/* Cards grid */}
        {events.length > 0 ? (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            dir="ltr"
          >
            {events.slice(0, 3).map((event, i) => (
              <RetreatCard key={event.slug} event={event} locale={locale} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            dir="ltr"
            style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              border: '1px solid rgba(200,169,122,0.2)',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.35)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: '28px',
                color: '#0B1D2A',
                marginBottom: '12px',
                fontWeight: 400,
              }}
            >
              {locale === 'he' ? 'תאריכים בקרוב' : 'Dates coming soon'}
            </p>
            <p style={{ fontSize: '15px', color: '#6B7884', marginBottom: '32px' }}>
              {locale === 'he'
                ? 'הירשמו לעדכון על תאריכי הריטריט הבאים'
                : 'Register your interest to be notified when dates are announced'}
            </p>
            <a
              href={`mailto:yuvaloz@gmail.com?subject=${encodeURIComponent('Retreat interest')}`}
              className="btn-solid-gold"
              style={{ fontSize: '0.65rem' }}
            >
              {locale === 'he' ? 'שלחו לי עדכון' : 'Notify me'}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}
