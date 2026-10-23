'use client';

import { useId, useState, useTransition } from 'react';
import { ArrowDown, ArrowUp, Check, Ellipsis, Pencil, Trash2 } from 'lucide-react';
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

export function TaskCheckItem({
  data,
  showDate = false,
  canMoveUp = false,
  canMoveDown = false,
  roomy = false,
}: {
  data: CheckTask;
  showDate?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  roomy?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const actionsId = useId();
  const done = data.task.status === 'COMPLETED';
  const tag = data.project?.name || data.topic?.name || data.category?.name;

  const toggle = () => {
    startTransition(() => {
      updateTaskStatus(data.task.id, done ? 'TODO' : 'COMPLETED');
    });
  };

  const handleDelete = () => {
    if (!confirm('Delete this task?')) return;
    setIsActionsOpen(false);
    startTransition(() => {
      deleteTask(data.task.id);
    });
  };

  const handleMove = (direction: 'up' | 'down') => {
    setIsActionsOpen(false);
    startTransition(() => {
      moveTask(data.task.id, direction);
    });
  };

  return (
    <>
      <li className={`grid min-w-0 grid-cols-[36px_minmax(0,1fr)_44px] items-start gap-x-2 gap-y-2 rounded-xl px-2 py-3.5 transition-colors hover:bg-[var(--surface-2)] sm:px-3 ${roomy ? 'sm:grid-cols-[36px_minmax(0,1fr)_76px_44px]' : ''} ${isPending ? 'pointer-events-none opacity-50' : ''}`}>
        <button
          type="button"
          onClick={toggle}
          disabled={isPending}
          aria-label={`${done ? 'Mark incomplete' : 'Mark complete'}: ${data.task.title}`}
          className="flex h-11 w-9 items-center justify-start touch-manipulation"
        >
          <span className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-colors ${done ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-slate-400 bg-white hover:border-[var(--accent)]'}`}>
            {done && <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />}
          </span>
        </button>

        <div className="min-w-0 pt-2">
          <p className={`text-sm font-medium leading-relaxed [overflow-wrap:anywhere] ${done ? 'text-slate-500 line-through decoration-slate-300' : 'text-[var(--ink)]'}`}>
            {data.task.title}
          </p>
          {(tag || (showDate && data.task.plannedDate)) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {tag && <span className="max-w-full rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 [overflow-wrap:anywhere]">{tag}</span>}
              {showDate && data.task.plannedDate && <span className="text-[11px] tabular-nums text-[var(--muted)]">{String(data.task.plannedDate).slice(0, 10)}</span>}
            </div>
          )}
        </div>

        {roomy && (
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            aria-label={`Edit ${data.task.title}`}
            className="hidden min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-[var(--muted)] hover:bg-white hover:text-[var(--accent)] sm:flex"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsActionsOpen((open) => !open)}
          aria-label={`More actions for ${data.task.title}`}
          aria-expanded={isActionsOpen}
          aria-controls={isActionsOpen ? actionsId : undefined}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
        >
          <Ellipsis className="h-5 w-5" aria-hidden="true" />
        </button>

        {isActionsOpen && (
          <div id={actionsId} className="col-start-2 col-end-[-1] flex flex-wrap gap-1 rounded-lg border border-[var(--line)] bg-white p-1.5 shadow-sm" role="group" aria-label={`Actions for ${data.task.title}`}>
            <button type="button" onClick={() => { setIsActionsOpen(false); setIsEditOpen(true); }} className="flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)]">
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
            </button>
            {(canMoveUp || canMoveDown) && (
              <>
                <button type="button" onClick={() => handleMove('up')} disabled={!canMoveUp} className="flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] disabled:opacity-35">
                  <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /> Move up
                </button>
                <button type="button" onClick={() => handleMove('down')} disabled={!canMoveDown} className="flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] disabled:opacity-35">
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" /> Move down
                </button>
              </>
            )}
            <button type="button" onClick={handleDelete} disabled={isPending} className="flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-red-600 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
            </button>
          </div>
        )}
      </li>

      {isEditOpen && <EditTaskModal data={data} onClose={() => setIsEditOpen(false)} />}
    </>
  );
}
