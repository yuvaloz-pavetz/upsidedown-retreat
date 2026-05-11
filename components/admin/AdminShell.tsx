'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin/retreats', label: 'Retreats' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/seo', label: 'SEO' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '220px',
        flexShrink: 0,
        background: '#090f1a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.75rem 0',
      }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2.5rem' }}>
          <p style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: '1.3rem',
            fontWeight: 300,
            color: '#D4A853',
            marginBottom: '0.15rem',
          }}>
            UpsideDown
          </p>
          <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
            ADMIN
          </p>
        </div>

        <nav style={{ flex: 1, padding: '0 0.75rem' }}>
          {navItems.map(item => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'block',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  color: active ? '#e2e8f0' : 'rgba(226,232,240,0.45)',
                  background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                  textDecoration: 'none',
                  marginBottom: '0.2rem',
                  transition: 'all 0.15s',
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '0 1.5rem' }}>
          <button
            onClick={handleSignOut}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(226,232,240,0.3)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              padding: 0,
              letterSpacing: '0.04em',
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', padding: '2.5rem 3rem' }}>
        {children}
      </main>
    </div>
  )
}
