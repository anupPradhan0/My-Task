import { getTasks } from './actions';
import { CheckCircle2, Flame, Target } from 'lucide-react';
import { TaskList } from '@/components/TaskList';
import { CreateTaskButton } from '@/components/CreateTaskButton';

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function Dashboard() {
  const allTasks = await getTasks();
  
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const tasksToday = allTasks.filter(t => t.task.plannedDate === todayStr);
  const completedToday = tasksToday.filter(t => t.task.status === 'COMPLETED').length;
  
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  
  const completedThisWeek = allTasks.filter(t => {
    if (t.task.status !== 'COMPLETED' || !t.task.completedAt) return false;
    return new Date(t.task.completedAt) >= thisWeekStart;
  }).length;

  const fundamentals = tasksToday.filter(t => t.category?.name === 'Fundamentals');
  const dsa = tasksToday.filter(t => t.category?.name === 'DSA');
  const projects = tasksToday.filter(t => t.category?.name === 'Projects');
  const progress = tasksToday.length
    ? Math.round((completedToday / tasksToday.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 anim-rise">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--faint)] mb-2">
            {dateLabel}
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            {greetingForHour(now.getHours())}
          </h1>
          <p className="text-[var(--muted)] mt-1.5 text-sm sm:text-base">
            {tasksToday.length === 0
              ? 'No tasks planned for today — add one to get moving.'
              : `${completedToday} of ${tasksToday.length} done · ${progress}% of today’s board`}
          </p>
        </div>
        <CreateTaskButton />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 stagger">
        <div className="surface anim-rise rounded-2xl p-5 shadow-sm shadow-slate-900/5">
          <div className="mb-4 h-10 w-10 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
            <Target className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-[var(--muted)]">Today&apos;s focus</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-extrabold tracking-tight text-[var(--ink)]">{tasksToday.length}</p>
            <span className="text-xs font-medium text-[var(--faint)]">tasks</span>
          </div>
        </div>

        <div className="surface anim-rise rounded-2xl p-5 shadow-sm shadow-slate-900/5">
          <div className="mb-4 h-10 w-10 rounded-xl bg-[var(--ok-soft)] text-[var(--ok)] flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-[var(--muted)]">Done today</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-extrabold tracking-tight text-[var(--ink)]">{completedToday}</p>
            <span className="text-xs font-medium text-[var(--faint)]">completed</span>
          </div>
        </div>
        
        <div className="surface anim-rise rounded-2xl p-5 shadow-sm shadow-slate-900/5 col-span-2 lg:col-span-1">
          <div className="mb-4 h-10 w-10 rounded-xl bg-[var(--warn-soft)] text-[var(--warn)] flex items-center justify-center">
            <Flame className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-[var(--muted)]">Done this week</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-3xl font-extrabold tracking-tight text-[var(--ink)]">{completedThisWeek}</p>
            <span className="text-xs font-medium text-[var(--faint)]">tasks</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 anim-rise" style={{ animationDelay: '0.14s' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[var(--ink)]">Today&apos;s board</h2>
          {tasksToday.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
              <div className="h-1.5 w-24 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {progress}%
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto pb-8 -mx-1 px-1">
          <div className="flex gap-4 min-w-[800px] items-start">
            <div className="w-80 rounded-2xl surface p-3.5 shadow-sm shadow-slate-900/5">
              <TaskList title="Fundamentals" tasks={fundamentals} color="blue" />
            </div>
            <div className="w-80 rounded-2xl surface p-3.5 shadow-sm shadow-slate-900/5">
              <TaskList title="DSA" tasks={dsa} color="orange" />
            </div>
            <div className="w-80 rounded-2xl surface p-3.5 shadow-sm shadow-slate-900/5">
              <TaskList title="Projects" tasks={projects} color="teal" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
