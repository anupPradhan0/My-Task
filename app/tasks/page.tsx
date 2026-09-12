import { getTasks } from '@/app/actions';
import { CreateTaskButton } from '@/components/CreateTaskButton';
import { TaskList } from '@/components/TaskList';

export default async function TasksPage() {
  const allTasks = await getTasks();
  
  const todo = allTasks.filter(t => t.task.status === 'TODO');
  const inProgress = allTasks.filter(t => t.task.status === 'IN_PROGRESS');
  const completed = allTasks.filter(t => t.task.status === 'COMPLETED');

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-end justify-between gap-4 anim-rise">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--faint)] mb-2">
            Workflow
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">All tasks</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {allTasks.length} total · {inProgress.length} in progress
          </p>
        </div>
        <CreateTaskButton />
      </div>

      <div className="flex-1 overflow-x-auto pb-8 -mx-1 px-1 anim-rise" style={{ animationDelay: '0.08s' }}>
        <div className="flex gap-4 min-w-[800px] items-start">
          <div className="w-80 rounded-2xl surface p-3.5 shadow-sm shadow-slate-900/5">
            <TaskList title="To Do" tasks={todo} color="orange" />
          </div>
          <div className="w-80 rounded-2xl surface p-3.5 shadow-sm shadow-slate-900/5">
            <TaskList title="In Progress" tasks={inProgress} color="blue" />
          </div>
          <div className="w-80 rounded-2xl surface p-3.5 shadow-sm shadow-slate-900/5">
            <TaskList title="Completed" tasks={completed} color="teal" />
          </div>
        </div>
      </div>
    </div>
  );
}
