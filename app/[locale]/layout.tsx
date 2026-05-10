import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope, Frank_Ruhl_Libre, Heebo } from 'next/font/google'
import type { Locale } from '@/lib/i18n'
import LocaleDetector from '@/components/LocaleDetector'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ['latin', 'hebrew'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-frank-ruhl',
  display: 'swap',
})

const heebo = Heebo({
  subsets: ['latin', 'hebrew'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heebo',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://upsidedownretreat.com'),
  title: {
    template: '%s | The UpsideDown Retreat',
    default: 'The UpsideDown Retreat — Handstands & Freediving',
  },
  description:
    'A luxury retreat where breath meets inversion. Master handstands above water, freediving below. Crete, June 2025.',
  openGraph: {
    title: 'The UpsideDown Retreat',
    description: 'Where the sky meets the deep.',
    images: [{ url: '/images/hero-bg.jpeg', width: 1200, height: 630 }],
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isHe = locale === 'he'
  const dir = isHe ? 'rtl' : 'ltr'

  const fontClasses = [
    cormorant.variable,
    manrope.variable,
    frankRuhl.variable,
    heebo.variable,
  ].join(' ')

  return (
    <html lang={locale} dir={dir} className={fontClasses} data-scroll-behavior="smooth">
      <body>
        <LocaleDetector currentLocale={locale as Locale} />
        {children}
      </body>
    </html>
  )
}
