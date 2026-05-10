import { createClient } from '@/lib/supabase/server'
import type { Event } from '@/lib/events'
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
    pricingILS: row.pricing_ils,
    pricingEUR: row.pricing_eur,
    spotsRemaining: row.spots_remaining,
    spotsTotal: row.spots_total,
    heroImage: row.hero_image,
    galleryImages: row.gallery_images,
    description: { en: row.description_en, he: row.description_he },
    includes: { en: row.includes_en, he: row.includes_he },
  }
}

export async function getAllRetreats(): Promise<Event[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('retreats')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('year', { ascending: false })

  if (error || !data) return []
  return data.map(rowToEvent)
}

export async function getRetreatBySlug(slug: string): Promise<Event | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('retreats')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return rowToEvent(data)
}

export async function getOpenRetreats(): Promise<Event[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('retreats')
    .select('*')
    .in('status', ['open', 'coming-soon', 'last-spots'])
    .order('sort_order', { ascending: true })

  if (error || !data) return []
  return data.map(rowToEvent)
}
