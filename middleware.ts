import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const LOCALES = ['en', 'he'] as const
const DEFAULT_LOCALE = 'en'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API, static files, Next.js internals
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
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

    if (user && pathname === '/admin/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/retreats'
      return NextResponse.redirect(url)
    }

    return response
  }

  // Already locale-prefixed — pass through
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
  if (hasLocale) return NextResponse.next()

  // Determine locale from cookie, then Accept-Language, then default
  const cookieLocale = request.cookies.get('locale')?.value
  let locale: string = DEFAULT_LOCALE

  if (cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)) {
    locale = cookieLocale
  } else {
    const acceptLang = request.headers.get('accept-language') ?? ''
    if (acceptLang.toLowerCase().includes('he')) locale = 'he'
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next|api|images|favicon.ico).*)'],
}
