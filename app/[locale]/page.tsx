import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { getOpenRetreats, enrichEarlyBird } from '@/lib/retreats'
import { createAdminClient } from '@/lib/supabase/admin'
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
import SoldOutPopup from '@/components/ui/SoldOutPopup'
import Gallery from '@/components/sections/Gallery'
import Testimonials from '@/components/sections/Testimonials'
import Newsletter from '@/components/sections/Newsletter'
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

  const [contentMap, rawRetreats] = await Promise.all([
    getSiteContentMap(loc),
    getOpenRetreats().catch(() => staticEvents.filter(e => e.status === 'open' || e.status === 'coming-soon' || e.status === 'last-spots' || e.status === 'sold-out')),
  ])

  const paidBySlug: Record<string, number> = {}
  try {
    const admin = createAdminClient()
    const { data: leadCounts } = await admin.from('leads').select('event_slug').in('status', ['partially_paid', 'paid'])
    if (leadCounts) {
      for (const l of leadCounts) {
        paidBySlug[l.event_slug] = (paidBySlug[l.event_slug] ?? 0) + 1
      }
    }
  } catch { /* leads table may not exist */ }

  const openRetreats = enrichEarlyBird(rawRetreats, paidBySlug)

  const content = buildI18n(loc, contentMap)
  const soldOutRetreat = openRetreats.find(e => e.status === 'sold-out')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UpsideDown Retreat',
    url: 'https://upsidedown-retreat.com',
    description: content.hero.subtitle,
    sameAs: [],
  }

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {soldOutRetreat && <SoldOutPopup retreat={soldOutRetreat} locale={loc} />}
      <Nav locale={loc} />
      <Hero locale={loc} t={content.hero} />
      <CoreIdea locale={loc} />
      <Timeline locale={loc} t={content.timeline} />
      <WhyDifferent locale={loc} />
      <Instructors locale={loc} t={content.instructors} />
      <WhoFor locale={loc} />
      <Testimonials locale={loc} />
      <UpcomingRetreat locale={loc} events={openRetreats} t={{ sectionLabel: content.retreat.sectionLabel }} />
      <Gallery locale={loc} t={content.gallery} />
      <Newsletter locale={loc} />
      <FAQ locale={loc} />
      <FinalCta locale={loc} t={content.finalCta} />
      <Footer locale={loc} />
    </main>
  )
}
