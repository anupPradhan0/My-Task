import { getTasks } from '@/app/actions';
import { CalendarDays } from 'lucide-react';
import { TaskCheckItem } from '@/components/TaskCheckItem';

function monthKey(plannedDate: string) {
  const d = new Date(String(plannedDate).slice(0, 10) + 'T12:00:00');
  return {
    key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
    label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
    sort: d.getFullYear() * 100 + d.getMonth(),
  };
}

export default async function Planner() {
  const allTasks = await getTasks();

  const byMonth = new Map<string, { label: string; sort: number; tasks: typeof allTasks }>();

  for (const t of allTasks) {
    const { key, label, sort } = monthKey(String(t.task.plannedDate));
    if (!byMonth.has(key)) byMonth.set(key, { label, sort, tasks: [] });
    byMonth.get(key)!.tasks.push(t);
  }

  const months = [...byMonth.values()].sort((a, b) => b.sort - a.sort);
  for (const m of months) {
    m.tasks.sort((a, b) =>
      String(a.task.plannedDate).localeCompare(String(b.task.plannedDate))
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="anim-rise">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--faint)] mb-2">
          Timeline
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          Monthly planner
        </h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Every task in the month — done ones stay crossed out.
        </p>
      </div>

      {months.length === 0 ? (
        <div className="surface anim-rise rounded-2xl p-12 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <CalendarDays className="h-6 w-6" />
          </div>
          <p className="font-semibold text-[var(--ink)]">Nothing planned yet</p>
          <p className="text-sm text-[var(--muted)] mt-1">
            Create a task with a date and it will show up here.
          </p>
        </div>
      ) : (
        months.map((month, i) => {
          const done = month.tasks.filter((t) => t.task.status === 'COMPLETED').length;
          return (
            <div
              key={month.label}
              className="anim-rise rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5 shadow-sm shadow-slate-900/5"
              style={{ animationDelay: `${0.06 * i}s` }}
            >
              <div className="mb-3 flex items-center justify-between gap-2 border-b border-[var(--line)] pb-2.5">
                <h2 className="text-sm font-bold text-[var(--ink)]">{month.label}</h2>
                <span className="text-[11px] font-semibold text-[var(--muted)] bg-[var(--surface-2)] rounded-md px-1.5 py-0.5 tabular-nums">
                  {done}/{month.tasks.length}
                </span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {month.tasks.map((t) => (
                  <TaskCheckItem key={t.task.id} data={t} showDate />
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}
