import { getTasks } from '@/app/actions';
import { Trophy } from 'lucide-react';

export default async function Analytics() {
  const allTasks = await getTasks();
  
  const completedTasks = allTasks.filter(t => t.task.status === 'COMPLETED');
  const totalCompleted = completedTasks.length;
  const rate = allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0;
  
  const byCategory = allTasks.reduce((acc, t) => {
    const catName = t.category?.name || 'Unknown';
    if (!acc[catName]) acc[catName] = { completed: 0, total: 0 };
    acc[catName].total += 1;
    if (t.task.status === 'COMPLETED') acc[catName].completed += 1;
    return acc;
  }, {} as Record<string, { completed: number; total: number }>);

  const maxCategoryCompleted = Math.max(0, ...Object.values(byCategory).map(v => v.completed));

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="anim-rise">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--faint)] mb-2">
          Insights
        </p>
        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">Analytics</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          How your completed work breaks down across categories.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div className="surface anim-rise rounded-2xl p-4 sm:p-6 shadow-sm shadow-slate-900/5">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--muted)] mb-4 sm:mb-5">
            By category
          </h2>
          <div className="space-y-5">
            {Object.keys(byCategory).length === 0 ? (
              <p className="text-sm text-[var(--muted)]">No tasks yet.</p>
            ) : (
              Object.entries(byCategory).map(([cat, stats]) => {
                const percentage = totalCompleted > 0 ? Math.round((stats.completed / totalCompleted) * 100) : 0;
                const isTop = stats.completed > 0 && stats.completed === maxCategoryCompleted;
                
                return (
                  <div key={cat} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[var(--ink)] flex items-center gap-2">
                        {cat}
                        {isTop && <Trophy className="h-4 w-4 text-amber-500" />}
                      </span>
                      <p className="text-sm font-semibold text-[var(--ink)] tabular-nums">
                        {stats.completed}
                        <span className="text-[var(--faint)] font-medium"> / {stats.total}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-1.5">
                      <span>Share of completed</span>
                      <span className="font-bold text-[var(--accent)] tabular-nums">{percentage}%</span>
                    </div>
                    <div className="w-full bg-[var(--surface-2)] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isTop ? 'bg-amber-500' : 'bg-[var(--accent)]'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="surface anim-rise rounded-2xl p-5 sm:p-6 shadow-sm shadow-slate-900/5 flex flex-col items-center justify-center text-center min-h-[200px] sm:min-h-[260px]" style={{ animationDelay: '0.08s' }}>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)] mb-3">
            Completion rate
          </p>
          <p className="text-5xl sm:text-6xl font-extrabold tracking-tight text-[var(--accent)] tabular-nums">
            {rate}%
          </p>
          <p className="text-sm font-medium text-[var(--muted)] mt-3">
            {completedTasks.length} of {allTasks.length} tasks done
          </p>
          <div className="mt-6 h-2 w-40 rounded-full bg-[var(--surface-2)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-700"
              style={{ width: `${rate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
