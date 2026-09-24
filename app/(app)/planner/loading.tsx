export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-44 rounded-lg bg-[var(--line)]" />
        <div className="h-4 w-52 rounded bg-[var(--surface-2)]" />
      </div>
      <div className="rounded-2xl border border-[var(--line)] bg-white p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-36 rounded bg-[var(--line)]" />
          <div className="h-4 w-16 rounded bg-[var(--surface-2)]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)]/40 p-3 space-y-2">
              <div className="h-4 w-28 rounded bg-[var(--line)]" />
              <div className="h-3 w-full rounded bg-white" />
              <div className="h-3 w-3/4 rounded bg-white" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
