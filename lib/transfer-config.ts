// Airport transfer schedule per retreat. Times are fixed group transfers
// (one van run each way), not per-person — configure here once known.

export interface TransferSchedule {
  airport: string
  arrivalDateTime: string   // ISO, pickup from the airport at retreat start
  departureDateTime: string // ISO, drop-off to the airport at retreat end
}

export const TRANSFER_SCHEDULE: Record<string, TransferSchedule> = {
  'crete-09-2026': {
    airport: 'Heraklion Airport (HER)',
    arrivalDateTime: '2026-09-03T12:00:00+03:00',
    departureDateTime: '2026-09-08T12:00:00+03:00',
  },
}

export function getTransferSchedule(eventSlug: string): TransferSchedule | null {
  return TRANSFER_SCHEDULE[eventSlug] ?? null
}

export function formatTransferDateTime(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'he' ? 'he-IL' : 'en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

// A participant lead counts as "eligible" for the transfer form once their
// registration has reached one of these statuses. Mirrors ELIGIBLE_LEAD_STATUSES
// in tshirt-config.ts.
export const ELIGIBLE_LEAD_STATUSES = ['partially_paid', 'paid', 'past'] as const
