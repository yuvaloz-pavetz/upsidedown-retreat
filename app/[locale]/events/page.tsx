import type { Metadata } from 'next'
import type { Locale } from '@/lib/i18n'
import { getAllRetreats, enrichEarlyBird } from '@/lib/retreats'
import { events as staticEvents } from '@/lib/events'
import { getSiteContentMap, buildI18n } from '@/lib/content'
import { createAdminClient } from '@/lib/supabase/admin'
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

  // Compute early bird active status from paid lead counts
  const paidBySlug: Record<string, number> = {}
  try {
    const admin = createAdminClient()
    const { data } = await admin.from('leads').select('event_slug').in('status', ['partially_paid', 'paid'])
    for (const l of data ?? []) {
      paidBySlug[l.event_slug] = (paidBySlug[l.event_slug] ?? 0) + 1
    }
  } catch { /* leads table may not exist */ }

  const enrichedRetreats = enrichEarlyBird(retreats, paidBySlug)
  const content = buildI18n(loc, contentMap)

  return (
    <main id="main-content">
      <Nav locale={loc} />
      <EventsPageContent locale={loc} events={enrichedRetreats} t={content.events} />
      <Footer locale={loc} />
    </main>
  )
}
