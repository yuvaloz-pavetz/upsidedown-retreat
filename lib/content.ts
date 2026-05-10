import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { i18n, type Locale } from '@/lib/i18n'

export type ContentMap = Record<string, string>

export const getSiteContentMap = cache(async (locale: Locale): Promise<ContentMap> => {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_content')
      .select('key, value')
      .eq('locale', locale)
    if (!data || data.length === 0) return {}
    return Object.fromEntries(data.map(r => [r.key as string, r.value as string]))
  } catch {
    return {}
  }
})

function g(map: ContentMap, key: string, fallback: string): string {
  return map[key] ?? fallback
}

export function buildI18n(locale: Locale, map: ContentMap) {
  const base = i18n[locale]
  return {
    ...base,
    hero: {
      ...base.hero,
      eyebrow: g(map, 'hero.eyebrow', base.hero.eyebrow),
      subtitle: g(map, 'hero.subtitle', base.hero.subtitle),
      cta: base.hero.cta,
    },
    experience: {
      ...base.experience,
      above: {
        eyebrow: g(map, 'experience.above.eyebrow', base.experience.above.eyebrow),
        heading: g(map, 'experience.above.heading', base.experience.above.heading),
        body: g(map, 'experience.above.body', base.experience.above.body),
      },
      below: {
        eyebrow: g(map, 'experience.below.eyebrow', base.experience.below.eyebrow),
        heading: g(map, 'experience.below.heading', base.experience.below.heading),
        body: g(map, 'experience.below.body', base.experience.below.body),
      },
    },
    testimonials: {
      ...base.testimonials,
      heading: g(map, 'testimonials.heading', base.testimonials.heading),
    },
    retreat: {
      ...base.retreat,
      cta: g(map, 'retreat.cta', base.retreat.cta),
      disclaimer: g(map, 'retreat.disclaimer', base.retreat.disclaimer),
    },
    instructors: {
      ...base.instructors,
      yuval: {
        ...base.instructors.yuval,
        bio: g(map, 'instructors.yuvalBio', base.instructors.yuval.bio),
      },
      gil: {
        ...base.instructors.gil,
        bio: g(map, 'instructors.gilBio', base.instructors.gil.bio),
      },
    },
    newsletter: {
      ...base.newsletter,
      heading: g(map, 'newsletter.heading', base.newsletter.heading),
      subtext: g(map, 'newsletter.subtext', base.newsletter.subtext),
    },
    events: {
      ...base.events,
      pageTitle: g(map, 'events.pageTitle', base.events.pageTitle),
      pageSubtext: g(map, 'events.pageSubtext', base.events.pageSubtext),
      noEvents: g(map, 'events.noEvents', base.events.noEvents),
    },
    gallery: { ...base.gallery },
    finalCta: { ...base.finalCta },
    footer: {
      ...base.footer,
      copyright: g(map, 'footer.copyright', base.footer.copyright),
    },
  }
}
