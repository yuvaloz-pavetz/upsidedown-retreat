import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const LOCALES = ['en', 'he'] as const
const DEFAULT_LOCALE = 'en'
const YEAR_SECONDS = 365 * 24 * 60 * 60

/**
 * Visitor country from the edge. Vercel sets `x-vercel-ip-country`; the local
 * dev server does not, so we fall back to a `country` override cookie
 * (set `country=IL` in devtools to test the Israeli experience locally).
 */
function detectCountry(request: NextRequest): string {
  return (
    request.headers.get('x-vercel-ip-country') ??
    request.cookies.get('country')?.value ??
    ''
  ).toUpperCase()
}

/** Mirrors the detected country into a readable cookie for client components. */
function withCountryCookie(response: NextResponse, country: string): NextResponse {
  if (country) {
    response.cookies.set('country', country, {
      path: '/',
      maxAge: YEAR_SECONDS,
      sameSite: 'lax',
    })
  }
  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const country = detectCountry(request)

  // Skip API, static files, Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/intake') ||
    /\.(.+)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  // Admin section: auth check, never locale-prefixed
  if (pathname.startsWith('/admin')) {
    const response = NextResponse.next()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && pathname !== '/admin/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    if (user) {
      // Check admin role. Falls back to allowing access if profiles table not yet migrated.
      let isAdmin = true
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (profile) isAdmin = profile.role === 'admin'
      } catch { /* profiles table may not exist yet — allow through */ }

      if (pathname === '/admin/login') {
        const url = request.nextUrl.clone()
        url.pathname = isAdmin ? '/admin/retreats' : '/'
        return NextResponse.redirect(url)
      }

      if (!isAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }

    return response
  }

  // Already locale-prefixed — pass through
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
  if (hasLocale) return withCountryCookie(NextResponse.next(), country)

  // Determine locale: explicit choice first, then geo. Hebrew is offered to
  // Israeli visitors only — everyone else lands on English.
  const cookieLocale = request.cookies.get('locale')?.value
  let locale: string = DEFAULT_LOCALE

  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    locale = cookieLocale
  } else if (country === 'IL') {
    locale = 'he'
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return withCountryCookie(NextResponse.redirect(url), country)
}

export const config = {
  matcher: ['/((?!_next|api|images|favicon.ico).*)'],
}
