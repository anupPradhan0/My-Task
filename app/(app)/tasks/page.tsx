import { getTasks } from '@/app/actions';
import { WeeklyBoard } from '@/components/WeeklyBoard';

export default async function TasksPage() {
  const allTasks = await getTasks();

  return (
    <div>
      <WeeklyBoard allTasks={allTasks} />
    </div>
  );
}
