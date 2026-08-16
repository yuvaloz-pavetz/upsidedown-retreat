/**
 * Visitor country, resolved at the edge in middleware and mirrored into a
 * `country` cookie so both server and client code can read it.
 *
 * Used for two things:
 *   1. Hebrew is offered to Israeli visitors only.
 *   2. Israeli visitors are cleared in ILS through the Israeli terminal.
 */

export const ISRAEL = 'IL'

/** Client-side read of the country cookie. Returns '' before middleware ran. */
export function readCountry(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/(?:^|;\s*)country=([^;]*)/)
  return match ? decodeURIComponent(match[1]).toUpperCase() : ''
}

export function isIsrael(country: string | null | undefined): boolean {
  return (country ?? '').toUpperCase() === ISRAEL
}

/**
 * Server-side country from the request headers. Falls back to the cookie so it
 * also works in local dev, where Vercel's geo header is absent.
 */
export function countryFromRequest(req: {
  headers: { get(name: string): string | null }
  cookies?: { get(name: string): { value: string } | undefined }
}): string {
  const header = req.headers.get('x-vercel-ip-country')
  if (header) return header.toUpperCase()
  const cookie = req.cookies?.get('country')?.value
  if (cookie) return cookie.toUpperCase()
  const raw = req.headers.get('cookie') ?? ''
  const match = raw.match(/(?:^|;\s*)country=([^;]*)/)
  return match ? decodeURIComponent(match[1]).toUpperCase() : ''
}
