import { getTasks } from '@/app/actions';
import { CreateTaskButton } from '@/components/CreateTaskButton';
import { WeeklyBoard } from '@/components/WeeklyBoard';

function ymd(d: Date) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function mondayOf(d: Date) {
  const date = new Date(d);
  date.setHours(12, 0, 0, 0);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export default async function TasksPage() {
  const allTasks = await getTasks();
  const monday = mondayOf(new Date());
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return ymd(d);
  });
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const weekLabel = monday.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const columns = [
    ...DAY_LABELS.map((label, i) => ({
      key: weekDates[i],
      label,
      date: weekDates[i] as string | null,
    })),
    // unfinished from before this week (no + Task — pick a day instead)
    { key: 'weekly', label: 'Weekly Task', date: null },
  ];

  const tasksByKey: Record<string, typeof allTasks> = Object.fromEntries(
    columns.map((c) => [c.key, [] as typeof allTasks])
  );

  for (const t of allTasks) {
    const planned = String(t.task.plannedDate).slice(0, 10);
    if (planned >= weekStart && planned <= weekEnd) {
      tasksByKey[planned].push(t);
      continue;
    }
    // Weekly Task = before this week; keep ones completed this week so they stay crossed out
    if (planned < weekStart) {
      if (t.task.status !== 'COMPLETED') {
        tasksByKey.weekly.push(t);
      } else if (t.task.completedAt) {
        const doneOn = ymd(new Date(t.task.completedAt));
        if (doneOn >= weekStart) tasksByKey.weekly.push(t);
      }
    }
  }

  return (
    <div>
      <WeeklyBoard weekLabel={weekLabel} columns={columns} tasksByKey={tasksByKey} />
      <CreateTaskButton fab />
    </div>
  );
}
