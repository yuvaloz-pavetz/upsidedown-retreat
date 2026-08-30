'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavChild { href: string; label: string }
interface NavItem { href: string; label: string; children?: NavChild[] }

const navItems: NavItem[] = [
  {
    href: '/admin/retreats', label: 'Events', children: [
      { href: '/admin/crm', label: 'CRM' },
      { href: '/admin/customers', label: 'Waitlist' },
      { href: '/admin/budget', label: 'Budget' },
      { href: '/admin/equipment', label: 'Equipment' },
      { href: '/admin/tshirt', label: 'T-Shirts' },
      { href: '/admin/transfers', label: 'Transfers' },
    ],
  },
  {
    href: '/admin/content', label: 'Content', children: [
      { href: '/admin/seo', label: 'SEO' },
      { href: '/admin/team', label: 'Team' },
    ],
  },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/outreach', label: 'Outreach' },
]

function isItemActive(item: NavItem, pathname: string): boolean {
  return pathname.startsWith(item.href) || !!item.children?.some(c => pathname.startsWith(c.href))
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 16 16" fill="none"
      style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.18s', flexShrink: 0 }}
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  // Computed once on mount so a group the user manually opens doesn't
  // collapse again as they navigate among its own children.
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(
    navItems.filter(i => i.children && isItemActive(i, pathname)).map(i => i.href)
  ))

  function toggle(href: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(href)) next.delete(href)
      else next.add(href)
      return next
    })
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const flatForLabel = navItems.flatMap(i => (i.children?.length ? i.children : [i]))
  const currentLabel = flatForLabel.find(i => pathname.startsWith(i.href))?.label ?? 'Admin'

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop sidebar */}
      <aside className="admin-sidebar" style={{
        width: '220px', flexShrink: 0,
        background: '#090f1a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        padding: '1.75rem 0',
      }}>
        <div style={{ padding: '0 1.5rem', marginBottom: '2.5rem' }}>
          <Image
            src="/images/UpsideDown Retreat - LOGO.png"
            alt="UpsideDown Retreat"
            width={160} height={50}
            style={{ objectFit: 'contain', objectPosition: 'left center', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
          />
          <p style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.6rem', letterSpacing: '0.12em', marginTop: '0.3rem' }}>
            ADMIN
          </p>
        </div>
        <nav style={{ flex: 1, padding: '0 0.75rem' }}>
          {navItems.map(item => {
            const active = isItemActive(item, pathname)
            const isOpen = expanded.has(item.href)
            return (
              <div key={item.href} style={{ marginBottom: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Link href={item.href} style={{
                    flex: 1, display: 'block', padding: '0.6rem 0.75rem', borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: active ? '#e2e8f0' : 'rgba(226,232,240,0.45)',
                    background: active ? 'rgba(255,255,255,0.07)' : 'transparent',
                    textDecoration: 'none', transition: 'all 0.15s',
                  }}>
                    {item.label}
                  </Link>
                  {item.children && (
                    <button
                      onClick={() => toggle(item.href)}
                      aria-label={isOpen ? `Collapse ${item.label}` : `Expand ${item.label}`}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: active ? '#e2e8f0' : 'rgba(226,232,240,0.4)',
                        padding: '0.6rem', borderRadius: '6px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Chevron open={isOpen} />
                    </button>
                  )}
                </div>
                {item.children && isOpen && (
                  <div style={{ paddingLeft: '0.9rem', marginTop: '0.15rem' }}>
                    {item.children.map(child => {
                      const childActive = pathname.startsWith(child.href)
                      return (
                        <Link key={child.href} href={child.href} style={{
                          display: 'block', padding: '0.5rem 0.75rem', borderRadius: '6px',
                          fontSize: '0.8rem',
                          color: childActive ? '#D4A853' : 'rgba(226,232,240,0.4)',
                          background: childActive ? 'rgba(212,168,83,0.08)' : 'transparent',
                          textDecoration: 'none', marginBottom: '0.1rem', transition: 'all 0.15s',
                        }}>
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        <div style={{ padding: '0 1.5rem' }}>
          <button onClick={handleSignOut} style={{
            background: 'none', border: 'none',
            color: 'rgba(226,232,240,0.3)', fontSize: '0.75rem',
            cursor: 'pointer', padding: 0, letterSpacing: '0.04em',
          }}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="admin-mobile-bar">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(226,232,240,0.65)', fontSize: '1.2rem',
            padding: '6px 10px', lineHeight: 1, borderRadius: '6px',
          }}
        >
          ☰
        </button>
        <span style={{
          fontSize: '0.7rem', letterSpacing: '0.12em',
          color: 'rgba(226,232,240,0.32)', textTransform: 'uppercase',
        }}>
          {currentLabel}
        </span>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,10,0.55)',
              zIndex: 200,
            }}
          />
          {/* Drawer panel */}
          <div style={{
            position: 'fixed', left: 0, top: 0, bottom: 0,
            width: '260px',
            background: '#090f1a',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', flexDirection: 'column',
            zIndex: 201,
            overflowY: 'auto',
          }}>
            <div style={{
              padding: '1.4rem 1.25rem 1.1rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <Image
                  src="/images/UpsideDown Retreat - LOGO.png"
                  alt="UpsideDown Retreat"
                  width={130} height={40}
                  style={{ objectFit: 'contain', objectPosition: 'left center', filter: 'brightness(0) invert(1)', opacity: 0.85 }}
                />
                <p style={{ color: 'rgba(226,232,240,0.22)', fontSize: '0.55rem', letterSpacing: '0.14em', marginTop: '0.2rem' }}>
                  ADMIN
                </p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(226,232,240,0.35)', fontSize: '1.3rem',
                  padding: '4px 8px', lineHeight: 1, borderRadius: '4px',
                }}
              >
                ×
              </button>
            </div>

            <nav style={{ flex: 1, padding: '0.5rem 0' }}>
              {navItems.map(item => {
                const active = isItemActive(item, pathname)
                const isOpen = expanded.has(item.href)
                return (
                  <div key={item.href} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'stretch' }}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          flex: 1,
                          display: 'block',
                          padding: '0.85rem 1.25rem',
                          fontSize: '1rem',
                          color: active ? '#D4A853' : 'rgba(226,232,240,0.55)',
                          background: active ? 'rgba(212,168,83,0.07)' : 'transparent',
                          textDecoration: 'none',
                          fontWeight: active ? 500 : 400,
                          transition: 'all 0.15s',
                        }}
                      >
                        {item.label}
                      </Link>
                      {item.children && (
                        <button
                          onClick={() => toggle(item.href)}
                          aria-label={isOpen ? `Collapse ${item.label}` : `Expand ${item.label}`}
                          style={{
                            background: active ? 'rgba(212,168,83,0.07)' : 'transparent',
                            border: 'none', cursor: 'pointer',
                            color: active ? '#D4A853' : 'rgba(226,232,240,0.45)',
                            padding: '0 1.25rem',
                            minWidth: '44px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Chevron open={isOpen} />
                        </button>
                      )}
                    </div>
                    {item.children && isOpen && (
                      <div style={{ paddingBottom: '0.4rem' }}>
                        {item.children.map(child => {
                          const childActive = pathname.startsWith(child.href)
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMenuOpen(false)}
                              style={{
                                display: 'block',
                                padding: '0.7rem 1.25rem 0.7rem 2.5rem',
                                fontSize: '0.92rem',
                                color: childActive ? '#D4A853' : 'rgba(226,232,240,0.45)',
                                background: childActive ? 'rgba(212,168,83,0.05)' : 'transparent',
                                textDecoration: 'none',
                                fontWeight: childActive ? 500 : 400,
                              }}
                            >
                              {child.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button
                onClick={() => { setMenuOpen(false); void handleSignOut() }}
                style={{
                  background: 'none', border: 'none',
                  color: 'rgba(226,232,240,0.28)', fontSize: '0.8rem',
                  cursor: 'pointer', padding: 0, letterSpacing: '0.04em',
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main content */}
      <main className="admin-main" style={{ flex: 1, overflow: 'auto', padding: '2.5rem 3rem' }}>
        {children}
      </main>
    </div>
  )
}
