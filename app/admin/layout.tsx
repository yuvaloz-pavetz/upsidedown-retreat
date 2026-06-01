import type { Metadata } from 'next'
import './admin.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'UpsideDown Admin',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#0d1520', color: '#e2e8f0' }}>
        {children}
      </body>
    </html>
  )
}
