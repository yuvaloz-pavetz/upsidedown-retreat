'use client'

import Link from 'next/link'
import Image from 'next/image'
import { i18n, type Locale } from '@/lib/i18n'

interface FooterProps {
  locale: Locale
}

export default function Footer({ locale }: FooterProps) {
  const t = i18n[locale].footer

  return (
    <footer style={{ background: '#0f0f1e' }} className="px-6 sm:px-12 lg:px-20 pt-16 pb-10">
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 pb-12"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Brand — spans both cols on mobile */}
        <div className="col-span-2 lg:col-span-1">
          <div style={{ marginBottom: '20px' }}>
            <Image
              src="/images/UpsideDown Retreat - LOGO.png"
              alt="UpsideDown Retreat"
              width={140}
              height={60}
              style={{ filter: 'brightness(0) invert(1) opacity(0.92)', objectFit: 'contain', height: 'auto' }}
            />
          </div>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.65,
              maxWidth: '240px',
              marginTop: '14px',
            }}
          >
            Inverted Perspective. Deeper Connection.
            <br />
            <span
              style={{
                color: 'rgba(255,255,255,0.2)',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginTop: '8px',
              }}
            >
              Strength · Stillness · Connection
            </span>
          </p>
        </div>

        {/* Explore */}
        <div>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#E6D7C0',
              marginBottom: '20px',
            }}
          >
            {locale === 'he' ? 'חקור' : 'Explore'}
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { href: `/${locale}#concept`, label: locale === 'he' ? 'הרעיון' : 'Concept' },
              { href: `/${locale}#experience`, label: locale === 'he' ? 'החוויה' : 'Experience' },
              { href: `/${locale}#founders`, label: locale === 'he' ? 'המדריכים' : 'Founders' },
              { href: `/${locale}/events`, label: locale === 'he' ? 'ריטריטים' : 'Retreats' },
            ].map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#E6D7C0',
              marginBottom: '20px',
            }}
          >
            {locale === 'he' ? 'צור קשר' : 'Connect'}
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { href: 'https://instagram.com', label: 'Instagram' },
              { href: '#', label: locale === 'he' ? 'ניוזלטר' : 'Newsletter' },
              { href: 'mailto:yuvaloz@gmail.com', label: locale === 'he' ? 'צור קשר' : 'Contact' },
            ].map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#E6D7C0',
              marginBottom: '20px',
            }}
          >
            {locale === 'he' ? 'משפטי' : 'Legal'}
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { href: '#', label: locale === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy' },
              { href: '#', label: locale === 'he' ? 'תנאי שימוש' : 'Terms' },
              { href: '#', label: locale === 'he' ? 'ביטול' : 'Cancellation' },
            ].map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
          {t.copyright}
        </p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
          Made with depth.
        </p>
      </div>
    </footer>
  )
}
