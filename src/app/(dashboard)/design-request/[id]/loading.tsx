export default function TicketDetailLoading() {
  return (
    <div
      className="mx-auto flex max-w-3xl flex-col gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading ticket"
    >
      <div className="h-4 w-40 animate-pulse rounded-md bg-surface-2" />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-36 animate-pulse rounded-md bg-surface-2" />
          <div className="h-4 w-48 animate-pulse rounded-md bg-surface-2" />
        </div>
        <div className="h-6 w-24 animate-pulse rounded-full bg-surface-2" />
      </div>
      <div className="h-48 animate-pulse rounded-xl bg-surface-2 ring-1 ring-foreground/10" />
      <div className="h-32 animate-pulse rounded-xl bg-surface-2 ring-1 ring-foreground/10" />
    </div>
  );
}
