export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 w-40 rounded-lg bg-[var(--line)]" />
        <div className="h-4 w-56 rounded bg-[var(--surface-2)]" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-2xl border border-[var(--line)] bg-white p-3 ${i === 0 ? 'col-span-2 min-h-[140px]' : 'min-h-[100px]'}`}
          >
            <div className="mb-3 flex justify-between">
              <div className="h-4 w-24 rounded bg-[var(--line)]" />
              <div className="h-4 w-6 rounded bg-[var(--surface-2)]" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-[var(--surface-2)]" />
              <div className="h-3 w-3/4 rounded bg-[var(--surface-2)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
