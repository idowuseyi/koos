// Pure helpers for the dashboard overview. UTC date-only to match storage.

const DAY_MS = 24 * 60 * 60 * 1000;

export type TicketStatus =
  | "submitted"
  | "assigned"
  | "in_progress"
  | "ready_for_review"
  | "delivered"
  | "revision_requested";

/** A ticket is "open" until it has been delivered. */
export function isOpenTicket(status: TicketStatus): boolean {
  return status !== "delivered";
}

export function ticketCounts(tickets: { status: TicketStatus }[]): {
  open: number;
  delivered: number;
  total: number;
} {
  let open = 0;
  let delivered = 0;
  for (const t of tickets) {
    if (t.status === "delivered") delivered++;
    else open++;
  }
  return { open, delivered, total: tickets.length };
}

function utcMidnight(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

/**
 * Items dated within [today, today + days), sorted ascending. Used for the
 * dashboard's "upcoming" list and its count.
 */
export function upcomingItems<T extends { date: Date }>(
  items: T[],
  now: Date,
  days = 7,
): T[] {
  const start = utcMidnight(now).getTime();
  const end = start + days * DAY_MS;
  return items
    .filter((it) => {
      const t = it.date.getTime();
      return t >= start && t < end;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
