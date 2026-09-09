import { getAllProjects, getTasks } from '@/app/actions';
import { Trophy } from 'lucide-react';

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const allTasks = await getTasks();

  const totalCompletedProjectTasks = allTasks.filter(t => t.task.status === 'COMPLETED' && t.task.projectId).length;

  const stats = projects.map(p => {
    const projectTasks = allTasks.filter(t => t.task.projectId === p.id);
    const completed = projectTasks.filter(t => t.task.status === 'COMPLETED').length;
    const percentageOfTotal = totalCompletedProjectTasks > 0 ? Math.round((completed / totalCompletedProjectTasks) * 100) : 0;
    return { ...p, taskCount: projectTasks.length, completed, percentageOfTotal };
  });

  const maxCompleted = Math.max(...stats.map(s => s.completed));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Projects Overview</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map(p => {
          const isTopProject = p.completed > 0 && p.completed === maxCompleted;
          
          return (
            <div key={p.id} className={`relative rounded-2xl border p-6 shadow-sm ${p.isActive ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-75'} ${isTopProject ? 'ring-2 ring-blue-500' : ''}`}>
              {isTopProject && (
                <div className="absolute -top-3 -right-3 h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md" title="Most tasks completed!">
                  <Trophy className="h-4 w-4" />
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-900">{p.name}</h2>
                <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${p.isActive ? 'bg-emerald-100/50 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                  {p.isActive ? 'Active' : 'Archived'}
                </span>
              </div>
              {p.description && <p className="text-sm text-slate-500 mb-5 line-clamp-3 leading-relaxed">{p.description}</p>}
              
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-slate-500 font-medium">Completed Tasks</span>
                  <span className="font-bold text-slate-900">{p.completed} <span className="text-slate-400 font-medium">/ {p.taskCount}</span></span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Share of all work</span>
                  <span className="font-bold text-blue-600">{p.percentageOfTotal}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${p.percentageOfTotal}%` }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
