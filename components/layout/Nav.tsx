'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { i18n, type Locale } from '@/lib/i18n'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

interface NavProps {
  locale: Locale
}

const linkStyle = {
  color: 'rgba(255,255,255,0.75)',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: 400,
  letterSpacing: '0.08em',
  textTransform: 'uppercase' as const,
  transition: 'color 0.3s',
}

export default function Nav({ locale }: NavProps) {
  const t = i18n[locale].nav
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 40)
  })

  const anchorLinks = [
    { href: `/${locale}#concept`,    label: locale === 'he' ? 'הרעיון'    : 'Concept'    },
    { href: `/${locale}#experience`, label: locale === 'he' ? 'החוויה'    : 'Experience' },
    { href: `/${locale}#founders`,   label: locale === 'he' ? 'המדריכים'  : 'Founders'   },
    { href: `/${locale}/events`,     label: locale === 'he' ? 'אירועים'   : 'Events', isPage: true },
  ]

  return (
    <>
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
          <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <Image
              src="/images/UpsideDown Retreat Icon.png"
              alt="UpsideDown Retreat"
              width={56}
              height={56}
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

          {/* Center anchor links — desktop only */}
          <ul className="hidden lg:flex items-center" style={{ listStyle: 'none', gap: '36px' }}>
            {anchorLinks.map(link => (
              <li key={link.href}>
                {link.isPage
                  ? <Link
                      href={link.href}
                      style={linkStyle}
                      onMouseEnter={e => (e.currentTarget.style.color = '#E6D7C0')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                    >{link.label}</Link>
                  : <a
                      href={link.href}
                      style={linkStyle}
                      onMouseEnter={e => (e.currentTarget.style.color = '#E6D7C0')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                    >{link.label}</a>
                }
              </li>
            ))}
          </ul>

          {/* Right: Language (desktop) | Hamburger (mobile) */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex">
              <LanguageSwitcher currentLocale={locale} />
            </div>

            {/* Hamburger button */}
            <button
              className="flex lg:hidden"
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {[
                { y: menuOpen ? '0px' : '-6px', rotate: menuOpen ? '45deg' : '0deg' },
                { y: '0px',                     rotate: '0deg', fade: menuOpen },
                { y: menuOpen ? '0px' : '6px',  rotate: menuOpen ? '-45deg' : '0deg' },
              ].map((bar, i) => (
                <span
                  key={i}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '22px',
                    height: '1.5px',
                    background: 'rgba(246,240,231,0.9)',
                    transform: `translateX(-50%) translateY(calc(-50% + ${bar.y})) rotate(${bar.rotate})`,
                    opacity: bar.fade ? 0 : 1,
                    transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.2s',
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'oklch(12% 0.02 220 / 0.97)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            dir="ltr"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
              style={{ height: '100%', padding: '100px 2.25rem 2.5rem' }}
            >
              {/* Nav links */}
              <nav className="flex flex-col" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {anchorLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {link.isPage
                      ? <Link
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-cormorant), Georgia, serif',
                            fontSize: 'clamp(2.25rem, 10vw, 3rem)',
                            fontWeight: 400,
                            color: 'rgba(246,240,231,0.82)',
                            textDecoration: 'none',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.1,
                            padding: '0.65rem 0',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >{link.label}</Link>
                      : <a
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          style={{
                            display: 'block',
                            fontFamily: 'var(--font-cormorant), Georgia, serif',
                            fontSize: 'clamp(2.25rem, 10vw, 3rem)',
                            fontWeight: 400,
                            color: 'rgba(246,240,231,0.82)',
                            textDecoration: 'none',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.1,
                            padding: '0.65rem 0',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >{link.label}</a>
                    }
                  </motion.div>
                ))}
              </nav>

              <div style={{ flex: 1 }} />

              {/* Language + full logo at bottom */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="flex flex-col items-center"
                style={{ gap: '28px' }}
              >
                <LanguageSwitcher currentLocale={locale} />
                <Link href={`/${locale}`} onClick={() => setMenuOpen(false)}>
                  <Image
                    src="/images/UpsideDown Retreat - LOGO.png"
                    alt="UpsideDown Retreat"
                    width={220}
                    height={220}
                    style={{
                      objectFit: 'contain',
                      filter: 'brightness(0) invert(1) opacity(0.4)',
                      width: '180px',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
