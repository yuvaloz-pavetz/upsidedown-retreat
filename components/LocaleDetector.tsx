'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import { readCountry } from '@/lib/geo'

interface LocaleDetectorProps {
  currentLocale: Locale
}

/**
 * Persists the visitor's locale on first visit. The choice itself is made in
 * middleware from the edge country header (IL → Hebrew, everyone else English);
 * this corrects the locale when a page was served before that ran.
 */
export default function LocaleDetector({ currentLocale }: LocaleDetectorProps) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only run if no locale cookie set yet (first visit)
    const hasCookie = document.cookie.split(';').some((c) => c.trim().startsWith('locale='))
    if (hasCookie) return

    const detectedLocale: Locale = readCountry() === 'IL' ? 'he' : 'en'

    // Persist detection for 1 year
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `locale=${detectedLocale}; path=/; expires=${expires}; SameSite=Lax`

    if (detectedLocale !== currentLocale) {
      // Swap locale segment in path: /en/foo → /he/foo
      const newPath = `/${detectedLocale}${pathname.slice(currentLocale.length + 1)}`
      router.replace(newPath)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
