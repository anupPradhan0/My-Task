import type { ReactNode } from 'react';

/** Stacks columns on phones; side-by-side (scrollable) from md up. */
export function BoardColumns({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-4 md:overflow-x-auto md:pb-2 md:-mx-1 md:px-1 items-stretch md:items-start">
      {children}
    </div>
  );
}

export function BoardColumn({ children }: { children: ReactNode }) {
  return (
    <div className="w-full md:w-80 md:shrink-0 rounded-2xl surface p-3.5 shadow-sm shadow-slate-900/5">
      {children}
    </div>
  );
}
