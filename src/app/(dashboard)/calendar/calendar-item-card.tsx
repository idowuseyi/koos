"use client";

import { cn } from "@/lib/utils";
import type { CalendarItem } from "./types";

interface CalendarItemCardProps {
  item: CalendarItem;
  onSelect: (item: CalendarItem) => void;
  /** Compact variant used inside dense week columns. */
  compact?: boolean;
}

export function CalendarItemCard({
  item,
  onSelect,
  compact = false,
}: CalendarItemCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      aria-label={`Open ${item.title}`}
      className={cn(
        "group flex w-full flex-col gap-1 rounded-lg border border-[var(--border)] bg-surface-1 p-3 text-left transition-colors duration-150 hover:border-[var(--border-accent)] hover:bg-[rgba(19,139,200,0.06)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--accent-glow)]",
        compact && "p-2",
      )}
    >
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">
        {item.time && <span>{item.time}</span>}
        {item.time && <span aria-hidden="true">·</span>}
        <span>{item.platform}</span>
      </div>
      <p
        className={cn(
          "font-medium leading-snug text-foreground",
          compact ? "text-[13px] line-clamp-2" : "text-sm",
        )}
      >
        {item.title}
      </p>
      <span className="text-[12px] text-[var(--text-secondary)]">
        {item.contentType}
      </span>
      {item.designRequired && (
        <span className="mt-0.5 flex items-center gap-1.5 text-[12px] font-medium text-primary">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full bg-primary"
          />
          Design Required
        </span>
      )}
    </button>
  );
}
