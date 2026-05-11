export type RetreatStatus = 'open' | 'sold-out' | 'coming-soon' | 'past' | 'last-spots'

export interface RetreatRow {
  id: string
  slug: string
  status: RetreatStatus
  title_en: string
  title_he: string
  location_en: string
  location_he: string
  dates_en: string
  dates_he: string
  year: number
  duration_en: string
  duration_he: string
  pricing_ils: string
  pricing_eur: string
  spots_remaining: number
  spots_total: number
  hero_image: string
  gallery_images: string[]
  description_en: string
  description_he: string
  includes_en: string[]
  includes_he: string[]
  sort_order: number
  created_at: string
  updated_at: string
}

export type RetreatInsert = Omit<RetreatRow, 'id' | 'created_at' | 'updated_at'>
export type RetreatUpdate = Partial<RetreatInsert>

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photo_url: string | null
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export type TeamMemberInsert = Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>
export type TeamMemberUpdate = Partial<TeamMemberInsert>
