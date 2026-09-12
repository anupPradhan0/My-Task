import { getAllProjects, getTasks } from '@/app/actions';
import { FolderKanban, Trophy } from 'lucide-react';

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const allTasks = await getTasks();

  const totalCompletedProjectTasks = allTasks.filter(t => t.task.status === 'COMPLETED' && t.task.projectId).length;

  const stats = projects.map(p => {
    const projectTasks = allTasks.filter(t => t.task.projectId === p.id);
    const completed = projectTasks.filter(t => t.task.status === 'COMPLETED').length;
    const percentageOfTotal = totalCompletedProjectTasks > 0 ? Math.round((completed / totalCompletedProjectTasks) * 100) : 0;
    const progress = projectTasks.length > 0 ? Math.round((completed / projectTasks.length) * 100) : 0;
    return { ...p, taskCount: projectTasks.length, completed, percentageOfTotal, progress };
  });

  const maxCompleted = Math.max(0, ...stats.map(s => s.completed));

  return (
    <div className="space-y-8">
      <div className="anim-rise">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--faint)] mb-2">
          Portfolio
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">Projects</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Progress across active and archived workstreams.
        </p>
      </div>

      {stats.length === 0 ? (
        <div className="surface anim-rise rounded-2xl p-12 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <FolderKanban className="h-6 w-6" />
          </div>
          <p className="font-semibold text-[var(--ink)]">No projects yet</p>
          <p className="text-sm text-[var(--muted)] mt-1">Seed or add projects to track them here.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger">
          {stats.map(p => {
            const isTopProject = p.completed > 0 && p.completed === maxCompleted;
            
            return (
              <div
                key={p.id}
                className={`relative surface anim-rise rounded-2xl p-5 shadow-sm shadow-slate-900/5 transition-transform duration-200 hover:-translate-y-0.5 ${
                  !p.isActive ? 'opacity-70' : ''
                } ${isTopProject ? 'ring-2 ring-[var(--accent)]/30' : ''}`}
              >
                {isTopProject && (
                  <div
                    className="absolute -top-2.5 -right-2.5 h-8 w-8 bg-[var(--accent)] rounded-full flex items-center justify-center text-white shadow-md"
                    title="Most tasks completed"
                  >
                    <Trophy className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-lg font-bold text-[var(--ink)] leading-snug">{p.name}</h2>
                  <span className={`shrink-0 text-[11px] px-2 py-1 rounded-md font-semibold ${
                    p.isActive
                      ? 'bg-[var(--ok-soft)] text-[var(--ok)]'
                      : 'bg-[var(--surface-2)] text-[var(--muted)]'
                  }`}>
                    {p.isActive ? 'Active' : 'Archived'}
                  </span>
                </div>
                {p.description && (
                  <p className="text-sm text-[var(--muted)] mb-5 line-clamp-3 leading-relaxed">
                    {p.description}
                  </p>
                )}
                
                <div className="pt-4 border-t border-[var(--line)]/80 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--muted)] font-medium">Progress</span>
                    <span className="font-bold text-[var(--ink)] tabular-nums">
                      {p.completed}
                      <span className="text-[var(--faint)] font-medium"> / {p.taskCount}</span>
                    </span>
                  </div>
                  <div className="w-full bg-[var(--surface-2)] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[var(--accent)] h-full rounded-full transition-all duration-500"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs text-[var(--muted)]">
                    <span>Share of completed project work</span>
                    <span className="font-bold text-[var(--accent)] tabular-nums">{p.percentageOfTotal}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
