"use client";

import { Trash2, Circle, PlayCircle, CheckCircle2, Pencil } from 'lucide-react';
import { updateTaskStatus, deleteTask } from '@/app/actions';
import { EditTaskModal } from '@/components/EditTaskModal';
import { useTransition, useState } from 'react';

type TaskListProps = {
  title: string;
  tasks: any[];
  color: 'blue' | 'orange' | 'teal';
};

const dotColor = {
  blue: 'bg-[var(--accent)]',
  orange: 'bg-[var(--warn)]',
  teal: 'bg-[var(--ok)]',
};

export function TaskList({ title, tasks, color }: TaskListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor[color]}`} />
          <span className="text-sm font-bold text-[var(--ink)]">{title}</span>
          <span className="text-[11px] font-semibold text-[var(--faint)] bg-[var(--surface-2)] px-1.5 py-0.5 rounded-md tabular-nums">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 flex-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-28 rounded-xl border border-dashed border-[var(--line)] bg-white/40">
            <p className="text-sm text-[var(--faint)] font-medium">No tasks</p>
          </div>
        ) : (
          tasks.map(t => <TaskItem key={t.task.id} data={t} />)
        )}
      </div>
    </div>
  );
}

function TaskItem({ data }: { data: any }) {
  const [isPending, startTransition] = useTransition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const isCompleted = data.task.status === 'COMPLETED';

  const setStatus = (status: string) => {
    startTransition(() => {
      updateTaskStatus(data.task.id, status);
    });
    setIsMenuOpen(false);
  };

  const handleDelete = () => {
    startTransition(() => {
      deleteTask(data.task.id);
    });
  };

  return (
    <>
      <div className={`group relative isolate flex flex-col gap-2.5 rounded-xl border border-[var(--line)]/80 bg-white p-3.5 shadow-sm shadow-slate-900/5 transition-shadow duration-200 sm:hover:shadow-md ${
        isCompleted ? 'opacity-55' : ''
      } ${isPending ? 'opacity-60 pointer-events-none' : ''} ${isMenuOpen ? 'z-20' : 'z-0'}`}>
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold leading-snug min-w-0 flex-1 ${
            isCompleted ? 'text-[var(--muted)] line-through' : 'text-[var(--ink)]'
          }`}>
            {data.task.title}
          </p>

          <div className="flex items-center shrink-0 -mr-1 -mt-1">
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="text-[var(--faint)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-lg p-2 transition-colors"
              title="Edit task"
              aria-label="Edit task"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="text-[var(--faint)] hover:text-red-500 hover:bg-red-50 rounded-lg p-2 transition-colors"
              title="Delete task"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="relative flex items-center gap-2 flex-wrap">
          <div className="relative">
            <button 
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-[var(--surface-2)] border border-[var(--line)]/70 min-h-9 bg-white"
            >
              {data.task.status === 'TODO' && <><Circle className="h-3.5 w-3.5 text-[var(--faint)]" /><span className="text-[var(--muted)]">To Do</span></>}
              {data.task.status === 'IN_PROGRESS' && <><PlayCircle className="h-3.5 w-3.5 text-[var(--accent)]" /><span className="text-[var(--accent)]">In Progress</span></>}
              {data.task.status === 'COMPLETED' && <><CheckCircle2 className="h-3.5 w-3.5 text-[var(--ok)]" /><span className="text-[var(--ok)]">Done</span></>}
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-[90]" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute left-0 top-full mt-1 w-44 rounded-xl border border-[var(--line)] bg-white p-1.5 shadow-lg z-[100]">
                  <button type="button" onClick={() => setStatus('TODO')} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-sm hover:bg-[var(--surface-2)] text-[var(--ink)]">
                    <Circle className="h-3.5 w-3.5 text-[var(--faint)]" /> To Do
                  </button>
                  <button type="button" onClick={() => setStatus('IN_PROGRESS')} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-sm hover:bg-[var(--surface-2)] text-[var(--accent)]">
                    <PlayCircle className="h-3.5 w-3.5 text-[var(--accent)]" /> In Progress
                  </button>
                  <button type="button" onClick={() => setStatus('COMPLETED')} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-sm hover:bg-[var(--surface-2)] text-[var(--ok)]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--ok)]" /> Done
                  </button>
                </div>
              </>
            )}
          </div>

          {data.category?.name && (
            <span className="inline-flex items-center rounded-md bg-[var(--accent-soft)] text-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold truncate max-w-[140px]">
              {data.category.name}
            </span>
          )}

          {(data.topic?.name || data.project?.name) && (
            <span className="inline-flex items-center rounded-md bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--muted)] truncate max-w-[140px]">
              {data.topic?.name || data.project?.name}
            </span>
          )}
        </div>
      </div>

      {isEditOpen && <EditTaskModal data={data} onClose={() => setIsEditOpen(false)} />}
    </>
  );
}
