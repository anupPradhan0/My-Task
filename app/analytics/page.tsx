import { getTasks } from '@/app/actions';
import { Trophy } from 'lucide-react';

export default async function Analytics() {
  const allTasks = await getTasks();
  
  const completedTasks = allTasks.filter(t => t.task.status === 'COMPLETED');
  const totalCompleted = completedTasks.length;
  
  const byCategory = allTasks.reduce((acc, t) => {
    const catName = t.category?.name || 'Unknown';
    if (!acc[catName]) acc[catName] = { completed: 0, total: 0 };
    acc[catName].total += 1;
    if (t.task.status === 'COMPLETED') acc[catName].completed += 1;
    return acc;
  }, {} as Record<string, { completed: number; total: number }>);

  const maxCategoryCompleted = Math.max(...Object.values(byCategory).map(v => v.completed));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Performance by Category</h2>
          <div className="space-y-5">
            {Object.entries(byCategory).map(([cat, stats]) => {
              const percentage = totalCompleted > 0 ? Math.round((stats.completed / totalCompleted) * 100) : 0;
              const isTop = stats.completed > 0 && stats.completed === maxCategoryCompleted;
              
              return (
                <div key={cat} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-800 flex items-center gap-2">
                      {cat}
                      {isTop && <Trophy className="h-4 w-4 text-amber-500" />}
                    </span>
                    <div className="text-right text-sm">
                      <p className="text-slate-900 font-semibold">{stats.completed} / {stats.total} completed</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Share of all completed tasks</span>
                    <span className="font-bold text-blue-600">{percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${isTop ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium text-slate-500 mb-2">Total Completion Rate</p>
            <p className="text-5xl font-bold text-blue-600">
              {allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0}%
            </p>
            <p className="text-sm font-medium text-slate-500 mt-3">{completedTasks.length} of {allTasks.length} tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
