import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { getAllRetreats } from '@/lib/retreats'
import { events as staticEvents } from '@/lib/events'
import { getSiteContentMap, buildI18n } from '@/lib/content'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import EventsPageContent from '@/components/sections/EventsPageContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isHe = locale === 'he'
  return {
    title: isHe ? 'ריטריטים קרובים' : 'Upcoming Retreats',
    description: isHe
      ? 'ריטריטים לעמידות על ידיים וצלילה חופשית. בחרו את הריטריט הבא שלכם.'
      : 'Upcoming handstand and freediving retreats. Choose your next transformation.',
    alternates: {
      canonical: `/${locale}/events`,
      languages: { en: '/en/events', he: '/he/events' },
    },
  }
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const loc = (locale === 'he' ? 'he' : 'en') as Locale

  const [contentMap, retreats] = await Promise.all([
    getSiteContentMap(loc),
    getAllRetreats().catch(() => staticEvents),
  ])

  const content = buildI18n(loc, contentMap)

  return (
    <main>
      <Nav locale={loc} />
      <EventsPageContent locale={loc} events={retreats} t={content.events} />
      <Footer locale={loc} />
    </main>
  )
}
