import { getTasks } from './actions';
import { CheckCircle2, CheckSquare, Target } from 'lucide-react';
import { TaskList } from '@/components/TaskList';
import { CreateTaskButton } from '@/components/CreateTaskButton';

export default async function Dashboard() {
  const allTasks = await getTasks();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayStr = today.toISOString().split('T')[0];

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Good Morning!</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Here's your productivity overview for today.</p>
        </div>
        <CreateTaskButton />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">Today's Focus</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-slate-900">{tasksToday.length}</p>
            <span className="text-xs font-medium text-slate-400">tasks</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">Done Today</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-slate-900">{completedToday}</p>
            <span className="text-xs font-medium text-slate-400">completed</span>
          </div>
        </div>
        
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <CheckSquare className="h-5 w-5" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">Done This Week</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-slate-900">{completedThisWeek}</p>
            <span className="text-xs font-medium text-slate-400">tasks</span>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Today's Board</h2>
        </div>
        
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[800px] h-full items-start">
            <div className="w-80 rounded-xl bg-slate-50/50 border border-slate-200/60 p-3">
              <TaskList title="Fundamentals" tasks={fundamentals} color="blue" />
            </div>
            <div className="w-80 rounded-xl bg-slate-50/50 border border-slate-200/60 p-3">
              <TaskList title="DSA" tasks={dsa} color="orange" />
            </div>
            <div className="w-80 rounded-xl bg-slate-50/50 border border-slate-200/60 p-3">
              <TaskList title="Projects" tasks={projects} color="purple" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
