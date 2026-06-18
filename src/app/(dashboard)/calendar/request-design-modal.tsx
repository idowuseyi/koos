"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatTicketNumber } from "@/lib/design/ticket";
import { defaultDueDate, isCarouselType } from "@/lib/design/tickets-ui";
import type { BrandSummary, CalendarItem } from "./types";

interface RequestDesignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: CalendarItem | null;
  brand: BrandSummary | null;
  campaignName: string | null;
}

interface CreatedTicket {
  ticketNumber: number;
  designType: string;
  slides: number | null;
  dueDate: string | null;
}

function formatDueDate(iso: string | null): string {
  if (!iso) return "No due date";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="inline-block h-6 w-6 rounded-full ring-1 ring-[var(--border)]"
        style={{ backgroundColor: color }}
      />
      <span className="text-[13px] text-[var(--text-secondary)]">
        {label}: {color}
      </span>
    </div>
  );
}

export function RequestDesignModal({
  open,
  onOpenChange,
  item,
  brand,
  campaignName,
}: RequestDesignModalProps) {
  const router = useRouter();

  const [designType, setDesignType] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [slides, setSlides] = useState("");
  const [brief, setBrief] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedTicket | null>(null);

  // Prefill the form whenever a new item opens the modal.
  useEffect(() => {
    if (!open || !item) return;
    setDesignType(item.designType ?? "");
    setDimensions(item.dimensions ?? "");
    setSlides("");
    setBrief(item.brief ?? "");
    setNotes("");
    setDueDate(defaultDueDate(item.date));
    setError(null);
    setCreated(null);
    setSubmitting(false);
  }, [open, item]);

  async function handleSubmit() {
    if (!item || !brand || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/design-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId: brand.id,
          calendarItemId: item.id,
          designType: designType.trim(),
          dimensions: dimensions.trim() || null,
          slides: isCarouselType(designType) && slides ? Number(slides) : null,
          brief: brief.trim() || item.title,
          notes: notes.trim() || null,
          dueDate: dueDate
            ? new Date(`${dueDate}T00:00:00Z`).toISOString()
            : null,
        }),
      });
      const data = (await res.json()) as
        | { ticket: CreatedTicket }
        | { error: string };
      if (!res.ok || !("ticket" in data)) {
        setError(
          ("error" in data && data.error) ||
            "Could not submit your request. Please try again.",
        );
        return;
      }
      setCreated(data.ticket);
      // Reflect the new "submitted" state on the calendar item.
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const submitDisabled = submitting || designType.trim().length === 0;
  const showSlides = isCarouselType(designType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto sm:max-w-lg">
        {created ? (
          // ── Confirmation screen (§5.9) ───────────────────────────────
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <CheckCircle2
              aria-hidden="true"
              className="h-12 w-12"
              style={{ color: "#97C459" }}
            />
            <div className="space-y-1">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Design request submitted!
              </h2>
              <p className="max-w-sm text-sm text-[var(--text-secondary)]">
                Your request has been assigned to the KO design team. You will
                receive a notification when it is ready.
              </p>
            </div>

            <div className="w-full space-y-1 rounded-xl border border-[var(--border)] bg-surface-1 p-4 text-left">
              <p className="text-[13px] text-[var(--text-muted)]">
                {formatTicketNumber(created.ticketNumber)}
              </p>
              <p className="text-sm font-medium text-foreground">
                {created.designType}
                {created.slides ? ` — ${created.slides} slides` : ""}
              </p>
              <p className="text-[13px] text-[var(--text-secondary)]">
                Due by: {formatDueDate(created.dueDate)}
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <Link href="/design-request" className="flex-1">
                <Button variant="secondary" size="lg" className="w-full">
                  View My Tickets
                </Button>
              </Link>
              <Button
                variant="default"
                size="lg"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Back to Calendar
              </Button>
            </div>

            {/* Billing stub (design spec §8) — not yet implemented. */}
            <Button
              variant="ghost"
              size="lg"
              disabled
              className="w-full"
              title="Invoicing is coming soon"
            >
              Get Invoice
            </Button>
          </div>
        ) : (
          // ── Request form (§5.8) ──────────────────────────────────────
          <>
            <DialogHeader className="pr-8">
              <DialogTitle className="text-xl">Request Design</DialogTitle>
              <DialogDescription>
                A KO designer will create this for you. Expected delivery: 24–48
                hours.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 flex flex-col gap-4">
              {/* Read-only context */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                    Campaign
                  </Label>
                  <p className="inline-flex rounded-md bg-surface-1 px-2.5 py-1 text-[13px] text-[var(--text-secondary)]">
                    {campaignName ?? "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] uppercase tracking-widest text-[var(--text-muted)]">
                    Content
                  </Label>
                  <p className="text-[13px] text-[var(--text-secondary)]">
                    {item?.title ?? "—"}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="rd-type">
                    Design Type <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="rd-type"
                    value={designType}
                    disabled={submitting}
                    onChange={(e) => setDesignType(e.target.value)}
                    placeholder="e.g. Instagram Post"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rd-dim">Dimensions</Label>
                  <Input
                    id="rd-dim"
                    value={dimensions}
                    disabled={submitting}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g. 1080x1080"
                  />
                </div>
              </div>

              {showSlides && (
                <div className="space-y-1.5">
                  <Label htmlFor="rd-slides">Number of Slides</Label>
                  <Input
                    id="rd-slides"
                    type="number"
                    min={2}
                    max={10}
                    value={slides}
                    disabled={submitting}
                    onChange={(e) => setSlides(e.target.value)}
                    placeholder="2–10"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="rd-brief">Design Brief</Label>
                <Textarea
                  id="rd-brief"
                  value={brief}
                  disabled={submitting}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Describe what you need..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Brand assets */}
              {brand && (
                <div className="space-y-2 rounded-xl border border-[var(--border)] p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                    Your Brand Assets
                  </p>
                  <div className="flex items-center gap-3">
                    {brand.logoUrl ? (
                      // biome-ignore lint/performance/noImgElement: arbitrary external/R2 logo URL, not optimizable by next/image
                      <img
                        src={brand.logoUrl}
                        alt={`${brand.name} logo`}
                        className="h-16 w-16 rounded-lg object-contain ring-1 ring-[var(--border)]"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-[11px] text-[var(--text-muted)]">
                        No logo
                      </div>
                    )}
                    <Link
                      href="/brand"
                      className="text-[13px] text-primary hover:underline"
                    >
                      Replace in Brand Settings
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-1">
                    {brand.primaryColor && (
                      <Swatch color={brand.primaryColor} label="Primary" />
                    )}
                    {brand.secondaryColor && (
                      <Swatch color={brand.secondaryColor} label="Secondary" />
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="rd-notes">Extra Notes</Label>
                <Textarea
                  id="rd-notes"
                  value={notes}
                  disabled={submitting}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific direction? Style preferences, reference links, things to avoid..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rd-due">When do you need this by?</Label>
                <Input
                  id="rd-due"
                  type="date"
                  value={dueDate}
                  disabled={submitting}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              {error && (
                <p role="alert" className="text-[13px] text-[#d47575]">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-[var(--border)] pt-4 sm:flex-row sm:justify-end">
              <DialogClose
                render={<Button variant="secondary" size="lg" />}
                disabled={submitting}
              >
                Cancel
              </DialogClose>
              <Button
                variant="default"
                size="lg"
                disabled={submitDisabled}
                onClick={handleSubmit}
              >
                {submitting ? "Submitting…" : "Submit Request"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
