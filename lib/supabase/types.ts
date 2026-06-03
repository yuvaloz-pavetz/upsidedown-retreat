export type RetreatStatus = 'open' | 'sold-out' | 'coming-soon' | 'past' | 'last-spots'

export interface PricingTier {
  id: string
  name_en: string
  name_he: string
  description_en: string
  description_he: string
  price_ils: string
  price_eur: string
  spots: number | null
  photo: string
}

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
  pricing_ils: string | null
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
  venue_description_en?: string
  venue_description_he?: string
  venue_images?: string[]
  instagram_urls?: string[]
  instagram_urls_en?: string[]
  instagram_urls_he?: string[]
  who_for_en?: string
  who_for_he?: string
  tiers?: PricingTier[]
  early_bird_enabled?: boolean
  early_bird_discount_eur?: number | null
  early_bird_discount_ils?: number | null
  early_bird_spots?: number | null
  early_bird_deadline?: string | null
}

export type RetreatInsert = Omit<RetreatRow, 'id' | 'created_at' | 'updated_at'>
export type RetreatUpdate = Partial<RetreatInsert>

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  name_he: string
  role_he: string
  bio_he: string
  photo_url: string | null
  display_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export type TeamMemberInsert = Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>
export type TeamMemberUpdate = Partial<TeamMemberInsert>

export interface WaitlistEntry {
  id: string
  retreat_slug: string
  name: string
  email: string
  locale: string
  notified_at: string | null
  created_at: string
}

export type LeadStatus = 'interested' | 'partially_paid' | 'paid' | 'past' | 'irrelevant'

export type PaymentMethod = 'bank' | 'cash' | 'credit' | 'paypal' | 'other'

export interface Payment {
  id: string
  amount: string
  method: PaymentMethod
  paid: boolean
  receipt: boolean
  date: string
  notes: string
}

export type FreedivingLevel = 'basic_course' | 'advanced_course' | 'guided_training'

export interface Lead {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: LeadStatus
  amount: string
  event_slug: string
  locale: string
  notes: string
  receipt_issued: boolean
  payments: Payment[]
  currency: string
  created_at: string
  updated_at: string
  // Intake fields
  height?: number | null
  weight?: number | null
  shoe_size?: string | null
  has_dive_gear?: boolean | null
  gear_items?: string[] | null
  food_allergies?: string | null
  freediving_level?: FreedivingLevel | null
  intake_token?: string | null
  intake_submitted_at?: string | null
}

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'>
export type LeadUpdate = Partial<LeadInsert>

export type UserRole = 'admin' | 'member'

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  created_at: string
  updated_at: string
}

export type BudgetItemType = 'income' | 'expense'

export interface BudgetItem {
  id: string
  event_slug: string
  type: BudgetItemType
  description: string
  amount: number
  currency: string
  ils_amount: number | null
  notes: string
  created_at: string
}
