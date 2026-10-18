export default function NotesLoading() {
  return (
    <div className="space-y-3 sm:space-y-5 animate-pulse" aria-busy="true">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 h-3 w-20 rounded bg-slate-200" />
          <div className="h-7 sm:h-8 w-28 sm:w-36 rounded-lg bg-slate-200" />
        </div>
        <div className="h-11 w-11 sm:h-10 sm:w-28 rounded-xl bg-slate-200" />
      </div>
      <div className="grid gap-3 md:grid-cols-[240px_minmax(0,1fr)] md:min-h-[60vh]">
        <div className="hidden md:block rounded-2xl border border-[var(--line)] bg-white/60 p-3 space-y-2">
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-100" />
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white/60 p-4 sm:p-5 min-h-[50vh]">
          <div className="mb-4 h-8 w-1/2 rounded-lg bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
            <div className="h-4 w-4/6 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
