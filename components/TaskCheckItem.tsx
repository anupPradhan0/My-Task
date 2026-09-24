'use client';

import { useState, useTransition } from 'react';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { deleteTask, updateTaskStatus } from '@/app/actions';
import { EditTaskModal } from '@/components/EditTaskModal';

export type CheckTask = {
  task: {
    id: string;
    title: string;
    status: string;
    plannedDate?: string;
    categoryId?: string;
    topicId?: string | null;
    projectId?: string | null;
  };
  category?: { name: string } | null;
  topic?: { name: string } | null;
  project?: { name: string } | null;
};

function tagFor(t: CheckTask) {
  return t.project?.name || t.topic?.name || t.category?.name || null;
}

export function TaskCheckItem({
  data,
  showDate = false,
}: {
  data: CheckTask;
  showDate?: boolean;
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
