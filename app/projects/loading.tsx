export default function Loading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-20 rounded bg-[var(--surface-2)]" />
        <div className="h-7 w-28 rounded-lg bg-[var(--line)]" />
        <div className="h-4 w-56 rounded bg-[var(--surface-2)]" />
      </div>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="surface rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex justify-between gap-3">
              <div className="h-5 w-28 rounded bg-[var(--line)]" />
              <div className="h-5 w-14 rounded-md bg-[var(--surface-2)]" />
            </div>
            <div className="h-3 w-full rounded bg-[var(--surface-2)]" />
            <div className="h-3 w-3/4 rounded bg-[var(--surface-2)]" />
            <div className="pt-3 border-t border-[var(--line)] space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-16 rounded bg-[var(--surface-2)]" />
                <div className="h-3 w-10 rounded bg-[var(--line)]" />
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--surface-2)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
