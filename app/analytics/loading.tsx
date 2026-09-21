export default function Loading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-3 w-16 rounded bg-[var(--surface-2)]" />
        <div className="h-7 w-32 rounded-lg bg-[var(--line)]" />
        <div className="h-4 w-64 rounded bg-[var(--surface-2)]" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="surface rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="h-4 w-28 rounded bg-[var(--line)]" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-24 rounded bg-[var(--line)]" />
                <div className="h-4 w-12 rounded bg-[var(--surface-2)]" />
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--surface-2)]" />
            </div>
          ))}
        </div>
        <div className="surface rounded-2xl p-5 min-h-[200px] flex flex-col items-center justify-center gap-3">
          <div className="h-4 w-28 rounded bg-[var(--surface-2)]" />
          <div className="h-14 w-24 rounded-lg bg-[var(--line)]" />
          <div className="h-3 w-36 rounded bg-[var(--surface-2)]" />
        </div>
      </div>
    </div>
  );
}
