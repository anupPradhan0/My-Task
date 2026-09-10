import { getTasks } from '@/app/actions';
import { CreateTaskButton } from '@/components/CreateTaskButton';
import { TaskList } from '@/components/TaskList';

export default async function TasksPage() {
  const allTasks = await getTasks();
  
  // Group all by status for the general Tasks page
  const todo = allTasks.filter(t => t.task.status === 'TODO');
  const inProgress = allTasks.filter(t => t.task.status === 'IN_PROGRESS');
  const completed = allTasks.filter(t => t.task.status === 'COMPLETED');

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">All Tasks</h1>
        <CreateTaskButton />
      </div>

      <div className="flex-1 overflow-x-auto pb-32">
        <div className="flex gap-4 min-w-[800px] h-full items-start">
          <div className="w-80 rounded-xl bg-slate-50/50 border border-slate-200/60 p-3 h-full">
            <TaskList title="To Do" tasks={todo} color="orange" />
          </div>
          <div className="w-80 rounded-xl bg-slate-50/50 border border-slate-200/60 p-3 h-full">
            <TaskList title="In Progress" tasks={inProgress} color="blue" />
          </div>
          <div className="w-80 rounded-xl bg-slate-50/50 border border-slate-200/60 p-3 h-full">
            <TaskList title="Completed" tasks={completed} color="purple" />
          </div>
        </div>
      </div>
    </div>
  );
}
