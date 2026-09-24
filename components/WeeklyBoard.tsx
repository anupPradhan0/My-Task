'use client';

import { useEffect, useRef } from 'react';
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

function todayYmd() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

export function WeeklyBoard({ weekLabel, columns, tasksByKey }: WeeklyBoardProps) {
  const today = todayYmd();
  const todayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    todayRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="anim-rise flex items-start sm:items-center gap-2.5">
        <CalendarDays className="h-5 w-5 text-[var(--accent)] shrink-0 mt-0.5 sm:mt-0" strokeWidth={2} />
        <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[var(--ink)] leading-snug">
          Weekly To-do{' '}
          <span className="block sm:inline font-semibold text-[var(--muted)] text-sm sm:text-2xl mt-0.5 sm:mt-0">
            @ {weekLabel}
          </span>
        </h1>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 anim-rise"
        style={{ animationDelay: '0.06s' }}
      >
        {columns.map((col) => {
          const isToday = col.date === today;
          return (
            <DayColumnView
              key={col.key}
              ref={isToday ? todayRef : undefined}
              label={col.label}
              date={col.date}
              tasks={tasksByKey[col.key] ?? []}
              isToday={isToday}
            />
          );
        })}
      </div>
    </div>
  );
}

function DayColumnView({
  ref,
  label,
  date,
  tasks,
  isToday,
}: {
  ref?: React.Ref<HTMLDivElement>;
  label: string;
  date: string | null;
  tasks: CheckTask[];
  isToday: boolean;
}) {
  const empty = tasks.length === 0;
  // Today + Weekly Task span full row from sm up; phones are always 1 column
  const wide = isToday || date === null;

  return (
    <div
      ref={ref}
      className={`flex min-w-0 flex-col rounded-2xl border bg-white p-3 sm:p-3.5 shadow-sm shadow-slate-900/5 ${
        empty ? 'min-h-0' : 'min-h-[120px] sm:min-h-[140px]'
      } ${wide ? 'sm:col-span-2' : ''} ${
        isToday
          ? 'border-[var(--accent)]/40 ring-1 ring-[var(--accent)]/20'
          : 'border-[var(--line)]'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-1.5 border-b border-[var(--line)] pb-2">
        <h2 className="text-xs sm:text-sm font-bold text-[var(--ink)] truncate leading-tight">
          {label}
          {isToday ? (
            <span className="ml-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
              Today
            </span>
          ) : null}
        </h2>
        <span className="tabular-nums text-[10px] sm:text-[11px] font-semibold text-[var(--muted)] bg-[var(--surface-2)] rounded-md px-1.5 py-0.5 shrink-0">
          {tasks.length}
        </span>
      </div>
      <ul className={`flex flex-1 flex-col gap-0.5 ${empty ? '' : 'min-h-[2rem]'}`}>
        {tasks.map((t) => (
          <TaskCheckItem key={t.task.id} data={t} />
        ))}
      </ul>
      {date ? (
        <div className="mt-2 pt-0.5">
          <CreateTaskButton variant="column" defaultDate={date} />
        </div>
      ) : null}
    </div>
  );
}
