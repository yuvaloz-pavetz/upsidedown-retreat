import type { Locale } from './i18n'

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
    pricingILS: '₪3,500',
    pricingEUR: '€890',
    spotsRemaining: 4,
    spotsTotal: 12,
    heroImage: '/images/retreat-session.jpg',
    galleryImages: [
      '/images/above-surface.jpg',
      '/images/below-surface.jpeg',
      '/images/below-surface-2.jpeg',
      '/images/class-session.jpg',
      '/images/shipwreck.jpeg',
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

export function getEventBySlug(slug: string): Event | undefined {
  return events.find((e) => e.slug === slug)
}

export function getOpenEvents(): Event[] {
  return events.filter((e) => e.status === 'open' || e.status === 'coming-soon')
}
