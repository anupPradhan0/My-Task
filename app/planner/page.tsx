import { getTasks } from '@/app/actions';
import { CheckSquare } from 'lucide-react';

export default async function Planner() {
  const allTasks = await getTasks();
  
  // Basic group by week of the current month
  // V1 logic: just sort all tasks by plannedDate and group
  const tasksByWeek: Record<string, typeof allTasks> = {};
  
  allTasks.forEach(t => {
    const d = new Date(t.task.plannedDate);
    const weekNum = Math.ceil(d.getDate() / 7);
    const month = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    const key = `${month} - Week ${weekNum}`;
    
    if (!tasksByWeek[key]) tasksByWeek[key] = [];
    tasksByWeek[key].push(t);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Monthly Planner</h1>
      </div>

      {Object.entries(tasksByWeek).sort((a,b) => a[0].localeCompare(b[0])).map(([weekLabel, tasks]) => (
        <div key={weekLabel} className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">{weekLabel}</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map(t => (
              <div key={t.task.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {t.category?.name}
                  </span>
                  <span className="text-xs text-slate-500">{t.task.plannedDate}</span>
                </div>
                <h3 className={`font-medium ${t.task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                  {t.task.title}
                </h3>
                {t.topic?.name && <p className="text-xs text-slate-500 mt-1">{t.topic.name}</p>}
                {t.project?.name && <p className="text-xs text-slate-500 mt-1">{t.project.name}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
