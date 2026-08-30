// Airport transfer schedule per retreat. Times are fixed group transfers
// (one van run each way), not per-person — configure here once known.

export interface TransferSchedule {
  airport: { en: string; he: string }
  arrivalDateTime: string   // ISO, pickup from the airport at retreat start
  departureDateTime: string // ISO, drop-off to the airport at retreat end
}

export const TRANSFER_SCHEDULE: Record<string, TransferSchedule> = {
  'crete-09-2026': {
    airport: { en: 'Heraklion Airport (HER)', he: 'שדה התעופה הרקליון' },
    arrivalDateTime: '2026-09-03T12:00:00+03:00',
    departureDateTime: '2026-09-08T12:00:00+03:00',
  },
}

export function getTransferSchedule(eventSlug: string): TransferSchedule | null {
  return TRANSFER_SCHEDULE[eventSlug] ?? null
}

export function arrivalRouteLabel(schedule: TransferSchedule, locale: string): string {
  return locale === 'he' ? `${schedule.airport.he} אל החווה` : `${schedule.airport.en} to the farm`
}

export function departureRouteLabel(schedule: TransferSchedule, locale: string): string {
  return locale === 'he' ? `מהחווה אל ${schedule.airport.he}` : `the farm to ${schedule.airport.en}`
}

// Venue-local (Crete/Athens) day, month and time — regardless of the
// server's own timezone. Without pinning this, Vercel's UTC runtime would
// render a 12:00+03:00 pickup as 09:00.
const TIMEZONE = 'Europe/Athens'

function dayMonthAthens(iso: string): { day: number; month: number } {
  const parts = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'numeric', timeZone: TIMEZONE }).formatToParts(new Date(iso))
  return {
    day: Number(parts.find(p => p.type === 'day')?.value),
    month: Number(parts.find(p => p.type === 'month')?.value),
  }
}

// "3/9 — Heraklion Airport (HER) to the farm — 12:00 noon" — date first, then
// the route, then the time, matching how the retreat actually talks about it.
export function formatTransferLegLine(iso: string, routeLabel: string, locale: string): string {
  const { day, month } = dayMonthAthens(iso)
  const timeStr = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TIMEZONE }).format(new Date(iso))
  const hour24 = Number(timeStr.split(':')[0])
  const noonSuffix = hour24 === 12 ? (locale === 'he' ? ' בצהריים' : ' noon') : ''
  const dateLabel = locale === 'he'
    ? `${day}/${month}`
    : `${day} ${new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: TIMEZONE }).format(new Date(iso))}`
  return `${dateLabel} — ${routeLabel} — ${timeStr}${noonSuffix}`
}

// Compact form used in admin listings, where a full sentence per leg is too much.
export function formatTransferDateTime(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'he' ? 'he-IL' : 'en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    timeZone: TIMEZONE,
  }).format(new Date(iso))
}

// A participant lead counts as "eligible" for the transfer form once their
// registration has reached one of these statuses. Mirrors ELIGIBLE_LEAD_STATUSES
// in tshirt-config.ts.
export const ELIGIBLE_LEAD_STATUSES = ['partially_paid', 'paid', 'past'] as const
