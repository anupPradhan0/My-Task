import { getTasks } from '@/app/actions';
import { CreateTaskButton } from '@/components/CreateTaskButton';
import { TaskList } from '@/components/TaskList';
import { BoardColumn, BoardColumns } from '@/components/Board';

export default async function TasksPage() {
  const allTasks = await getTasks();
  
  const todo = allTasks.filter(t => t.task.status === 'TODO');
  const inProgress = allTasks.filter(t => t.task.status === 'IN_PROGRESS');
  const completed = allTasks.filter(t => t.task.status === 'COMPLETED');

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-start justify-between gap-3 anim-rise">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[var(--faint)] mb-1.5 sm:mb-2">
            Workflow
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">All tasks</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {allTasks.length} total · {inProgress.length} in progress
          </p>
        </div>
        <div className="hidden sm:block shrink-0">
          <CreateTaskButton />
        </div>
      </div>

      <div className="anim-rise" style={{ animationDelay: '0.08s' }}>
        <BoardColumns>
          <BoardColumn>
            <TaskList title="To Do" tasks={todo} color="orange" />
          </BoardColumn>
          <BoardColumn>
            <TaskList title="In Progress" tasks={inProgress} color="blue" />
          </BoardColumn>
          <BoardColumn>
            <TaskList title="Completed" tasks={completed} color="teal" />
          </BoardColumn>
        </BoardColumns>
      </div>

      <CreateTaskButton fab />
    </div>
  );
}
