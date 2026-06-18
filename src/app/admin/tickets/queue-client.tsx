"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { TicketStatusBadge } from "@/app/(dashboard)/design-request/ticket-status-badge";
import { Button } from "@/components/ui/button";
import { formatTicketNumber } from "@/lib/design/ticket";
import type { TicketStatus } from "@/lib/design/tickets-ui";

export interface QueueRow {
  id: string;
  ticketNumber: number;
  designType: string;
  dimensions: string | null;
  slides: number | null;
  brief: string;
  status: TicketStatus;
  brandName: string | null;
  campaignName: string | null;
  itemTitle: string | null;
  dueDate: string | null;
}

function formatDate(iso: string | null): string {
  if (!iso) return "No due date";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function QueueClient({ queue }: { queue: QueueRow[] }) {
  if (queue.length === 0) {
    return (
      <p className="rounded-xl border border-[var(--border)] bg-surface-1 px-6 py-12 text-center text-[14px] text-[var(--text-secondary)]">
        The queue is empty. Nice work.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {queue.map((row) => (
        <QueueItem key={row.id} row={row} />
      ))}
    </ul>
  );
}

function QueueItem({ row }: { row: QueueRow }) {
  const router = useRouter();
  const fileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function action(label: string, run: () => Promise<Response>) {
    if (pending) return;
    setPending(label);
    setError(null);
    try {
      const res = await run();
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(data?.error ?? "Action failed. Please try again.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(null);
    }
  }

  const claim = () =>
    action("claim", () =>
      fetch(`/api/admin/tickets/${row.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim: true }),
      }),
    );

  const start = () =>
    action("start", () =>
      fetch(`/api/admin/tickets/${row.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in_progress" }),
      }),
    );

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const form = new FormData();
    for (const f of Array.from(files)) form.append("files", f);
    action("upload", () =>
      fetch(`/api/admin/tickets/${row.id}/deliverables`, {
        method: "POST",
        body: form,
      }),
    ).finally(() => {
      if (fileRef.current) fileRef.current.value = "";
    });
  }

  return (
    <li className="rounded-xl border border-[var(--border)] bg-surface-1 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[var(--text-muted)]">
            {formatTicketNumber(row.ticketNumber)}
          </span>
          <TicketStatusBadge status={row.status} />
        </div>
        <span className="text-[12px] text-[var(--text-muted)]">
          Due {formatDate(row.dueDate)}
        </span>
      </div>

      <div className="mt-2 space-y-0.5">
        <p className="text-[14px] font-medium text-foreground">
          {row.designType}
          {row.dimensions ? ` · ${row.dimensions}` : ""}
          {row.slides ? ` · ${row.slides} slides` : ""}
        </p>
        <p className="text-[13px] text-[var(--text-secondary)]">
          {row.brandName ?? "—"}
          {row.campaignName ? ` · ${row.campaignName}` : ""}
          {row.itemTitle ? ` · ${row.itemTitle}` : ""}
        </p>
        <p className="line-clamp-2 text-[13px] text-[var(--text-muted)]">
          {row.brief}
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-[13px] text-[#d47575]">
          {error}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          variant="secondary"
          size="lg"
          disabled={pending !== null}
          onClick={claim}
        >
          {pending === "claim" ? "Claiming…" : "Claim"}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          disabled={pending !== null}
          onClick={start}
        >
          {pending === "start" ? "Starting…" : "Start"}
        </Button>
        <label
          htmlFor={fileId}
          className="inline-flex h-9 cursor-pointer items-center rounded-[10px] border border-[var(--border-accent)] px-2.5 text-[13px] font-semibold text-foreground hover:bg-[rgba(19,139,200,0.08)] aria-disabled:pointer-events-none aria-disabled:opacity-50"
          aria-disabled={pending !== null}
        >
          {pending === "upload" ? "Uploading…" : "Upload deliverables"}
        </label>
        <input
          id={fileId}
          ref={fileRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.webp,.pdf,.zip"
          disabled={pending !== null}
          onChange={onFiles}
          className="sr-only"
        />
      </div>
    </li>
  );
}
