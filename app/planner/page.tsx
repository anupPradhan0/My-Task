import { getTasks } from '@/app/actions';
import { CalendarDays } from 'lucide-react';
import { CreateTaskButton } from '@/components/CreateTaskButton';
import { TaskCheckItem, type CheckTask } from '@/components/TaskCheckItem';

function monthMeta(plannedDate: string) {
  const d = new Date(String(plannedDate).slice(0, 10) + 'T12:00:00');
  return {
    key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
    label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
    sort: d.getFullYear() * 100 + d.getMonth(),
  };
}

function dayLabel(ymd: string) {
  const d = new Date(ymd + 'T12:00:00');
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

type DayGroup = { date: string; label: string; tasks: CheckTask[] };
type MonthGroup = {
  key: string;
  label: string;
  sort: number;
  days: DayGroup[];
  total: number;
  done: number;
};

export default async function Planner() {
  const allTasks = await getTasks();

  const byMonth = new Map<string, { label: string; sort: number; byDay: Map<string, CheckTask[]> }>();

  for (const t of allTasks) {
    const planned = String(t.task.plannedDate).slice(0, 10);
    const { key, label, sort } = monthMeta(planned);
    if (!byMonth.has(key)) byMonth.set(key, { label, sort, byDay: new Map() });
    const month = byMonth.get(key)!;
    if (!month.byDay.has(planned)) month.byDay.set(planned, []);
    month.byDay.get(planned)!.push(t);
  }

  const months: MonthGroup[] = [...byMonth.entries()]
    .map(([key, m]) => {
      const days: DayGroup[] = [...m.byDay.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, tasks]) => ({ date, label: dayLabel(date), tasks }));
      const total = days.reduce((n, d) => n + d.tasks.length, 0);
      const done = days.reduce(
        (n, d) => n + d.tasks.filter((t) => t.task.status === 'COMPLETED').length,
        0
      );
      return { key, label: m.label, sort: m.sort, days, total, done };
    })
    .sort((a, b) => b.sort - a.sort);

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="anim-rise flex items-start sm:items-center gap-2.5">
        <CalendarDays className="h-5 w-5 text-[var(--accent)] shrink-0 mt-0.5 sm:mt-0" strokeWidth={2} />
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[var(--ink)] leading-snug">
            Monthly planner
          </h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Tasks by day — done ones stay crossed out.
          </p>
        </div>
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
          const progress = month.total ? Math.round((month.done / month.total) * 100) : 0;
          const isCurrent = month.key === currentMonthKey;

          return (
            <section
              key={month.key}
              className={`anim-rise rounded-2xl border bg-white p-3.5 sm:p-5 shadow-sm shadow-slate-900/5 ${
                isCurrent ? 'border-[var(--accent)]/25' : 'border-[var(--line)]'
              }`}
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="mb-3 sm:mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--ink)]">
                    {month.label}
                  </h2>
                  {isCurrent ? (
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--accent)] bg-[var(--accent-soft)] rounded-md px-1.5 py-0.5">
                      Now
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2.5 text-xs font-medium text-[var(--muted)]">
                  <div className="h-1.5 w-16 sm:w-24 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="tabular-nums">
                    {month.done}/{month.total}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3">
                {month.days.map((day) => (
                  <div
                    key={day.date}
                    className="flex min-h-0 flex-col rounded-xl border border-[var(--line)] bg-[var(--surface-2)]/40 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-[var(--ink)]">{day.label}</h3>
                      <span className="tabular-nums text-[11px] font-semibold text-[var(--muted)] bg-white rounded-md px-1.5 py-0.5 border border-[var(--line)]">
                        {day.tasks.length}
                      </span>
                    </div>
                    <ul className="flex flex-1 flex-col gap-0.5">
                      {day.tasks.map((t) => (
                        <TaskCheckItem key={t.task.id} data={t} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      )}

      <CreateTaskButton fab />
    </div>
  );
}
