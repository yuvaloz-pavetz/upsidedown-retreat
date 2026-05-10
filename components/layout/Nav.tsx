'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { i18n, type Locale } from '@/lib/i18n'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

interface NavProps {
  locale: Locale
}

export default function Nav({ locale }: NavProps) {
  const t = i18n[locale].nav
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 40)
  })

  const anchorLinks = [
    { href: `/${locale}#concept`, label: locale === 'he' ? 'הרעיון' : 'Concept' },
    { href: `/${locale}#experience`, label: locale === 'he' ? 'החוויה' : 'Experience' },
    { href: `/${locale}#founders`, label: locale === 'he' ? 'המדריכים' : 'Founders' },
    { href: `/${locale}#retreats`, label: locale === 'he' ? 'ריטריטים' : 'Retreats' },
  ]

  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 flex justify-center transition-all duration-500"
      style={{ paddingTop: scrolled ? '1rem' : '0' }}
    >
      <div
        className="flex items-center justify-between gap-4 transition-all duration-500"
        dir="ltr"
        style={{
          width: '100%',
          maxWidth: scrolled ? '960px' : '10000px',
          background: scrolled ? 'rgba(11,29,42,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          border: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          borderRadius: scrolled ? '9999px' : '0',
          padding: scrolled ? '0.65rem 1.8rem' : '1.4rem 8%',
        }}
      >
        {/* Logo */}
        <Link
          href={`/${locale}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <Image
            src="/images/UpsideDown Retreat Icon.png"
            alt="UpsideDown Retreat"
            width={48}
            height={48}
            style={{
              objectFit: 'contain',
              flexShrink: 0,
              filter: 'brightness(0) invert(1) opacity(0.92)',
              transform: scrolled ? 'scale(0.75)' : 'scale(1)',
              transformOrigin: 'left center',
              transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
            }}
            priority
          />
        </Link>

        {/* Center: anchor links (desktop only) */}
        <ul
          className="hidden lg:flex items-center"
          style={{ listStyle: 'none', gap: '36px' }}
        >
          {anchorLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                style={{
                  color: 'rgba(255,255,255,0.75)',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#E6D7C0')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: Events + Language */}
        <div className="flex items-center gap-4 md:gap-5">
          <Link
            href={`/${locale}/events`}
            className="group relative hidden sm:flex flex-col overflow-hidden font-body text-xs"
            style={{
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              height: '1.1em',
              lineHeight: '1.1em',
            }}
          >
            <span
              className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2"
              style={{ lineHeight: '1.1em' }}
            >
              <span style={{ color: 'rgba(232,213,183,0.5)' }}>{t.events}</span>
              <span style={{ color: '#E3B23C' }}>{t.events}</span>
            </span>
          </Link>

          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </header>
  )
}
