import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { getRetreatBySlug } from '@/lib/retreats'
import { getEventBySlug } from '@/lib/events'
import { getSiteContentMap, buildI18n } from '@/lib/content'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import EventDetailContent from '@/components/sections/EventDetailContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const loc = (locale === 'he' ? 'he' : 'en') as Locale
  const event = await getRetreatBySlug(slug).catch(() => getEventBySlug(slug) ?? null)
  if (!event) return { title: 'Retreat Not Found' }

  const description = event.description[loc].replace(/\n/g, ' ').slice(0, 155)

  return {
    title: event.title[loc],
    description,
    alternates: {
      canonical: `/${locale}/events/${slug}`,
      languages: {
        en: `/en/events/${slug}`,
        he: `/he/events/${slug}`,
      },
    },
    openGraph: {
      title: event.title[loc],
      description,
      url: `/${locale}/events/${slug}`,
      locale: loc === 'he' ? 'he_IL' : 'en_US',
      images: event.heroImage
        ? [{ url: event.heroImage, width: 1200, height: 630, alt: event.title[loc] }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title[loc],
      description,
      images: event.heroImage ? [event.heroImage] : undefined,
    },
  }
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const loc = (locale === 'he' ? 'he' : 'en') as Locale

  const [event, contentMap] = await Promise.all([
    getRetreatBySlug(slug).catch(() => getEventBySlug(slug) ?? null),
    getSiteContentMap(loc),
  ])

  if (!event) notFound()

  const content = buildI18n(loc, contentMap)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title[loc],
    description: event.description[loc].replace(/\n/g, ' ').slice(0, 300),
    location: {
      '@type': 'Place',
      name: event.location[loc],
    },
    organizer: {
      '@type': 'Organization',
      name: 'UpsideDown Retreat',
      url: 'https://upsidedownretreat.com',
    },
    offers: {
      '@type': 'Offer',
      price: event.pricingEUR.replace(/[^0-9.]/g, '') || undefined,
      priceCurrency: 'EUR',
      availability:
        event.status === 'sold-out'
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
    },
    image: event.heroImage
      ? `https://upsidedownretreat.com${event.heroImage}`
      : undefined,
  }

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav locale={loc} />
      <EventDetailContent locale={loc} event={event} t={content.events} />
      <Footer locale={loc} />
    </main>
  )
}
