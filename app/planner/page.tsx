import { getTasks } from '@/app/actions';
import { CalendarDays } from 'lucide-react';

export default async function Planner() {
  const allTasks = await getTasks();
  
  const tasksByWeek: Record<string, typeof allTasks> = {};
  
  allTasks.forEach(t => {
    const d = new Date(t.task.plannedDate);
    const weekNum = Math.ceil(d.getDate() / 7);
    const month = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    const key = `${month} - Week ${weekNum}`;
    
    if (!tasksByWeek[key]) tasksByWeek[key] = [];
    tasksByWeek[key].push(t);
  });

  const weeks = Object.entries(tasksByWeek).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="space-y-8">
      <div className="anim-rise">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--faint)] mb-2">
          Timeline
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">Monthly planner</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Tasks grouped by week so you can see the stretch ahead.
        </p>
      </div>

      {weeks.length === 0 ? (
        <div className="surface anim-rise rounded-2xl p-12 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <CalendarDays className="h-6 w-6" />
          </div>
          <p className="font-semibold text-[var(--ink)]">Nothing planned yet</p>
          <p className="text-sm text-[var(--muted)] mt-1">Create a task with a date and it will show up here.</p>
        </div>
      ) : (
        weeks.map(([weekLabel, tasks], i) => (
          <div key={weekLabel} className="space-y-4 anim-rise" style={{ animationDelay: `${0.06 * i}s` }}>
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                {weekLabel}
              </h2>
              <div className="h-px flex-1 bg-[var(--line)]" />
              <span className="text-xs font-semibold text-[var(--faint)]">{tasks.length}</span>
            </div>
            
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map(t => (
                <div
                  key={t.task.id}
                  className={`surface rounded-2xl p-4 shadow-sm shadow-slate-900/5 transition-transform duration-200 hover:-translate-y-0.5 ${
                    t.task.status === 'COMPLETED' ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2.5 gap-2">
                    <span className="text-[11px] font-semibold text-[var(--accent)] bg-[var(--accent-soft)] px-2 py-0.5 rounded-md">
                      {t.category?.name || 'Uncategorized'}
                    </span>
                    <span className="text-[11px] font-medium text-[var(--faint)] tabular-nums">
                      {t.task.plannedDate}
                    </span>
                  </div>
                  <h3 className={`font-semibold leading-snug ${
                    t.task.status === 'COMPLETED' ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)]'
                  }`}>
                    {t.task.title}
                  </h3>
                  {(t.topic?.name || t.project?.name) && (
                    <p className="text-xs text-[var(--muted)] mt-1.5">
                      {t.topic?.name || t.project?.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
