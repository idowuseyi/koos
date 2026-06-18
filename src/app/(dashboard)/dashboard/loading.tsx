export default function DashboardLoading() {
  return (
    <div
      className="mx-auto flex max-w-5xl flex-col gap-8"
      role="status"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="space-y-2">
        <div className="h-7 w-64 animate-pulse rounded-md bg-surface-2" />
        <div className="h-4 w-80 animate-pulse rounded-md bg-surface-2" />
      </div>

      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl bg-surface-2 ring-1 ring-foreground/10"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="h-64 animate-pulse rounded-xl bg-surface-2 ring-1 ring-foreground/10"
          />
        ))}
      </div>
    </div>
  );
}
