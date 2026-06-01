'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { i18n, type Locale } from '@/lib/i18n'
import LoginModal from '@/components/ui/LoginModal'

interface FooterProps {
  locale: Locale
}

export default function Footer({ locale }: FooterProps) {
  const t = i18n[locale].footer
  const [loginOpen, setLoginOpen] = useState(false)

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
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.65,
              maxWidth: '240px',
              marginTop: '14px',
            }}
          >
            Inverted Perspective. Deeper Connection.
            <br />
            <span
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: '13px',
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
              fontSize: '13px',
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
              { href: `/${locale}#instructors`, label: locale === 'he' ? 'המדריכים' : 'Instructors' },
              { href: `/${locale}/events`, label: locale === 'he' ? 'ריטריטים' : 'Retreats' },
            ].map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E6D7C0')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
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
              fontSize: '13px',
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
              { href: 'https://www.instagram.com/upsidedown.retreat', label: 'Instagram' },
              { href: 'https://www.facebook.com/upsidedown.retreat', label: 'Facebook' },
              { href: `/${locale}#newsletter`, label: locale === 'he' ? 'ניוזלטר' : 'Newsletter' },
              { href: 'mailto:upsidedownretreat@gmail.com', label: locale === 'he' ? 'צור קשר' : 'Contact' },
            ].map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E6D7C0')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
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
              fontSize: '13px',
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
              { href: `/${locale}/accessibility`, label: locale === 'he' ? 'נגישות' : 'Accessibility' },
              { href: `/${locale}/privacy`, label: locale === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy' },
            ].map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E6D7C0')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                >
                  {link.label}
                </Link>
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
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
          {t.copyright}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>
            Made with depth.
          </p>
          <button
            onClick={() => setLoginOpen(true)}
            style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'color 0.3s', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E6D7C0')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          >
            {locale === 'he' ? 'כניסה לאיזור אישי' : 'Personal Area'}
          </button>
          <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} locale={locale} />
        </div>
      </div>
    </footer>
  )
}
