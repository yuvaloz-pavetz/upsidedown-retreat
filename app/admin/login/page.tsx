'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/retreats')
      router.refresh()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0d1520',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '22rem',
        padding: '2.5rem',
        background: '#111d2e',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '8px',
      }}>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          fontSize: '1.6rem',
          fontWeight: 300,
          color: '#D4A853',
          marginBottom: '0.25rem',
        }}>
          UpsideDown
        </h1>
        <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '2rem' }}>
          ADMIN
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ color: '#f87171', fontSize: '0.8rem' }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  letterSpacing: '0.08em',
  color: 'rgba(226,232,240,0.5)',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '4px',
  color: '#e2e8f0',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
  padding: '0.75rem',
  background: '#D4A853',
  border: 'none',
  borderRadius: '4px',
  color: '#0d1520',
  fontSize: '0.78rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  marginTop: '0.5rem',
}
