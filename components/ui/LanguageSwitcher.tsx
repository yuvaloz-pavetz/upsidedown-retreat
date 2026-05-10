'use client'

import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import type { Locale } from '@/lib/i18n'

interface LanguageSwitcherProps {
  currentLocale: Locale
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(next: Locale) {
    if (next === currentLocale) return

    // Persist choice
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `locale=${next}; path=/; expires=${expires}; SameSite=Lax`

    // Replace locale segment: /en/events → /he/events
    const newPath = `/${next}${pathname.slice(currentLocale.length + 1)}`
    router.push(newPath)
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-full p-0.5"
      style={{ border: '1px solid rgba(232,213,183,0.15)' }}
    >
      {(['en', 'he'] as Locale[]).map((loc) => {
        const active = loc === currentLocale
        return (
          <motion.button
            key={loc}
            onClick={() => switchLocale(loc)}
            className="relative rounded-full px-2.5 py-1 font-body text-xs font-medium transition-colors duration-300"
            style={{
              letterSpacing: '0.06em',
              color: active ? '#0B1C2C' : 'rgba(232,213,183,0.5)',
              fontSize: '0.68rem',
            }}
            whileTap={{ scale: 0.95 }}
          >
            {active && (
              <motion.div
                layoutId="lang-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: '#D4A853' }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{loc.toUpperCase()}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
