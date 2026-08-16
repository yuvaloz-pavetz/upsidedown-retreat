import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope, Frank_Ruhl_Libre, Heebo } from 'next/font/google'
import type { Locale } from '@/lib/i18n'
import LocaleDetector from '@/components/LocaleDetector'
import AccessibilityWidget from '@/components/ui/AccessibilityWidget'
import MetaPixel from '@/components/analytics/MetaPixel'
import { GTMScript, GTMNoScript } from '@/components/analytics/GTM'
import GA4 from '@/components/analytics/GA4'

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
  metadataBase: new URL('https://upsidedown-retreat.com'),
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
  other: {
    'facebook-domain-verification': 'q9f6s3saf0dnohttznbtmpjkh4uxj2',
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

  const skipLabel = isHe ? 'דלג לתוכן הראשי' : 'Skip to main content'

  return (
    <html lang={locale} dir={dir} className={fontClasses} data-scroll-behavior="smooth">
      <head>
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <script
          dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","x0c8hndu1c");` }}
        />
      </head>
      <body>
        <GTMNoScript />
        {/* Skip navigation — visually hidden, appears on focus (WCAG 2.4.1 / SI 5568) */}
        <a href="#main-content" className="skip-link">
          {skipLabel}
        </a>

        <LocaleDetector currentLocale={locale as Locale} />
        {children}
        <AccessibilityWidget locale={locale as Locale} />
        <GTMScript />
        <GA4 />
        <MetaPixel />
      </body>
    </html>
  )
}
