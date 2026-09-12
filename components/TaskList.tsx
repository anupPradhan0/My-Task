"use client";

import { Trash2, Circle, PlayCircle, CheckCircle2, Pencil } from 'lucide-react';
import { updateTaskStatus, deleteTask, editTask } from '@/app/actions';
import { loadFormOptions } from '@/components/formOptions';
import { ModalPortal } from '@/components/ModalPortal';
import { useTransition, useState, useEffect } from 'react';

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
      
      <div className="space-y-2.5 flex-1">
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
      <div className={`group relative flex flex-col gap-2.5 rounded-xl border border-[var(--line)]/80 bg-white p-3.5 shadow-sm shadow-slate-900/5 transition-all duration-200 sm:hover:-translate-y-0.5 sm:hover:shadow-md ${
        isCompleted ? 'opacity-55' : ''
      } ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
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
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <button 
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors hover:bg-[var(--surface-2)] border border-[var(--line)]/70 min-h-9"
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

function FormSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div>
        <div className="mb-1.5 h-4 w-20 rounded bg-slate-200" />
        <div className="h-11 w-full rounded-xl bg-slate-100" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1.5 h-4 w-16 rounded bg-slate-200" />
          <div className="h-11 w-full rounded-xl bg-slate-100" />
        </div>
        <div>
          <div className="mb-1.5 h-4 w-12 rounded bg-slate-200" />
          <div className="h-11 w-full rounded-xl bg-slate-100" />
        </div>
      </div>
      <div className="mt-8 flex gap-3 pt-2">
        <div className="h-10 flex-1 rounded-xl bg-slate-100" />
        <div className="h-10 flex-[2] rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}

function EditTaskModal({ data, onClose }: { data: any; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [title, setTitle] = useState(data.task.title);
  const [categoryId, setCategoryId] = useState(data.task.categoryId || '');
  const [topicId, setTopicId] = useState(data.task.topicId || '');
  const [projectId, setProjectId] = useState(data.task.projectId || '');
  const [plannedDate, setPlannedDate] = useState(data.task.plannedDate || '');

  useEffect(() => {
    let cancelled = false;
    loadFormOptions().then(({ categories: cats, topics: tops, projects: projs }) => {
      if (cancelled) return;
      setCategories(cats);
      setTopics(tops);
      setProjects(projs);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const selectedCategory = categories.find(c => c.id === categoryId);
  const showTopics = selectedCategory?.name === 'Fundamentals';
  const showProjects = selectedCategory?.name === 'Projects';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await editTask(data.task.id, {
        title,
        categoryId,
        topicId: showTopics && topicId ? topicId : undefined,
        projectId: showProjects && projectId ? projectId : undefined,
        plannedDate,
      });
      onClose();
    });
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-slate-900/55 p-0 sm:p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white p-5 sm:p-7 shadow-2xl pb-[max(1.25rem,env(safe-area-inset-bottom))]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
          <h3 className="mb-5 sm:mb-6 text-xl font-bold text-slate-800 tracking-tight">Edit Task</h3>
          
          {loading ? (
            <FormSkeleton />
          ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Task Title</label>
              <input
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base sm:text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Category</label>
                <select
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base sm:text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white appearance-none"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Date</label>
                <input
                  type="date"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base sm:text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={plannedDate}
                  onChange={(e) => setPlannedDate(e.target.value)}
                />
              </div>
            </div>

            {showTopics && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Topic</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base sm:text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                >
                  <option value="">-- Select Topic --</option>
                  {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            )}

            {showProjects && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Project</label>
                <select
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base sm:text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  <option value="">-- Select Project --</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            )}
            
            <div className="mt-6 flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-[2] rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 disabled:opacity-50 transition-all"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}

