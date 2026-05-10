'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import type { Locale } from '@/lib/i18n'

interface LocaleDetectorProps {
  currentLocale: Locale
}

export default function LocaleDetector({ currentLocale }: LocaleDetectorProps) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only run if no locale cookie set yet (first visit)
    const hasCookie = document.cookie.split(';').some((c) => c.trim().startsWith('locale='))
    if (hasCookie) return

    // Detect from timezone — most reliable for Israel detection
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const detectedLocale: Locale =
      tz === 'Asia/Jerusalem' || tz === 'Asia/Tel_Aviv' ? 'he' : 'en'

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
