'use client';

import { useState, useTransition } from 'react';
import { ArrowDown, ArrowUp, Check, Pencil, Trash2 } from 'lucide-react';
import { deleteTask, moveTask, updateTaskStatus } from '@/app/actions';
import { EditTaskModal } from '@/components/EditTaskModal';

export type CheckTask = {
  task: {
    id: string;
    title: string;
    status: string;
    plannedDate?: string;
    completedAt?: Date | string | null;
    isWeekly?: boolean;
    sortOrder?: number;
    createdAt?: Date | string;
    description?: string | null;
    categoryId?: string;
    topicId?: string | null;
    projectId?: string | null;
  };
  category?: { id?: string; name: string } | null;
  topic?: { id?: string; name: string } | null;
  project?: { id?: string; name: string } | null;
};

function tagFor(t: CheckTask) {
  return t.project?.name || t.topic?.name || t.category?.name || null;
}

export function TaskCheckItem({
  data,
  showDate = false,
  canMoveUp = false,
  canMoveDown = false,
}: {
  data: CheckTask;
  showDate?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const done = data.task.status === 'COMPLETED';
  const tag = tagFor(data);

  const toggle = () => {
    startTransition(() => {
      updateTaskStatus(data.task.id, done ? 'TODO' : 'COMPLETED');
    });
  };

  const handleDelete = () => {
    if (!confirm('Delete this task?')) return;
    startTransition(() => {
      deleteTask(data.task.id);
    });
  };

  const handleMove = (direction: 'up' | 'down') => {
    startTransition(() => {
      moveTask(data.task.id, direction);
    });
  };

  return (
    <>
      <li
        className={`group flex min-w-0 items-start gap-2 rounded-lg px-1 py-1.5 -mx-0.5 transition-colors hover:bg-[var(--surface-2)] ${
          isPending ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <button
          type="button"
          onClick={toggle}
          disabled={isPending}
          aria-label={done ? 'Mark incomplete' : 'Mark complete'}
          className="relative mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center touch-manipulation before:absolute before:-inset-3 before:content-['']"
        >
          <span
            className={`flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border-2 transition-colors ${
              done
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-slate-400 bg-white'
            }`}
          >
            {done ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm leading-snug break-words ${
              done ? 'text-slate-400 line-through' : 'text-[var(--ink)]'
            }`}
          >
            <span className="font-medium">{data.task.title}</span>
            {tag ? (
              <span className={`ml-1 font-semibold ${done ? 'text-slate-400' : 'text-[var(--accent)]'}`}>
                -{tag}
              </span>
            ) : null}
          </p>
          {showDate && data.task.plannedDate ? (
            <p className={`mt-0.5 text-[11px] tabular-nums ${done ? 'text-slate-400' : 'text-[var(--muted)]'}`}>
              {String(data.task.plannedDate).slice(0, 10)}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity">
          {(canMoveUp || canMoveDown) && (
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => handleMove('up')}
                disabled={isPending || !canMoveUp}
                className="rounded-md p-1 text-[var(--faint)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] disabled:opacity-30 disabled:pointer-events-none touch-manipulation"
                title="Move up"
                aria-label="Move task up"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => handleMove('down')}
                disabled={isPending || !canMoveDown}
                className="rounded-md p-1 text-[var(--faint)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] disabled:opacity-30 disabled:pointer-events-none touch-manipulation"
                title="Move down"
                aria-label="Move task down"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="rounded-lg p-2 text-[var(--faint)] hover:bg-[var(--accent-soft)] hover:text-[var(--accent)] transition-colors touch-manipulation"
            title="Edit task"
            aria-label="Edit task"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg p-2 text-[var(--faint)] hover:bg-red-50 hover:text-red-500 transition-colors touch-manipulation"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </li>

      {isEditOpen && <EditTaskModal data={data} onClose={() => setIsEditOpen(false)} />}
    </>
  );
}
