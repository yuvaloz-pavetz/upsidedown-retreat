import type { Metadata } from 'next'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Registration Received',
  robots: { index: false },
}

const copy = {
  en: {
    dir: 'ltr' as const,
    eyebrow: 'You\'re in.',
    heading: 'Registration received.',
    body: 'We\'ll be in touch shortly to confirm your spot and share next steps.',
    cta: '← Back to retreats',
    href: '/en/events',
  },
  he: {
    dir: 'rtl' as const,
    eyebrow: 'קיבלנו.',
    heading: 'ההרשמה התקבלה.',
    body: 'ניצור קשר בקרוב לאישור המקום ושלבים הבאים.',
    cta: 'חזרה לריטריטים ←',
    href: '/he/events',
  },
}

export default async function ThankYouPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = (locale === 'he' ? copy.he : copy.en)

  return (
    <>
      <Nav locale={locale as Locale} />
      <main
        id="main-content"
        dir={t.dir}
        style={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '480px', width: '100%', textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>
          <p className="eyebrow" style={{ marginBottom: '1rem', color: '#D4A853' }}>{t.eyebrow}</p>
          <h1
            className="font-display"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: '#E8D5B7', lineHeight: 1.15, marginBottom: '1.25rem' }}
          >
            {t.heading}
          </h1>
          <p
            className="font-body"
            style={{ fontSize: '1rem', color: 'rgba(232,213,183,0.6)', lineHeight: 1.75, marginBottom: '2.5rem' }}
          >
            {t.body}
          </p>
          <Link
            href={t.href}
            style={{ fontSize: '0.85rem', color: '#D4A853', textDecoration: 'none', letterSpacing: '0.06em', borderBottom: '1px solid rgba(212,168,83,0.3)', paddingBottom: '2px' }}
          >
            {t.cta}
          </Link>
        </div>
      </main>
      <Footer locale={locale as Locale} />
    </>
  )
}
