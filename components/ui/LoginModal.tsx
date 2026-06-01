'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import type { Locale } from '@/lib/i18n'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  locale: Locale
}

const copy = {
  en: {
    title: 'Welcome Back',
    subtitle: 'Sign in to your account',
    email: 'Email',
    password: 'Password',
    submit: 'Sign In',
    submitting: 'Signing in…',
    errorInvalid: 'Incorrect email or password.',
    errorGeneric: 'Something went wrong. Please try again.',
  },
  he: {
    title: 'ברוכים הבאים',
    subtitle: 'כניסה לאיזור האישי',
    email: 'אימייל',
    password: 'סיסמא',
    submit: 'כניסה',
    submitting: 'מתחבר…',
    errorInvalid: 'אימייל או סיסמא שגויים.',
    errorGeneric: 'משהו השתבש. נסו שוב.',
  },
}

const ease = [0.16, 1, 0.3, 1] as const

export default function LoginModal({ open, onClose, locale }: LoginModalProps) {
  const t = copy[locale]
  const isHe = locale === 'he'
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.status === 400 ? t.errorInvalid : t.errorGeneric)
      setLoading(false)
      return
    }
    const { data: profile } = await supabase.from('profiles').select('role').single()
    const isAdmin = profile?.role === 'admin'
    onClose()
    router.push(isAdmin ? '/admin' : '/my')
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.7rem 0.9rem',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(232,213,183,0.45)',
    borderRadius: '4px',
    color: '#E8D5B7',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    direction: 'ltr',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(5,11,20,0.82)', backdropFilter: 'blur(10px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
        >
          <motion.div
            initial={{ y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease }}
            onClick={e => e.stopPropagation()}
            dir={isHe ? 'rtl' : 'ltr'}
            style={{ background: '#0d1e2d', border: '1px solid rgba(232,213,183,0.1)', borderRadius: '8px', padding: '2.5rem', maxWidth: '400px', width: '100%', position: 'relative' }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'rgba(232,213,183,0.85)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1, padding: '0.25rem 0.5rem', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8D5B7')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,213,183,0.85)')}
            >×</button>

            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: '1.9rem', fontWeight: 300, fontStyle: 'italic', color: '#E8D5B7', marginBottom: '0.25rem' }}>
              {t.title}
            </h2>
            <p style={{ fontSize: '13px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(232,213,183,0.78)', marginBottom: '2rem', fontWeight: 600 }}>
              {t.subtitle}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(232,213,183,0.85)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  {t.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(232,213,183,0.85)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  {t.password}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={inputStyle}
                />
              </div>

              {error && (
                <p style={{ fontSize: '0.8rem', color: '#f87171' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ marginTop: '0.5rem', padding: '0.85rem', background: loading ? 'rgba(212,168,83,0.5)' : '#D4A853', border: 'none', borderRadius: '4px', color: '#0d1520', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'default' : 'pointer', transition: 'background 0.2s' }}
              >
                {loading ? t.submitting : t.submit}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
