'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

interface AccessibilityWidgetProps {
  locale: Locale
}

const STORAGE_FONT_SIZE = 'a11y-font-size'
const STORAGE_HIGH_CONTRAST = 'a11y-high-contrast'
const STORAGE_UNDERLINE_LINKS = 'a11y-underline-links'

const labels: Record<Locale, {
  open: string
  close: string
  title: string
  fontIncrease: string
  fontDecrease: string
  fontReset: string
  highContrast: string
  underlineLinks: string
  resetAll: string
  statement: string
}> = {
  en: {
    open: 'Accessibility options',
    close: 'Close accessibility panel',
    title: 'Accessibility',
    fontIncrease: 'Increase font size',
    fontDecrease: 'Decrease font size',
    fontReset: 'Reset font size',
    highContrast: 'High contrast',
    underlineLinks: 'Underline links',
    resetAll: 'Reset all',
    statement: 'Accessibility statement',
  },
  he: {
    open: 'אפשרויות נגישות',
    close: 'סגור פאנל נגישות',
    title: 'נגישות',
    fontIncrease: 'הגדל גופן',
    fontDecrease: 'הקטן גופן',
    fontReset: 'אפס גודל גופן',
    highContrast: 'ניגודיות גבוהה',
    underlineLinks: 'קווים תחת קישורים',
    resetAll: 'אפס הכל',
    statement: 'הצהרת נגישות',
  },
}

export default function AccessibilityWidget({ locale }: AccessibilityWidgetProps) {
  const [open, setOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)
  const [underlineLinks, setUnderlineLinks] = useState(false)

  const t = labels[locale] ?? labels['en']

  // Restore persisted preferences on mount
  useEffect(() => {
    const storedSize = localStorage.getItem(STORAGE_FONT_SIZE)
    const storedContrast = localStorage.getItem(STORAGE_HIGH_CONTRAST)
    const storedUnderline = localStorage.getItem(STORAGE_UNDERLINE_LINKS)

    if (storedSize) {
      const pct = parseInt(storedSize, 10)
      setFontSize(pct)
      document.documentElement.style.fontSize = `${pct}%`
    }
    if (storedContrast === 'true') {
      setHighContrast(true)
      document.documentElement.classList.add('high-contrast')
    }
    if (storedUnderline === 'true') {
      setUnderlineLinks(true)
      document.documentElement.classList.add('underline-links')
    }
  }, [])

  const changeFontSize = useCallback((delta: number) => {
    setFontSize(prev => {
      const next = Math.min(150, Math.max(75, prev + delta))
      document.documentElement.style.fontSize = `${next}%`
      localStorage.setItem(STORAGE_FONT_SIZE, String(next))
      return next
    })
  }, [])

  const resetFontSize = useCallback(() => {
    setFontSize(100)
    document.documentElement.style.fontSize = '100%'
    localStorage.setItem(STORAGE_FONT_SIZE, '100')
  }, [])

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => {
      const next = !prev
      document.documentElement.classList.toggle('high-contrast', next)
      localStorage.setItem(STORAGE_HIGH_CONTRAST, String(next))
      return next
    })
  }, [])

  const toggleUnderlineLinks = useCallback(() => {
    setUnderlineLinks(prev => {
      const next = !prev
      document.documentElement.classList.toggle('underline-links', next)
      localStorage.setItem(STORAGE_UNDERLINE_LINKS, String(next))
      return next
    })
  }, [])

  const resetAll = useCallback(() => {
    setFontSize(100)
    document.documentElement.style.fontSize = '100%'
    localStorage.setItem(STORAGE_FONT_SIZE, '100')

    setHighContrast(false)
    document.documentElement.classList.remove('high-contrast')
    localStorage.setItem(STORAGE_HIGH_CONTRAST, 'false')

    setUnderlineLinks(false)
    document.documentElement.classList.remove('underline-links')
    localStorage.setItem(STORAGE_UNDERLINE_LINKS, 'false')
  }, [])

  const panelStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: open ? '4.5rem' : '-100%',
    left: '1rem',
    zIndex: 9998,
    background: '#0B1D2A',
    border: '1px solid rgba(212,168,83,0.35)',
    borderRadius: '8px',
    padding: '1.25rem 1.5rem',
    minWidth: '220px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    transition: 'bottom 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  }

  const triggerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '1rem',
    left: '1rem',
    zIndex: 9999,
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#D4A853',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
    color: '#0B1D2A',
    transition: 'transform 0.2s ease, background 0.2s ease',
  }

  const btnStyle = (active?: boolean): React.CSSProperties => ({
    background: active ? 'rgba(212,168,83,0.25)' : 'rgba(255,255,255,0.08)',
    border: `1px solid ${active ? 'rgba(212,168,83,0.7)' : 'rgba(255,255,255,0.3)'}`,
    color: '#E8D5B7',
    borderRadius: '4px',
    padding: '0.55rem 0.8rem',
    fontSize: '14px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    width: '100%',
    transition: 'background 0.2s, border-color 0.2s',
    fontWeight: 500,
  })

  const sectionLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'rgba(232,213,183,0.85)',
    marginBottom: '0.35rem',
    fontWeight: 600,
  }

  return (
    <>
      {/* Panel */}
      <div
        id="a11y-panel"
        style={panelStyle}
        aria-label={t.title}
        {...({ inert: !open ? '' : undefined } as Record<string, unknown>)}
      >
        <p style={{ fontSize: '15px', fontWeight: 700, color: '#E8D5B7', margin: 0 }}>
          {t.title}
        </p>

        {/* Font size */}
        <div>
          <p style={sectionLabelStyle}>{t.fontIncrease.split(' ')[0]}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              style={{ ...btnStyle(), width: 'auto', padding: '0.45rem 0.85rem', fontSize: '16px', fontWeight: 700 }}
              onClick={() => changeFontSize(10)}
              aria-label={t.fontIncrease}
            >A+</button>
            <button
              style={{ ...btnStyle(), width: 'auto', padding: '0.45rem 0.85rem', fontSize: '16px', fontWeight: 700 }}
              onClick={() => changeFontSize(-10)}
              aria-label={t.fontDecrease}
            >A-</button>
            {fontSize !== 100 && (
              <button
                style={{ ...btnStyle(), width: 'auto', padding: '0.5rem 0.75rem', fontSize: '13px' }}
                onClick={resetFontSize}
                aria-label={t.fontReset}
              >100%</button>
            )}
          </div>
        </div>

        {/* High contrast */}
        <button style={btnStyle(highContrast)} onClick={toggleHighContrast} aria-pressed={highContrast}>
          {t.highContrast}
        </button>

        {/* Underline links */}
        <button style={btnStyle(underlineLinks)} onClick={toggleUnderlineLinks} aria-pressed={underlineLinks}>
          {t.underlineLinks}
        </button>

        {/* Reset all */}
        <button
          style={{ ...btnStyle(), fontSize: '13px', color: 'rgba(232,213,183,0.9)', borderStyle: 'dashed', opacity: (fontSize !== 100 || highContrast || underlineLinks) ? 1 : 0.45 }}
          onClick={resetAll}
          aria-disabled={fontSize === 100 && !highContrast && !underlineLinks}
        >
          {t.resetAll}
        </button>

        {/* Statement link */}
        <Link
          href={`/${locale}/accessibility#statement`}
          style={{
            fontSize: '14px',
            color: '#D4A853',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            fontWeight: 500,
          }}
          onClick={() => setOpen(false)}
        >
          {t.statement}
        </Link>
      </div>

      {/* Trigger button */}
      <button
        style={triggerStyle}
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen(prev => !prev)}
      >
        {/* accessibility_new — Material Design, arms spread wide */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M20.5 6c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 8c1.86.5 4 .83 6 1v13h2v-6h2v6h2V9c2-.17 4.14-.5 6-1l-.5-2zM12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
        </svg>
      </button>
    </>
  )
}
