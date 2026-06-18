export default function DesignRequestLoading() {
  return (
    <div
      className="mx-auto flex max-w-3xl flex-col gap-6"
      role="status"
      aria-busy="true"
      aria-label="Loading design tickets"
    >
      <div className="space-y-2">
        <div className="h-7 w-52 animate-pulse rounded-md bg-surface-2" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-surface-2" />
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 animate-pulse rounded-xl bg-surface-2 ring-1 ring-foreground/10"
          />
        ))}
      </div>
    </div>
  );
}
