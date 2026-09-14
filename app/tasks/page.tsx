import { getTasks } from '@/app/actions';
import { CreateTaskButton } from '@/components/CreateTaskButton';
import { TaskList } from '@/components/TaskList';
import { BoardColumn, BoardColumns } from '@/components/Board';

export default async function TasksPage() {
  const allTasks = await getTasks();

  const now = new Date();
  const todayStr = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Today's planned work + unfinished tasks that rolled over from earlier days
  const tasksToday = allTasks.filter(t => {
    const planned = String(t.task.plannedDate).slice(0, 10);
    if (planned === todayStr) return true;
    if (t.task.status !== 'COMPLETED' && planned <= todayStr) return true;
    return false;
  });
  const todo = tasksToday.filter(t => t.task.status === 'TODO');
  const inProgress = tasksToday.filter(t => t.task.status === 'IN_PROGRESS');
  const completed = tasksToday.filter(t => t.task.status === 'COMPLETED');

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-start justify-between gap-3 anim-rise">
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[var(--faint)] mb-1.5 sm:mb-2">
            {dateLabel}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">Today</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {tasksToday.length} today · {inProgress.length} in progress
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
