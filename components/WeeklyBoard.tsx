'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { CreateTaskButton } from '@/components/CreateTaskButton';
import { TaskCheckItem, type CheckTask } from '@/components/TaskCheckItem';

type Day = { key: string; short: string; date: string | null; dayNumber: number | null; full: string };

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function ymd(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}

function todayYmd() {
  return ymd(new Date());
}

const subscribeToLocalDate = () => () => {};
const getServerDateSnapshot = () => null;

function getWeek(today: string, offset: number) {
  const monday = new Date(`${today}T12:00:00`);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + offset * 7);
  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
  const days: Day[] = dates.map((date, index) => ({
    key: ymd(date),
    short: DAY_NAMES[index],
    date: ymd(date),
    dayNumber: date.getDate(),
    full: date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }),
  }));
  days.push({ key: 'weekly', short: 'Weekly', date: null, dayNumber: null, full: 'Weekly tasks' });
  const weekLabel = `${dates[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${dates[6].toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  return { days, weekLabel, start: ymd(dates[0]), end: ymd(dates[6]) };
}

export function WeeklyBoard({ allTasks }: { allTasks: CheckTask[] }) {
  const today = useSyncExternalStore(subscribeToLocalDate, todayYmd, getServerDateSnapshot);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
  const week = useMemo(() => today ? getWeek(today, weekOffset) : null, [today, weekOffset]);
  const activeKey = selectedKey ?? (weekOffset === 0 ? today : week?.start);

  const tasksByKey = useMemo(() => {
    if (!week) return {};
    const grouped: Record<string, CheckTask[]> = Object.fromEntries(week.days.map((day) => [day.key, []]));
    for (const task of allTasks) {
      const planned = String(task.task.plannedDate ?? '').slice(0, 10);
      if (planned < week.start || planned > week.end) continue;
      grouped[task.task.isWeekly ? 'weekly' : planned]?.push(task);
    }
    return grouped;
  }, [allTasks, week]);

  if (!week) return <div className="min-h-[60vh]" aria-busy="true" />;

  const activeDay = week.days.find((day) => day.key === activeKey) ?? week.days[0];
  const selectedTasks = tasksByKey[activeDay.key] ?? [];
  const doneCount = selectedTasks.filter((item) => item.task.status === 'COMPLETED').length;
  const visibleTasks = selectedTasks.filter((item) => filter === 'all' || (filter === 'done' ? item.task.status === 'COMPLETED' : item.task.status !== 'COMPLETED'));

  function changeWeek(offset: number) {
    setWeekOffset(offset);
    setSelectedKey(null);
    setFilter('all');
  }

  function selectDay(key: string) {
    setSelectedKey(key);
    setFilter('all');
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-[var(--ink)] sm:text-2xl">
            <CalendarDays className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
            My tasks
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">Pick a day to see and manage its tasks.</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => changeWeek(weekOffset - 1)} aria-label="Previous week" className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--surface-2)]">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => changeWeek(0)} className="min-h-11 rounded-xl border border-[var(--line)] bg-white px-3 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)]">Today</button>
          <button type="button" onClick={() => changeWeek(weekOffset + 1)} aria-label="Next week" className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-[var(--surface-2)]">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <section aria-label="Choose a day" className="rounded-2xl border border-[var(--line)] bg-white p-3 shadow-sm sm:p-4">
        <p className="mb-3 px-1 text-sm font-semibold text-[var(--muted)]">{week.weekLabel}</p>
        <div className="grid grid-cols-4 gap-2 lg:grid-cols-8">
          {week.days.map((day) => {
            const tasks = tasksByKey[day.key] ?? [];
            const active = day.key === activeDay.key;
            return (
              <button
                key={day.key}
                type="button"
                onClick={() => selectDay(day.key)}
                aria-pressed={active}
                aria-label={`${day.full}: ${tasks.length} tasks, ${tasks.filter((item) => item.task.status === 'COMPLETED').length} completed`}
                className={`flex min-h-20 min-w-0 flex-col items-start rounded-xl border p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:p-2.5 ${active ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-sm shadow-blue-600/20' : 'border-[var(--line)] bg-[var(--surface-2)]/50 text-[var(--ink)] hover:border-blue-300 hover:bg-[var(--accent-soft)]/50'}`}
              >
                <span className={`text-[11px] font-semibold ${active ? 'text-blue-100' : 'text-[var(--muted)]'}`}>{day.short}</span>
                <span className="mt-0.5 text-lg font-bold tabular-nums sm:text-xl">{day.dayNumber ?? '•'}</span>
                <span className={`mt-auto text-[10px] font-medium tabular-nums sm:text-[11px] ${active ? 'text-blue-100' : 'text-[var(--muted)]'}`}>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="selected-day-heading" className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-4 sm:px-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="selected-day-heading" className="text-lg font-bold text-[var(--ink)] sm:text-xl">{activeDay.full}</h2>
              {activeDay.key === today && <span className="rounded-md bg-[var(--accent-soft)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--accent)]">Today</span>}
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">{selectedTasks.length ? `${selectedTasks.length - doneCount} to do · ${doneCount} completed` : 'Nothing planned yet'}</p>
          </div>
          <CreateTaskButton defaultDate={activeDay.date ?? week.start} weekly={activeDay.date === null} label={activeDay.date === null ? 'Add weekly task' : 'Add task'} />
        </div>

        {selectedTasks.length > 0 && (
          <div className="flex gap-1 overflow-x-auto border-b border-[var(--line)] px-4 py-2 sm:px-6" aria-label="Filter tasks">
            {(['all', 'open', 'done'] as const).map((option) => (
              <button key={option} type="button" onClick={() => setFilter(option)} aria-pressed={filter === option} className={`min-h-11 rounded-lg px-3 text-sm font-semibold transition-colors ${filter === option ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]'}`}>
                {option === 'all' ? `All ${selectedTasks.length}` : option === 'open' ? `To do ${selectedTasks.length - doneCount}` : `Done ${doneCount}`}
              </button>
            ))}
          </div>
        )}

        {visibleTasks.length ? (
          <ul className="divide-y divide-[var(--line)] px-3 py-1 sm:px-5" aria-label={`${activeDay.full} tasks`}>
            {visibleTasks.map((task, index) => (
              <TaskCheckItem key={task.task.id} data={task} roomy canMoveUp={filter === 'all' && index > 0} canMoveDown={filter === 'all' && index < visibleTasks.length - 1} />
            ))}
          </ul>
        ) : (
          <div className="px-5 py-14 text-center">
            <p className="font-semibold text-[var(--ink)]">{selectedTasks.length ? `No ${filter === 'done' ? 'completed' : 'open'} tasks` : 'A clear day'}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{selectedTasks.length ? 'Choose another filter to see your tasks.' : 'Add a task when you have something to do.'}</p>
          </div>
        )}
      </section>
    </div>
  );
}
