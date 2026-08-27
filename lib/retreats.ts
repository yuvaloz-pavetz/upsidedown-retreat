import { createAdminClient } from '@/lib/supabase/admin'
import type { Event } from '@/lib/events'
import { getEventBySlug } from '@/lib/events'
import type { RetreatRow } from '@/lib/supabase/types'

export function rowToEvent(row: RetreatRow): Event {
  return {
    slug: row.slug,
    status: row.status,
    title: { en: row.title_en, he: row.title_he },
    location: { en: row.location_en, he: row.location_he },
    dates: { en: row.dates_en, he: row.dates_he },
    year: row.year,
    duration: { en: row.duration_en, he: row.duration_he },
    pricingILS: row.pricing_ils ?? '',
    pricingEUR: row.pricing_eur,
    spotsRemaining: row.spots_remaining,
    spotsTotal: row.spots_total,
    heroImage: row.hero_image,
    galleryImages: row.gallery_images,
    description: { en: row.description_en, he: row.description_he },
    includes: { en: row.includes_en, he: row.includes_he },
    venueDescriptionEn: row.venue_description_en,
    venueDescriptionHe: row.venue_description_he,
    venueImages: row.venue_images,
    instagramUrls: row.instagram_urls,
    instagramUrlsEn: row.instagram_urls_en,
    instagramUrlsHe: row.instagram_urls_he,
    whoForEn: row.who_for_en,
    whoForHe: row.who_for_he,
    tiers: row.tiers,
    earlyBirdEnabled:     row.early_bird_enabled     ?? false,
    earlyBirdDiscountEUR: row.early_bird_discount_eur ?? null,
    earlyBirdDiscountILS: row.early_bird_discount_ils ?? null,
    earlyBirdSpots:       row.early_bird_spots        ?? null,
    earlyBirdDeadline:    row.early_bird_deadline     ?? null,
  }
}

function computeEarlyBirdActive(event: import('@/lib/events').Event, paidCount: number): boolean {
  if (!event.earlyBirdEnabled) return false
  if (event.earlyBirdSpots != null && paidCount >= event.earlyBirdSpots) return false
  if (event.earlyBirdDeadline && new Date(event.earlyBirdDeadline) < new Date()) return false
  return true
}

export function enrichEarlyBird(
  events: import('@/lib/events').Event[],
  paidBySlug: Record<string, number>,
): import('@/lib/events').Event[] {
  return events.map(e => {
    const paid = paidBySlug[e.slug] ?? 0
    const active = computeEarlyBirdActive(e, paid)
    const spotsRemaining = e.earlyBirdSpots != null ? Math.max(0, e.earlyBirdSpots - paid) : undefined
    return { ...e, earlyBirdActive: active, earlyBirdSpotsRemaining: spotsRemaining }
  })
}

export async function getAllRetreats(): Promise<Event[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('retreats')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('year', { ascending: false })

  if (error || !data) return []
  return data.map(rowToEvent)
}

export async function getRetreatBySlug(slug: string): Promise<Event | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('retreats')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  const event = rowToEvent(data)
  const staticEvent = getEventBySlug(slug)
  if (staticEvent) {
    if (!event.heroImage?.startsWith('http') && staticEvent.heroImage?.startsWith('http')) event.heroImage = staticEvent.heroImage
    if (staticEvent.venueImages?.length) event.venueImages = staticEvent.venueImages
    if (staticEvent.venueDescriptionEn) event.venueDescriptionEn = staticEvent.venueDescriptionEn
    if (staticEvent.venueDescriptionHe) event.venueDescriptionHe = staticEvent.venueDescriptionHe
    if (!event.instagramUrls?.length && staticEvent.instagramUrls?.length) event.instagramUrls = staticEvent.instagramUrls
    if (staticEvent.galleryImages?.length) {
      const existing = new Set(event.galleryImages)
      const extra = staticEvent.galleryImages.filter(img => !existing.has(img))
      if (extra.length) event.galleryImages = [...event.galleryImages, ...extra]
    }
  }
  return event
}

export async function getOpenRetreats(): Promise<Event[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('retreats')
    .select('*')
    .in('status', ['open', 'coming-soon', 'last-spots', 'sold-out'])
    .order('sort_order', { ascending: true })

  if (error || !data) return []
  return data.map(rowToEvent)
}
