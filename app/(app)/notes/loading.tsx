export default function NotesLoading() {
  return (
    <div className="space-y-4 sm:space-y-5 animate-pulse" aria-busy="true">
      <div>
        <div className="mb-2 h-3 w-20 rounded bg-slate-200" />
        <div className="h-8 w-36 rounded-lg bg-slate-200" />
        <div className="mt-2 h-4 w-64 rounded bg-slate-100" />
      </div>
      <div className="grid gap-3 md:grid-cols-[240px_minmax(0,1fr)] md:min-h-[60vh]">
        <div className="rounded-2xl border border-[var(--line)] bg-white/60 p-3 space-y-2">
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-100" />
          <div className="h-10 rounded-xl bg-slate-100" />
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-white/60 p-5">
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
