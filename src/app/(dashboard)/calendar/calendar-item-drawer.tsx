"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/calendar/labels";
import type { CalendarItem } from "./types";
import { statusLabel } from "./types";

interface CalendarItemDrawerProps {
  item: CalendarItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Whether this item already has a design ticket. */
  submitted: boolean;
  /** Open the prefilled Request Design modal for this item. */
  onRequestDesign: () => void;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
        {label}
      </p>
      <div className="text-sm leading-relaxed text-[var(--text-secondary)]">
        {children}
      </div>
    </div>
  );
}

export function CalendarItemDrawer({
  item,
  open,
  onOpenChange,
  submitted,
  onRequestDesign,
}: CalendarItemDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto data-[side=right]:sm:max-w-md"
      >
        {item && (
          <>
            <SheetHeader className="pr-10">
              <SheetTitle className="text-lg">{item.title}</SheetTitle>
              <SheetDescription>
                {formatDateTime(item.date, item.time)}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-5 px-4 pb-4">
              <Field label="Platform">{item.platform}</Field>
              <Field label="Content Type">{item.contentType}</Field>
              {item.brief && (
                <Field label="Caption / Brief">
                  <p className="whitespace-pre-wrap">{item.brief}</p>
                </Field>
              )}
              <Field label="Design Required">
                {item.designRequired ? (
                  <span className="flex items-center gap-1.5 font-medium text-primary">
                    <span
                      aria-hidden="true"
                      className="inline-block h-2 w-2 rounded-full bg-primary"
                    />
                    Yes
                    {item.designType ? ` — ${item.designType}` : ""}
                    {item.dimensions ? ` (${item.dimensions})` : ""}
                  </span>
                ) : (
                  "No"
                )}
                {submitted && (
                  <span className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-[#97C459]">
                    <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                    Design Ticket Submitted
                  </span>
                )}
              </Field>
              <Field label="Status">
                <StatusBadge status={item.status}>
                  {statusLabel(item.status)}
                </StatusBadge>
              </Field>
            </div>

            <SheetFooter className="flex-row justify-end gap-2 border-t border-[var(--border)]">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              {submitted ? (
                <Button variant="secondary" size="lg" disabled>
                  Design Ticket Submitted
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="lg"
                  onClick={onRequestDesign}
                  disabled={!item.designRequired}
                >
                  Request Design
                </Button>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
