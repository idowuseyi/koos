export default function CalendarLoading() {
  return (
    <div
      className="flex flex-col gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading calendar"
    >
      <div className="flex items-center justify-between">
        <div className="h-7 w-48 animate-pulse rounded-md bg-surface-2" />
        <div className="h-8 w-44 animate-pulse rounded-md bg-surface-2" />
      </div>
      <div className="h-[60vh] animate-pulse rounded-xl bg-surface-2 ring-1 ring-foreground/10" />
    </div>
  );
}
