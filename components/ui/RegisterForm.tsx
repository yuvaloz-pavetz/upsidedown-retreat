'use client'

import { useState, useCallback, useId } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n'
import type { PricingTier } from '@/lib/events'
import { formatTierPrice } from '@/lib/events'

interface RegisterFormProps {
  eventSlug: string
  locale: Locale
  defaultAmount?: string
  tiers?: PricingTier[]
  defaultTierId?: string
}

const copy = {
  en: {
    eyebrow: 'Reserve My Spot',
    chooseRoom: 'Choose your room',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    phone: 'Phone (optional)',
    submit: 'Submit Registration',
    submitting: 'Sending...',
    welcomeBack: (name: string) => `Welcome back, ${name}`,
    success: "You're registered! We'll be in touch shortly.",
    error: 'Something went wrong. Please try again.',
    duplicate: "You're already registered for this event.",
    consentText: 'I agree to the storage and processing of my personal data in accordance with the',
    privacyPolicy: 'Privacy Policy',
  },
  he: {
    eyebrow: 'שמור לי מקום',
    chooseRoom: 'בחרו חדר',
    firstName: 'שם פרטי',
    lastName: 'שם משפחה',
    email: 'אימייל',
    phone: 'טלפון (אופציונלי)',
    submit: 'שלח הרשמה',
    submitting: 'שולח...',
    welcomeBack: (name: string) => `ברוך הבא, ${name}`,
    success: 'נרשמתם! ניצור קשר בקרוב.',
    error: 'משהו השתבש. נסו שוב.',
    duplicate: 'כבר נרשמתם לאירוע זה.',
    consentText: 'אני מסכים/ה לאחסון ועיבוד המידע האישי שלי בהתאם ל',
    privacyPolicy: 'מדיניות הפרטיות',
  },
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(232,213,183,0.45)',
  borderRadius: '4px',
  padding: '0.65rem 0.85rem',
  color: '#E8D5B7',
  fontSize: '1rem',
  width: '100%',
  fontFamily: 'inherit',
}

function tierPriceStr(tier: PricingTier, isHe: boolean): string {
  const useIls = isHe && !!tier.price_ils
  return formatTierPrice(useIls ? tier.price_ils : tier.price_eur, useIls)
}

export default function RegisterForm({ eventSlug, locale, defaultAmount = '', tiers, defaultTierId }: RegisterFormProps) {
  const t = copy[locale] ?? copy.en
  const isHe = locale === 'he'
  const uid = useId()

  const hasTiers = (tiers?.length ?? 0) > 1
  const [selectedTierId, setSelectedTierId] = useState<string | null>(defaultTierId ?? tiers?.[0]?.id ?? null)

  const selectedTier = tiers?.find(t => t.id === selectedTierId)
  const submissionAmount = selectedTier ? tierPriceStr(selectedTier, isHe) : defaultAmount
  const tierName = selectedTier ? (isHe ? selectedTier.name_he : selectedTier.name_en) : undefined

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [welcomeName, setWelcomeName] = useState<string | null>(null)
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')

  const checkEmail = useCallback(async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    try {
      const res = await fetch(`/api/register?email=${encodeURIComponent(email)}`)
      const json = await res.json() as { found: boolean; first_name?: string; last_name?: string; phone?: string }
      if (json.found) {
        if (json.first_name) setFirstName(json.first_name)
        if (json.last_name) setLastName(json.last_name)
        if (json.phone) setPhone(json.phone)
        setWelcomeName(json.first_name ?? null)
      }
    } catch { /* silent */ }
  }, [email])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName || !lastName || !email || !consent) return
    setFormStatus('loading')
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          event_slug: eventSlug,
          locale,
          default_amount: submissionAmount,
          tier_name: tierName,
        }),
      })
      const json = await res.json() as { ok?: boolean; duplicate?: boolean }
      if (json.duplicate) { setFormStatus('duplicate'); return }
      setFormStatus(res.ok && json.ok ? 'success' : 'error')
    } catch {
      setFormStatus('error')
    }
  }

  return (
    <div
      style={{ background: 'rgba(212,168,83,0.04)', border: '1px solid rgba(212,168,83,0.15)', borderRadius: '8px', padding: '1.75rem' }}
      dir={isHe ? 'rtl' : 'ltr'}
    >
      <p className="eyebrow" style={{ marginBottom: '1.25rem' }}>{t.eyebrow}</p>

      {formStatus === 'success' || formStatus === 'duplicate' ? (
        <motion.p
          initial={{ y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-body"
          style={{ fontSize: '0.95rem', color: '#D4A853', lineHeight: 1.65, fontWeight: 500 }}
        >
          {formStatus === 'duplicate' ? t.duplicate : t.success}
        </motion.p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {hasTiers && tiers && (
            <div style={{ marginBottom: '0.25rem' }}>
              <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>{t.chooseRoom}</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {tiers.map(tier => {
                  const isActive = tier.id === selectedTierId
                  const name = isHe ? tier.name_he : tier.name_en
                  const price = tierPriceStr(tier, isHe)
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTierId(tier.id)}
                      style={{
                        background: isActive ? 'rgba(212,168,83,0.12)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isActive ? 'rgba(212,168,83,0.5)' : 'rgba(232,213,183,0.12)'}`,
                        borderRadius: 4, padding: '0.45rem 0.75rem',
                        cursor: 'pointer', transition: 'all 0.18s',
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.05rem',
                      }}
                    >
                      <p style={{ fontSize: '13px', color: isActive ? '#E8D5B7' : 'rgba(232,213,183,0.85)', fontWeight: isActive ? 600 : 500, whiteSpace: 'nowrap' }}>{name}</p>
                      <p style={{ fontSize: '13px', color: '#D4A853', whiteSpace: 'nowrap', fontWeight: 600 }}>{price}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {welcomeName && (
            <motion.p
              initial={{ y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-body"
              style={{ fontSize: '0.875rem', color: '#D4A853', marginBottom: '0.1rem' }}
            >
              {t.welcomeBack(welcomeName)}
            </motion.p>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <div>
              <label htmlFor={`${uid}-fn`} className="sr-only">{t.firstName}</label>
              <input
                id={`${uid}-fn`}
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder={t.firstName}
                required
                className="font-body"
                style={inputStyle}
                dir={isHe ? 'rtl' : 'ltr'}
              />
            </div>
            <div>
              <label htmlFor={`${uid}-ln`} className="sr-only">{t.lastName}</label>
              <input
                id={`${uid}-ln`}
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder={t.lastName}
                required
                className="font-body"
                style={inputStyle}
                dir={isHe ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${uid}-email`} className="sr-only">{t.email}</label>
            <input
              id={`${uid}-email`}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={checkEmail}
              placeholder={t.email}
              required
              className="font-body"
              style={inputStyle}
              dir="ltr"
            />
          </div>
          <div>
            <label htmlFor={`${uid}-phone`} className="sr-only">{t.phone}</label>
            <input
              id={`${uid}-phone`}
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={t.phone}
              className="font-body"
              style={inputStyle}
              dir="ltr"
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              required
              style={{ marginTop: '2px', accentColor: '#D4A853', flexShrink: 0, width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '12px', color: 'rgba(232,213,183,0.7)', lineHeight: 1.5 }}>
              {t.consentText}{' '}
              <Link href={`/${locale}/privacy`} style={{ color: '#D4A853', textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                {t.privacyPolicy}
              </Link>.
            </span>
          </label>

          <motion.button
            type="submit"
            disabled={formStatus === 'loading' || !consent}
            whileHover={formStatus !== 'loading' && consent ? { scale: 1.01 } : {}}
            whileTap={formStatus !== 'loading' && consent ? { scale: 0.98 } : {}}
            className="btn-solid-gold"
            style={{ justifyContent: 'center', width: '100%', borderRadius: '4px', padding: '0.85rem 1.5rem', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.25rem', cursor: consent ? 'pointer' : 'not-allowed', opacity: consent ? 1 : 0.5 }}
          >
            {formStatus === 'loading' ? t.submitting : t.submit}
          </motion.button>
          {formStatus === 'error' && (
            <p className="font-body" style={{ fontSize: '14px', color: '#FF8C5A', textAlign: 'center', fontWeight: 500 }}>{t.error}</p>
          )}
        </form>
      )}
    </div>
  )
}
