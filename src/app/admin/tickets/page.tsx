import { requireRole } from "@/lib/auth/require-role";
import { getDesignerQueue } from "@/lib/db/queries";
import type { TicketStatus } from "@/lib/design/tickets-ui";
import { QueueClient, type QueueRow } from "./queue-client";

export default async function AdminTicketsPage() {
  await requireRole(["designer", "admin"]);
  const rows = await getDesignerQueue();

  const queue: QueueRow[] = rows.map(
    ({ ticket, campaignName, itemTitle, brandName }) => ({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      designType: ticket.designType,
      dimensions: ticket.dimensions,
      slides: ticket.slides,
      brief: ticket.brief,
      status: ticket.status as TicketStatus,
      brandName: brandName ?? null,
      campaignName: campaignName ?? null,
      itemTitle: itemTitle ?? null,
      dueDate: ticket.dueDate ? ticket.dueDate.toISOString() : null,
    }),
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Design Queue
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Open tickets awaiting design work.
        </p>
      </header>
      <QueueClient queue={queue} />
    </div>
  );
}
