import { BoardColumn, BoardColumns } from '@/components/Board';

export default function Loading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-28 rounded bg-[var(--line)]" />
          <div className="h-8 w-40 sm:h-9 sm:w-52 rounded-lg bg-[var(--line)]" />
          <div className="h-4 w-48 sm:w-64 rounded bg-[var(--surface-2)]" />
        </div>
        <div className="hidden sm:block h-10 w-28 rounded-xl bg-[var(--line)]" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`surface rounded-2xl p-3.5 sm:p-5 ${i === 2 ? 'col-span-2 lg:col-span-1' : ''}`}>
            <div className="mb-4 h-9 w-9 rounded-xl bg-[var(--surface-2)]" />
            <div className="h-4 w-24 rounded bg-[var(--surface-2)]" />
            <div className="mt-2 h-7 w-12 rounded bg-[var(--line)]" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <div className="h-5 w-36 rounded bg-[var(--line)]" />
        <BoardColumns>
          {[0, 1, 2].map((i) => (
            <BoardColumn key={i}>
              <div className="mb-3 h-4 w-24 rounded bg-[var(--line)]" />
              <div className="space-y-2.5">
                {[0, 1].map((j) => (
                  <div key={j} className="h-16 rounded-xl border border-[var(--line)] bg-white" />
                ))}
              </div>
            </BoardColumn>
          ))}
        </BoardColumns>
      </div>
    </div>
  );
}
