import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { getOpenRetreats } from '@/lib/retreats'
import { events as staticEvents } from '@/lib/events'
import { getSiteContentMap, buildI18n } from '@/lib/content'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import CoreIdea from '@/components/sections/CoreIdea'
import Timeline from '@/components/sections/Timeline'
import WhyDifferent from '@/components/sections/WhyDifferent'
import Instructors from '@/components/sections/Instructors'
import WhoFor from '@/components/sections/WhoFor'
import UpcomingRetreat from '@/components/sections/UpcomingRetreat'
import Gallery from '@/components/sections/Gallery'
import FAQ from '@/components/sections/FAQ'
import FinalCta from '@/components/sections/FinalCta'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isHe = locale === 'he'
  return {
    title: isHe
      ? 'ריטריט UpsideDown — עמידות על ידיים וצלילה חופשית'
      : 'The UpsideDown Retreat — Handstands & Freediving',
    description: isHe
      ? 'ריטריט יוקרתי המשלב עמידות על ידיים מעל פני המים וצלילה חופשית מתחתם. כרתים, יוון 2025.'
      : 'A luxury retreat combining handstands above water and freediving below. Crete, Greece 2025. Transform your practice and your perspective.',
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', he: '/he' },
    },
    openGraph: {
      url: `/${locale}`,
      locale: isHe ? 'he_IL' : 'en_US',
      alternateLocale: [isHe ? 'en_US' : 'he_IL'],
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = (locale === 'he' ? 'he' : 'en') as Locale

  const [contentMap, openRetreats] = await Promise.all([
    getSiteContentMap(loc),
    getOpenRetreats().catch(() => staticEvents.filter(e => e.status === 'open' || e.status === 'coming-soon' || e.status === 'last-spots')),
  ])

  const content = buildI18n(loc, contentMap)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UpsideDown Retreat',
    url: 'https://upsidedownretreat.com',
    description: content.hero.subtitle,
    sameAs: [],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav locale={loc} />
      <Hero locale={loc} t={content.hero} />
      <CoreIdea locale={loc} />
      <Timeline locale={loc} t={content.timeline} />
      <WhyDifferent locale={loc} />
      <Instructors locale={loc} t={content.instructors} />
      <WhoFor locale={loc} />
      <UpcomingRetreat locale={loc} events={openRetreats} t={{ sectionLabel: content.retreat.sectionLabel }} />
      <Gallery locale={loc} t={content.gallery} />
      <FAQ locale={loc} />
      <FinalCta locale={loc} t={content.finalCta} />
      <Footer locale={loc} />
    </main>
  )
}
