import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Image as ImageIcon,
  Sparkles,
  Store,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { requireBrand } from "@/lib/auth/require-brand";
import {
  type TicketStatus,
  ticketCounts,
  upcomingItems,
} from "@/lib/dashboard/summary";
import {
  getActiveCalendarForBrand,
  getBrandsByUserId,
  getCalendarItems,
  getDesignTicketsByUser,
  getStrategiesByBrand,
} from "@/lib/db/queries";
import { formatTicketNumber } from "@/lib/design/ticket";
import { TicketStatusBadge } from "../design-request/ticket-status-badge";

function formatUtcDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

const quickActions = [
  { label: "Strategy", icon: Sparkles, href: "/strategy" },
  { label: "Calendar", icon: CalendarDays, href: "/calendar" },
  { label: "Brand", icon: Store, href: "/brand" },
];

export default async function DashboardPage() {
  const { dbUser, brand } = await requireBrand();

  const [brands, strategies, calendar, ticketRows] = await Promise.all([
    getBrandsByUserId(dbUser.id),
    getStrategiesByBrand(brand.id),
    getActiveCalendarForBrand(brand.id),
    getDesignTicketsByUser(dbUser.id),
  ]);

  const items = calendar ? await getCalendarItems(calendar.id) : [];

  const now = new Date();
  const upcoming = upcomingItems(items, now, 7);
  const tickets = ticketRows.map((r) => ({
    ...r.ticket,
    status: r.ticket.status as TicketStatus,
  }));
  const counts = ticketCounts(tickets);

  const firstName = dbUser.firstName ?? "there";
  const recentTickets = tickets.slice(0, 5);
  const upcomingTop = upcoming.slice(0, 5);
  const isBrandNew =
    strategies.length === 0 && !calendar && tickets.length === 0;

  const stats = [
    { label: "Brands", value: brands.length, icon: Store },
    { label: "Upcoming (7d)", value: upcoming.length, icon: CalendarDays },
    { label: "Open tickets", value: counts.open, icon: ClipboardList },
    { label: "Delivered", value: counts.delivered, icon: CheckCircle2 },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header className="space-y-1">
        <h1 className="font-display text-[28px] font-bold text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="text-[15px] text-[var(--text-secondary)]">
          Here is what is happening across {brand.name}.
        </p>
      </header>

      {isBrandNew ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(19,139,200,0.2)] text-primary">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-lg font-bold text-foreground">
                Let us build your first content plan
              </h2>
              <p className="mx-auto max-w-md text-[14px] text-[var(--text-secondary)]">
                Generate a strategy to unlock your content calendar and design
                requests.
              </p>
            </div>
            <Link
              href="/strategy"
              className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-[var(--primary-hover)] focus-visible:ring-[3px] focus-visible:ring-[var(--accent-glow)] focus-visible:outline-none"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Generate your first strategy
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {/* Stat cards */}
      <section
        aria-label="Overview"
        className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(19,139,200,0.15)] text-primary">
                <stat.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="truncate text-[13px] text-[var(--text-secondary)]">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent design tickets */}
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-foreground">
                Recent design tickets
              </h2>
              <Link
                href="/design-request"
                className="text-[13px] font-medium text-primary hover:text-[var(--primary-hover)]"
              >
                View all
              </Link>
            </div>

            {recentTickets.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[var(--border)] px-4 py-8 text-center">
                <ImageIcon
                  className="h-6 w-6 text-[var(--text-muted)]"
                  aria-hidden="true"
                />
                <p className="text-[14px] text-[var(--text-secondary)]">
                  No design requests yet
                </p>
                <Link
                  href="/calendar"
                  className="text-[13px] font-medium text-primary hover:text-[var(--primary-hover)]"
                >
                  Request one from the calendar
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col gap-1">
                {recentTickets.map((ticket) => (
                  <li key={ticket.id}>
                    <Link
                      href={`/design-request/${ticket.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[rgba(255,255,255,0.04)] focus-visible:ring-[3px] focus-visible:ring-[var(--accent-glow)] focus-visible:outline-none"
                    >
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-foreground">
                          {formatTicketNumber(ticket.ticketNumber)}
                        </p>
                        <p className="truncate text-[13px] text-[var(--text-secondary)]">
                          {ticket.designType}
                        </p>
                      </div>
                      <TicketStatusBadge status={ticket.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Upcoming content */}
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-foreground">
                Upcoming content
              </h2>
              <Link
                href="/calendar"
                className="text-[13px] font-medium text-primary hover:text-[var(--primary-hover)]"
              >
                View calendar
              </Link>
            </div>

            {upcomingTop.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[var(--border)] px-4 py-8 text-center">
                <CalendarDays
                  className="h-6 w-6 text-[var(--text-muted)]"
                  aria-hidden="true"
                />
                <p className="text-[14px] text-[var(--text-secondary)]">
                  Nothing scheduled in the next 7 days
                </p>
                <Link
                  href="/strategy"
                  className="text-[13px] font-medium text-primary hover:text-[var(--primary-hover)]"
                >
                  Generate your first calendar
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col gap-1">
                {upcomingTop.map((item) => (
                  <li key={item.id}>
                    <Link
                      href="/calendar"
                      className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[rgba(255,255,255,0.04)] focus-visible:ring-[3px] focus-visible:ring-[var(--accent-glow)] focus-visible:outline-none"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="truncate text-[13px] text-[var(--text-secondary)]">
                          {item.platform}
                        </p>
                      </div>
                      <span className="shrink-0 text-[13px] text-[var(--text-secondary)]">
                        {formatUtcDate(item.date)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <section aria-label="Quick actions">
        <h2 className="mb-3 font-display text-base font-bold text-foreground">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group flex items-center justify-between rounded-xl bg-surface-1 px-4 py-4 ring-1 ring-foreground/10 transition-colors hover:bg-surface-2 focus-visible:ring-[3px] focus-visible:ring-[var(--accent-glow)] focus-visible:outline-none"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(19,139,200,0.15)] text-primary">
                  <action.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-[14px] font-medium text-foreground">
                  {action.label}
                </span>
              </span>
              <ArrowRight
                className="h-4 w-4 text-[var(--text-muted)] transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
