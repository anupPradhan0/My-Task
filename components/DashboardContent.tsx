'use client';

import { useSyncExternalStore } from 'react';
import { CheckCircle2, Flame, Target } from 'lucide-react';
import { TaskList } from '@/components/TaskList';
import { CreateTaskButton } from '@/components/CreateTaskButton';
import { BoardColumn, BoardColumns } from '@/components/Board';
import type { CheckTask } from '@/components/TaskCheckItem';

function localDateTime() {
  const now = new Date();
  const ymd = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  return `${ymd}|${now.getHours()}`;
}

const subscribe = () => () => {};
const getClientSnapshot = () => localDateTime();
const getServerSnapshot = () => null;

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardContent({ allTasks }: { allTasks: CheckTask[] }) {
  const localNow = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  if (!localNow) return <div className="min-h-[70vh]" aria-busy="true" />;

  const [todayStr, hourString] = localNow.split('|');
  const hour = Number(hourString);
  const today = new Date(`${todayStr}T12:00:00`);
  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const tasksToday = allTasks.filter((t) => String(t.task.plannedDate).slice(0, 10) === todayStr);
  const completedToday = tasksToday.filter((t) => t.task.status === 'COMPLETED').length;
  const weekStart = new Date(today);
  const day = weekStart.getDay();
  weekStart.setDate(weekStart.getDate() + (day === 0 ? -6 : 1 - day));
  const weekStartStr = [
    weekStart.getFullYear(),
    String(weekStart.getMonth() + 1).padStart(2, '0'),
    String(weekStart.getDate()).padStart(2, '0'),
  ].join('-');
  const completedThisWeek = allTasks.filter((t) => {
    if (t.task.status !== 'COMPLETED' || !t.task.completedAt) return false;
    const completedOn = new Date(t.task.completedAt);
    const date = [
      completedOn.getFullYear(),
      String(completedOn.getMonth() + 1).padStart(2, '0'),
      String(completedOn.getDate()).padStart(2, '0'),
    ].join('-');
    return date >= weekStartStr;
  }).length;

  const fundamentals = tasksToday.filter((t) => t.category?.name === 'Fundamentals');
  const dsa = tasksToday.filter((t) => t.category?.name === 'DSA');
  const projects = tasksToday.filter((t) => t.category?.name === 'Projects');
  const progress = tasksToday.length ? Math.round((completedToday / tasksToday.length) * 100) : 0;

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="flex items-start justify-between gap-3 anim-rise">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-[var(--faint)] mb-1.5 sm:mb-2">
            {dateLabel}
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
            {greetingForHour(hour)}
          </h1>
          <p className="text-[var(--muted)] mt-1.5 text-sm leading-snug">
            {tasksToday.length === 0
              ? 'No tasks for today — add one to get moving.'
              : `${completedToday} of ${tasksToday.length} done · ${progress}%`}
          </p>
        </div>
        <div className="hidden md:block shrink-0">
          <CreateTaskButton />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 stagger">
        <div className="surface anim-rise rounded-2xl p-3.5 sm:p-5 shadow-sm shadow-slate-900/5">
          <div className="mb-3 sm:mb-4 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
            <Target className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-[var(--muted)]">Today&apos;s focus</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">{tasksToday.length}</p>
            <span className="text-[11px] sm:text-xs font-medium text-[var(--faint)]">tasks</span>
          </div>
        </div>

        <div className="surface anim-rise rounded-2xl p-3.5 sm:p-5 shadow-sm shadow-slate-900/5">
          <div className="mb-3 sm:mb-4 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[var(--ok-soft)] text-[var(--ok)] flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-[var(--muted)]">Done today</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">{completedToday}</p>
            <span className="text-[11px] sm:text-xs font-medium text-[var(--faint)]">done</span>
          </div>
        </div>

        <div className="surface anim-rise rounded-2xl p-3.5 sm:p-5 shadow-sm shadow-slate-900/5 col-span-2 lg:col-span-1">
          <div className="mb-3 sm:mb-4 h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[var(--warn-soft)] text-[var(--warn)] flex items-center justify-center">
            <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-[var(--muted)]">Done this week</p>
          <div className="flex items-baseline gap-1.5 mt-1">
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">{completedThisWeek}</p>
            <span className="text-[11px] sm:text-xs font-medium text-[var(--faint)]">tasks</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 anim-rise" style={{ animationDelay: '0.14s' }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--ink)]">Today&apos;s board</h2>
          {tasksToday.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--muted)]">
              <div className="h-1.5 w-16 sm:w-24 rounded-full bg-[var(--surface-2)] overflow-hidden">
                <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              {progress}%
            </div>
          )}
        </div>

        <BoardColumns>
          <BoardColumn><TaskList title="Fundamentals" tasks={fundamentals} color="blue" /></BoardColumn>
          <BoardColumn><TaskList title="DSA" tasks={dsa} color="orange" /></BoardColumn>
          <BoardColumn><TaskList title="Projects" tasks={projects} color="teal" /></BoardColumn>
        </BoardColumns>
      </div>

      <CreateTaskButton fab />
    </div>
  );
}
