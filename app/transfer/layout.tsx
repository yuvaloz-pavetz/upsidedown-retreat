import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Airport Transfer — UpsideDown Retreat',
  robots: 'noindex, nofollow',
}

export default function TransferLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
