import type { RetreatRow } from '@/lib/supabase/types'

export interface SEOIssue {
  severity: 'error' | 'warning' | 'info'
  message: string
  action: string
}

export interface RetreatSEOReport {
  slug: string
  title: string
  score: number
  issues: SEOIssue[]
}

export interface SiteCheckItem {
  label: string
  status: 'ok' | 'warning' | 'error'
  detail: string
}

export function analyzeRetreat(r: RetreatRow): RetreatSEOReport {
  const issues: SEOIssue[] = []
  let score = 100

  const enWords = r.description_en.trim().split(/\s+/).filter(Boolean).length
  if (enWords < 80) {
    issues.push({
      severity: enWords < 30 ? 'error' : 'warning',
      message: `English description: ${enWords} words`,
      action: 'Write at least 80 words — longer descriptions rank higher and convert better',
    })
    score -= enWords < 30 ? 20 : 10
  }

  const heWords = r.description_he.trim().split(/\s+/).filter(Boolean).length
  if (heWords < 40) {
    issues.push({
      severity: 'warning',
      message: `Hebrew description: ${heWords} words`,
      action: 'Add a full Hebrew description — the Israeli audience searches in Hebrew',
    })
    score -= 10
  }

  if (!r.hero_image) {
    issues.push({
      severity: 'error',
      message: 'No hero image',
      action: 'Required — this is the preview image on WhatsApp, Facebook, and Google',
    })
    score -= 20
  }

  if (r.gallery_images.length < 3) {
    issues.push({
      severity: 'info',
      message: `${r.gallery_images.length} gallery photo${r.gallery_images.length === 1 ? '' : 's'}`,
      action: 'Add 5+ photos — visual content increases time-on-page and lowers bounce rate',
    })
    score -= 5
  }

  if (r.includes_en.length < 4) {
    issues.push({
      severity: 'info',
      message: `${r.includes_en.length} items in "What's Included"`,
      action: 'List 5+ benefits — each item is a keyword and a conversion signal',
    })
    score -= 5
  }

  if (!r.pricing_ils && !r.pricing_eur) {
    issues.push({
      severity: 'warning',
      message: 'No pricing set',
      action: 'Price transparency reduces bounce rate and pre-qualifies leads',
    })
    score -= 10
  }

  if (!r.title_en || r.title_en.length < 15) {
    issues.push({
      severity: 'warning',
      message: `Short EN title (${r.title_en?.length ?? 0} chars)`,
      action: 'Use a descriptive title like "Crete Retreat 2025 — Handstands & Freediving"',
    })
    score -= 10
  }

  if (!r.slug || r.slug.length < 5) {
    issues.push({
      severity: 'error',
      message: 'Slug missing or too short',
      action: 'Use a keyword-rich slug like "crete-freediving-handstand-retreat-2025"',
    })
    score -= 15
  }

  if (r.spots_total === 0 || r.spots_remaining === r.spots_total) {
    issues.push({
      severity: 'info',
      message: 'Spots counter shows 0 filled',
      action: 'Update spots remaining as registrations come in — social proof boosts conversions',
    })
  }

  return {
    slug: r.slug,
    title: r.title_en || r.slug,
    score: Math.max(0, score),
    issues,
  }
}

export function getSiteChecks(): SiteCheckItem[] {
  return [
    {
      label: 'Meta title template',
      status: 'ok',
      detail: '"%s | The UpsideDown Retreat" — set in layout.tsx',
    },
    {
      label: 'Meta description',
      status: 'ok',
      detail: 'Global fallback description set in layout.tsx',
    },
    {
      label: 'Open Graph image',
      status: 'ok',
      detail: 'hero-bg.jpeg used as global OG fallback; retreat pages use hero image',
    },
    {
      label: 'Canonical URL base',
      status: 'ok',
      detail: 'metadataBase = https://upsidedownretreat.com — prevents duplicate content',
    },
    {
      label: 'Bilingual pages (EN + HE)',
      status: 'ok',
      detail: 'All pages available at /en/* and /he/*',
    },
    {
      label: 'hreflang tags',
      status: 'ok',
      detail: 'alternates.languages set on all pages — search engines serve correct locale',
    },
    {
      label: 'Sitemap.xml',
      status: 'ok',
      detail: 'Auto-generated at /sitemap.xml — includes all retreat pages in both locales',
    },
    {
      label: 'robots.txt',
      status: 'ok',
      detail: '/admin blocked from indexing; sitemap URL declared',
    },
    {
      label: 'Structured data (JSON-LD)',
      status: 'ok',
      detail: 'Event schema on retreat detail pages; Organization schema on homepage',
    },
    {
      label: 'Image alt text',
      status: 'ok',
      detail: 'next/image enforces alt on all images',
    },
    {
      label: 'Twitter / X cards',
      status: 'ok',
      detail: 'summary_large_image on retreat pages',
    },
  ]
}
