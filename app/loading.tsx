export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-[var(--line)]" />
          <div className="h-9 w-52 rounded-lg bg-[var(--line)]" />
          <div className="h-4 w-64 rounded bg-[var(--surface-2)]" />
        </div>
        <div className="h-10 w-28 rounded-xl bg-[var(--line)]" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="surface rounded-2xl p-5">
            <div className="mb-4 h-10 w-10 rounded-xl bg-[var(--surface-2)]" />
            <div className="h-4 w-24 rounded bg-[var(--surface-2)]" />
            <div className="mt-2 h-8 w-12 rounded bg-[var(--line)]" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="h-5 w-36 rounded bg-[var(--line)]" />
        <div className="flex gap-4 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-80 shrink-0 space-y-2.5 rounded-2xl surface p-3.5">
              <div className="mb-3 h-4 w-24 rounded bg-[var(--line)]" />
              {[0, 1, 2].map((j) => (
                <div key={j} className="h-16 rounded-xl border border-[var(--line)] bg-white" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
