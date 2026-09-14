'use client';

import { CalendarDays } from 'lucide-react';
import { CreateTaskButton } from '@/components/CreateTaskButton';
import { TaskCheckItem, type CheckTask } from '@/components/TaskCheckItem';

type DayColumn = {
  key: string;
  label: string;
  date: string | null;
};

type WeeklyBoardProps = {
  weekLabel: string;
  columns: DayColumn[];
  tasksByKey: Record<string, CheckTask[]>;
};

export function WeeklyBoard({ weekLabel, columns, tasksByKey }: WeeklyBoardProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="anim-rise flex items-start sm:items-center gap-2.5">
        <CalendarDays className="h-5 w-5 text-[var(--accent)] shrink-0 mt-0.5 sm:mt-0" strokeWidth={2} />
        <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[var(--ink)] leading-snug">
          Weekly To-do{' '}
          <span className="block sm:inline font-semibold text-[var(--muted)] text-base sm:text-2xl mt-0.5 sm:mt-0">
            @ {weekLabel}
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 anim-rise" style={{ animationDelay: '0.06s' }}>
        {columns.map((col) => (
          <DayColumnView
            key={col.key}
            label={col.label}
            date={col.date}
            tasks={tasksByKey[col.key] ?? []}
          />
        ))}
      </div>
    </div>
  );
}

function DayColumnView({
  label,
  date,
  tasks,
}: {
  label: string;
  date: string | null;
  tasks: CheckTask[];
}) {
  return (
    <div className="flex min-h-0 sm:min-h-[140px] flex-col rounded-2xl border border-[var(--line)] bg-white p-3 sm:p-3.5 shadow-sm shadow-slate-900/5">
      <div className="mb-2.5 sm:mb-3 flex items-center justify-between gap-2 border-b border-[var(--line)] pb-2 sm:pb-2.5">
        <h2 className="text-sm font-bold text-[var(--ink)]">{label}</h2>
        <span className="tabular-nums text-[11px] font-semibold text-[var(--muted)] bg-[var(--surface-2)] rounded-md px-1.5 py-0.5">
          {tasks.length}
        </span>
      </div>
      <ul className="flex flex-1 flex-col gap-1">
        {tasks.map((t) => (
          <TaskCheckItem key={t.task.id} data={t} />
        ))}
      </ul>
      {date ? (
        <div className="mt-2.5 sm:mt-3 pt-1">
          <CreateTaskButton variant="column" defaultDate={date} />
        </div>
      ) : null}
    </div>
  );
}
