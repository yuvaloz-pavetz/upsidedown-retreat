'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

const PIXEL_ID = '430648098492875'

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void
    _fbq: unknown
  }
}

function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Capture fbclid from URL and persist for later CAPI calls
    const fbclid = searchParams.get('fbclid')
    if (fbclid) {
      const fbc = `fb.1.${Date.now()}.${fbclid}`
      try { sessionStorage.setItem('_fbc', fbc) } catch { /* ignore */ }
    }

    const eventId = crypto.randomUUID()
    const url = window.location.href
    let fired = false

    const fire = () => {
      if (fired) return
      fired = true
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView', {}, { eventID: eventId })
      }
      const fbc = getFbc()
      const fbp = getCookie('_fbp')
      void fetch('/api/meta/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_name: 'PageView', event_id: eventId, event_source_url: url, fbc, fbp }),
      })
    }

    // afterInteractive script may not have run yet — poll until fbq is ready
    const poll = setInterval(() => {
      if (typeof window.fbq === 'function') {
        clearInterval(poll)
        // 300ms extra for fbevents.js to set _fbp cookie after init
        setTimeout(fire, 300)
      }
    }, 50)

    // Fallback: send CAPI even if fbq never loads (blocked by ad blocker etc.)
    const fallback = setTimeout(() => {
      clearInterval(poll)
      fire()
    }, 2000)

    return () => {
      clearInterval(poll)
      clearTimeout(fallback)
    }
  }, [pathname, searchParams])

  return null
}

export default function MetaPixel() {
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${PIXEL_ID}');
      `}</Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  )
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1]
}

export function getFbc(): string | undefined {
  // Prefer browser cookie (set by Pixel JS), fall back to sessionStorage (captured from URL)
  return getCookie('_fbc') ?? (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('_fbc') ?? undefined : undefined)
}

export function trackEvent(eventName: string, params?: Record<string, unknown>, options?: { eventID?: string }) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, params ?? {}, options ?? {})
  }
}
