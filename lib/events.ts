import type { Locale } from './i18n'
import type { PricingTier } from './supabase/types'
export type { PricingTier }

export type EventStatus = 'open' | 'sold-out' | 'coming-soon' | 'past' | 'last-spots'

export type Event = {
  slug: string
  status: EventStatus
  title: Record<Locale, string>
  location: Record<Locale, string>
  dates: Record<Locale, string>
  year: number
  duration: Record<Locale, string>
  pricingILS: string
  pricingEUR: string
  spotsRemaining: number
  spotsTotal: number
  heroImage: string
  galleryImages: string[]
  description: Record<Locale, string>
  includes: Record<Locale, string[]>
  venueDescriptionEn?: string
  venueDescriptionHe?: string
  venueImages?: string[]
  instagramUrls?: string[]
  instagramUrlsEn?: string[]
  instagramUrlsHe?: string[]
  whoForEn?: string
  whoForHe?: string
  tiers?: PricingTier[]
  earlyBirdEnabled?: boolean
  earlyBirdDiscountEUR?: number | null
  earlyBirdDiscountILS?: number | null
  earlyBirdSpots?: number | null
  earlyBirdDeadline?: string | null
  earlyBirdActive?: boolean
  earlyBirdSpotsRemaining?: number
}

export const events: Event[] = [
  {
    slug: 'crete-june-2025',
    status: 'open',
    title: {
      en: 'Crete Retreat 2025',
      he: 'ריטריט כרתים 2025',
    },
    location: {
      en: 'Crete, Greece',
      he: 'כרתים, יוון',
    },
    dates: {
      en: 'June 14–21, 2025',
      he: '14–21 ביוני 2025',
    },
    year: 2025,
    duration: {
      en: '7 nights · 8 days',
      he: '7 לילות · 8 ימים',
    },
    pricingILS: '',
    pricingEUR: '€890',
    spotsRemaining: 4,
    spotsTotal: 12,
    heroImage: 'https://upsidedown-retreat.com/wp-content/uploads/2025/05/IMG_1592-scaled.jpg',
    galleryImages: [
      '/images/above-surface.jpg',
      '/images/below-surface.jpeg',
      '/images/below-surface-2.jpeg',
      '/images/class-session.jpg',
      '/images/shipwreck.jpeg',
      'https://upsidedown-retreat.com/wp-content/uploads/2025/05/Group-Handstands.jpeg',
      'https://upsidedown-retreat.com/wp-content/uploads/2025/05/IMG_1511-1-1024x695.jpg',
      'https://upsidedown-retreat.com/wp-content/uploads/2025/05/IMG_0964-698x1024.jpg',
      'https://upsidedown-retreat.com/wp-content/uploads/2025/05/IMG_0793-1-683x1024.jpg',
      'https://upsidedown-retreat.com/wp-content/uploads/2025/05/IMG_0990-683x1024.jpg',
      'https://upsidedown-retreat.com/wp-content/uploads/2025/05/53545888_634030393721762_3673921716557447168_n-819x1024.jpg',
      'https://upsidedown-retreat.com/wp-content/uploads/2024/01/AVI_6978-4-scaled.jpg',
    ],
    description: {
      en: `Eight days on the island of Crete. Mornings begin on the terrace with handstand practice as the sun rises over the Aegean. Afternoons descend into the Mediterranean — open water sessions, breath work, and the quiet of depth.

This is not a workshop. It is a container for transformation. You will leave with new skills, new friendships, and a relationship with your body and breath that you didn't know was possible.`,
      he: `שמונה ימים באי כרתים. הבקרים מתחילים על המרפסת עם אימון עמידות על ידיים כשהשמש עולה מעל האגאי. אחר הצהריים יורדים אל הים התיכון — אימונים במים פתוחים, עבודת נשימה, ושקט העומק.

זה לא סדנה. זהו מרחב לטרנספורמציה. תצאו עם כישורים חדשים, חברויות חדשות, ומערכת יחסים עם גופכם ונשימתכם שלא ידעתם שאפשרית.`,
    },
    includes: {
      en: [
        'Daily handstand training sessions',
        'Freediving theory, pool & open water',
        'Full board accommodation',
        'All dive equipment included',
        'Airport transfers',
      ],
      he: [
        'אימוני עמידות על ידיים יומיים',
        'תיאוריה, בריכה וצלילות בים פתוח',
        'לינה ואוכל מלאים',
        'ציוד צלילה כלול',
        'העברות לנמל התעופה',
      ],
    },
    venueDescriptionEn: `Terra Preveli is an off-grid eco-farm on a Cretan hillside, running entirely on solar power. Olive groves, wild herbs, and a stream that winds through the property and pools into natural swimming holes before reaching Preveli Lagoon — where freshwater meets the Mediterranean under a canopy of towering palms.

Accommodation is in eco-structures built into the landscape: geodesic domes, a hand-built mud house, and yurts. They're open to the breeze, simple in the best sense, and genuinely comfortable once you settle in. Bathrooms and showers are shared and well-maintained. There's no air conditioning — but at this altitude, the nights cool down on their own.

This is a place where mornings start with birdsong and the afternoons end at the stream. Where the absence of city noise becomes something you notice, then miss when you leave. It suits people who come for the experience, not the amenities — and leave with both.`,
    venueDescriptionHe: `טרה פרבלי היא חוות אקו אוף-דה-גריד על גבעה כרתית, שפועלת כולה על אנרגיה סולרית. עצי זית, עשבי בר, ונחל שעובר בשטח ויוצר בריכות שחייה טבעיות לפני שמגיע ללגונה של פרבלי — שם מים מתוקים פוגשים את הים התיכון מתחת לחופת עצי דקל.

הלינה היא במבנים אקולוגיים: דומים גאומטריים, בית בוץ בנוי ביד, ויורטים. הם פתוחים לרוח, פשוטים במובן הטוב, ומרגישים בבית אחרי שמסתדרים. שירותים ומקלחות משותפים ומתוחזקים. אין מיזוג אוויר — אבל בגובה הזה, הלילות מתקררים מעצמם.

זה מקום שבו הבוקר מתחיל בצפצופי ציפורים, ואחר הצהריים נגמר בנחל. שבו ההיעדר של רעש עירוני הופך למשהו שמרגישים, ואחר כך מתגעגעים אליו. מתאים לאנשים שמגיעים לחוויה, לא לנוחיות — ויוצאים עם שניהם.`,
    venueImages: [
      'https://terrapreveli.com/wp-content/uploads/2023/11/20230428_174002-scaled.jpg',
      'https://terrapreveli.com/wp-content/uploads/2023/05/20230430_125621.jpg',
      'https://terrapreveli.com/wp-content/uploads/2023/11/WhatsApp-Image-2023-11-03-at-09.18.42.jpeg',
      'https://terrapreveli.com/wp-content/uploads/2024/01/IMG_20200418_101748-scaled.jpeg',
      'https://terrapreveli.com/wp-content/uploads/2023/05/20230428_173741.jpg',
      'https://terrapreveli.com/wp-content/uploads/2024/03/20230430_100930.jpg',
      'https://terrapreveli.com/wp-content/uploads/2023/05/20230428_125046.jpg',
      'https://terrapreveli.com/wp-content/uploads/2023/05/20230428_130044.jpg',
      'https://terrapreveli.com/wp-content/uploads/2023/05/20230430_150647.jpg',
      'https://terrapreveli.com/wp-content/uploads/2023/05/20230430_151740.jpg',
      'https://terrapreveli.com/wp-content/uploads/2024/03/DSC02620.jpg',
      'https://terrapreveli.com/wp-content/uploads/2024/03/DSC02567.jpg',
      'https://terrapreveli.com/wp-content/uploads/2025/01/terrapreveli-1-scaled.jpg',
      'https://terrapreveli.com/wp-content/uploads/2025/01/terrapreveli-5-scaled.jpg',
    ],
  },
  {
    slug: 'red-sea-november-2025',
    status: 'coming-soon',
    title: {
      en: 'Red Sea Retreat 2025',
      he: 'ריטריט ים סוף 2025',
    },
    location: {
      en: 'Dahab, Egypt',
      he: 'דהב, מצרים',
    },
    dates: {
      en: 'November 2025',
      he: 'נובמבר 2025',
    },
    year: 2025,
    duration: {
      en: '6 nights · 7 days',
      he: '6 לילות · 7 ימים',
    },
    pricingILS: '₪2,900',
    pricingEUR: '€740',
    spotsRemaining: 12,
    spotsTotal: 12,
    heroImage: '/images/below-surface-2.jpeg',
    galleryImages: ['/images/below-surface.jpeg', '/images/shipwreck.jpeg'],
    description: {
      en: `Dahab — where the Red Sea meets the desert. Famous among freedivers for its incredible Blue Hole and warm, clear waters. A raw and breathtaking landscape for our second retreat of 2025.

Details coming soon. Register your interest to be notified first.`,
      he: `דהב — שם ים סוף נפגש עם המדבר. מפורסמת בקרב צוללים חופשיים בזכות החור הכחול המדהים ומימיה החמים והצלולים. נוף גולמי ומרהיב לריטריט השני שלנו ב-2025.

פרטים בקרוב. הרשמו לעדכון.`,
    },
    includes: {
      en: [
        'Daily handstand & yoga sessions',
        'Freediving training at the Blue Hole',
        'Accommodation in desert camp',
        'Daily breakfast & dinner',
        'Equipment provided',
      ],
      he: [
        'אימוני עמידות על ידיים ויוגה יומיים',
        'אימוני צלילה חופשית בחור הכחול',
        'לינה במחנה מדבר',
        'ארוחת בוקר וערב יומית',
        'ציוד כלול',
      ],
    },
  },
]

export function formatTierPrice(raw: string, isHe: boolean): string {
  if (!raw) return raw
  const hasSymbol = /^[₪€$£]/.test(raw)
  if (hasSymbol) return raw
  const symbol = isHe ? '₪' : '€'
  const num = parseFloat(raw.replace(/[^0-9.]/g, ''))
  if (isNaN(num)) return raw
  return `${symbol}${num.toLocaleString()}`
}

export function getEventPricing(event: Event, locale: string): { price: string; from: boolean } {
  const isHe = locale === 'he'
  const tiers = event.tiers ?? []

  const basePrice = (isHe && event.pricingILS) ? event.pricingILS : event.pricingEUR

  if (tiers.length <= 1) {
    return { price: basePrice, from: false }
  }

  const parsed = tiers
    .map(t => {
      const raw = (isHe && t.price_ils) ? t.price_ils : t.price_eur
      return { str: formatTierPrice(raw, isHe), num: parseFloat(raw.replace(/[^0-9.]/g, '')) }
    })
    .filter(p => !isNaN(p.num))

  if (!parsed.length) return { price: basePrice, from: false }

  const lowest = parsed.reduce((a, b) => (a.num < b.num ? a : b))
  return { price: lowest.str, from: true }
}

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug)
}

export function getOpenEvents(): Event[] {
  return events.filter((e) => e.status === 'open' || e.status === 'coming-soon')
}

export function getEarlyBirdPricing(event: Event, locale: Locale, basePriceStr?: string): {
  regular: string
  earlyBird: string
  saving: string
} | null {
  if (!event.earlyBirdActive || !event.earlyBirdEnabled) return null
  const isHe = locale === 'he'
  const useILS = isHe && !!event.pricingILS && !!event.earlyBirdDiscountILS
  if (useILS) {
    const base = basePriceStr || event.pricingILS!
    const regular = parseFloat(base.replace(/[^0-9.]/g, ''))
    const discount = Number(event.earlyBirdDiscountILS!)
    return {
      regular: base,
      earlyBird: `₪${Math.round(regular - discount).toLocaleString()}`,
      saving: `₪${discount.toLocaleString()}`,
    }
  }
  const base = basePriceStr || event.pricingEUR
  const discount = Number(event.earlyBirdDiscountEUR ?? 0)
  const regular = parseFloat(base.replace(/[^0-9.]/g, ''))
  return {
    regular: base,
    earlyBird: `€${Math.round(regular - discount).toLocaleString()}`,
    saving: `€${discount.toLocaleString()}`,
  }
}
