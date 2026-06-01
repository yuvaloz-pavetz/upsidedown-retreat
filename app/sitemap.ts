import type { MetadataRoute } from 'next'
import { getAllRetreats } from '@/lib/retreats'

const BASE = 'https://upsidedown-retreat.com'
const LOCALES = ['en', 'he'] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const retreats = await getAllRetreats().catch(() => [])

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap(locale => [
    { url: `${BASE}/${locale}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/${locale}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  ])

  const retreatRoutes: MetadataRoute.Sitemap = LOCALES.flatMap(locale =>
    retreats.map(r => ({
      url: `${BASE}/${locale}/events/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  return [...staticRoutes, ...retreatRoutes]
}
