export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-slate-200" />
          <div className="h-4 w-72 rounded bg-slate-100" />
        </div>
        <div className="h-10 w-28 rounded-md bg-slate-200" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 h-10 w-10 rounded-xl bg-slate-100" />
            <div className="h-4 w-24 rounded bg-slate-100" />
            <div className="mt-2 h-7 w-12 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="h-6 w-36 rounded bg-slate-200" />
        <div className="flex gap-4 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-80 shrink-0 space-y-2.5 rounded-xl border border-slate-200/60 bg-slate-50/50 p-3">
              <div className="mb-3 h-4 w-24 rounded bg-slate-200" />
              {[0, 1, 2].map((j) => (
                <div key={j} className="h-16 rounded-lg border border-slate-200 bg-white" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
