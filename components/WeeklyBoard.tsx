'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { CalendarDays } from 'lucide-react';
import { CreateTaskButton } from '@/components/CreateTaskButton';
import { TaskCheckItem, type CheckTask } from '@/components/TaskCheckItem';

type DayColumn = {
  key: string;
  label: string;
  date: string | null;
};

type WeeklyBoardProps = {
  allTasks: CheckTask[];
};

function ymd(d: Date) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

function getLocalWeek(today: Date) {
  const monday = new Date(today);
  monday.setHours(12, 0, 0, 0);
  const day = monday.getDay();
  monday.setDate(monday.getDate() + (day === 0 ? -6 : 1 - day));
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
  const weekDates = weekDays.map(ymd);
  const sunday = weekDays[6];
  const weekLabel = monday.getMonth() === sunday.getMonth()
    ? `${monday.toLocaleDateString(undefined, { month: 'long' })} ${ordinal(monday.getDate())} to ${ordinal(sunday.getDate())}`
    : `${monday.toLocaleDateString(undefined, { month: 'long' })} ${ordinal(monday.getDate())} to ${sunday.toLocaleDateString(undefined, { month: 'long' })} ${ordinal(sunday.getDate())}`;
  const columns: DayColumn[] = [
    ...DAY_LABELS.map((label, i) => ({
      key: weekDates[i],
      label: `${label} ${ordinal(weekDays[i].getDate())}`,
      date: weekDates[i],
    })),
    { key: 'weekly', label: 'Weekly Task', date: null },
  ];
  return { today: ymd(today), weekStart: weekDates[0], weekEnd: weekDates[6], weekLabel, columns };
}

function todayYmd() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

const subscribeToLocalDate = () => () => {};
const getLocalDateSnapshot = () => todayYmd();
const getServerDateSnapshot = () => null;

export function WeeklyBoard({ allTasks }: WeeklyBoardProps) {
  const today = useSyncExternalStore(subscribeToLocalDate, getLocalDateSnapshot, getServerDateSnapshot);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const expandedDate = selectedDate ?? today;
  const week = useMemo(() => today ? getLocalWeek(new Date(`${today}T12:00:00`)) : null, [today]);
  const expandedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    expandedRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [week, expandedDate]);

  const tasksByKey = useMemo(() => {
    if (!week) return {};
    const grouped: Record<string, CheckTask[]> = Object.fromEntries(
      week.columns.map((column) => [column.key, []])
    );
    for (const task of allTasks) {
      const planned = String(task.task.plannedDate ?? '').slice(0, 10);
      // Only this week's tasks. Incomplete past days do NOT roll into Weekly —
      // Weekly is explicitly created tasks (isWeekly), not a catch-all backlog.
      if (planned < week.weekStart || planned > week.weekEnd) continue;
      grouped[task.task.isWeekly ? 'weekly' : planned]?.push(task);
    }
    return grouped;
  }, [allTasks, week]);

  // Avoid rendering a server-timezone week before the browser's local date is known.
  if (!week) return <div className="min-h-[70vh]" aria-busy="true" />;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="anim-rise flex items-start sm:items-center gap-2.5">
        <CalendarDays className="h-5 w-5 text-[var(--accent)] shrink-0 mt-0.5 sm:mt-0" strokeWidth={2} />
        <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[var(--ink)] leading-snug">
          Weekly To-do{' '}
          <span className="block sm:inline font-semibold text-[var(--muted)] text-sm sm:text-2xl mt-0.5 sm:mt-0">
            @ {week.weekLabel}
          </span>
        </h1>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 anim-rise"
        style={{ animationDelay: '0.06s' }}
      >
        {week.columns.map((col) => {
          const isToday = col.date === today;
          const isExpanded = col.date !== null && col.date === expandedDate;
          return (
            <DayColumnView
              key={col.key}
              ref={isExpanded ? expandedRef : undefined}
              label={col.label}
              date={col.date}
              weekStart={week.weekStart}
              tasks={tasksByKey[col.key] ?? []}
              isToday={isToday}
              isExpanded={isExpanded}
              onSelect={col.date ? () => setSelectedDate(col.date) : undefined}
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
  weekStart,
  tasks,
  isToday,
  isExpanded,
  onSelect,
}: {
  ref?: React.Ref<HTMLDivElement>;
  label: string;
  date: string | null;
  weekStart: string;
  tasks: CheckTask[];
  isToday: boolean;
  isExpanded: boolean;
  onSelect?: () => void;
}) {
  const empty = tasks.length === 0;
  // The selected day and Weekly Task span two columns on wider screens.
  const wide = isExpanded || date === null;

  return (
    <div
      ref={ref}
      className={`flex min-w-0 flex-col rounded-2xl border bg-white p-3 sm:p-3.5 shadow-sm shadow-slate-900/5 ${
        empty ? 'min-h-0' : 'min-h-[120px] sm:min-h-[140px]'
      } ${wide ? 'sm:col-span-2' : ''} ${
        isExpanded
          ? 'border-[var(--accent)]/40 ring-1 ring-[var(--accent)]/20'
          : 'border-[var(--line)]'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-1.5 border-b border-[var(--line)] pb-2">
        {onSelect ? (
          <button
            type="button"
            onClick={onSelect}
            aria-pressed={isExpanded}
            className="min-w-0 truncate text-left text-xs sm:text-sm font-bold text-[var(--ink)] leading-tight"
          >
            {label}
            {isToday ? (
              <span className="ml-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                Today
              </span>
            ) : null}
          </button>
        ) : (
          <h2 className="text-xs sm:text-sm font-bold text-[var(--ink)] truncate leading-tight">{label}</h2>
        )}
        <span className="tabular-nums text-[10px] sm:text-[11px] font-semibold text-[var(--muted)] bg-[var(--surface-2)] rounded-md px-1.5 py-0.5 shrink-0">
          {tasks.length}
        </span>
      </div>
      <ul className={`flex flex-1 flex-col gap-0.5 ${empty ? '' : 'min-h-[2rem]'}`}>
        {tasks.map((t, i) => (
          <TaskCheckItem
            key={t.task.id}
            data={t}
            canMoveUp={i > 0}
            canMoveDown={i < tasks.length - 1}
          />
        ))}
      </ul>
      <div className="mt-2 pt-0.5">
        <CreateTaskButton variant="column" defaultDate={date ?? weekStart} weekly={date === null} />
      </div>
    </div>
  );
}
