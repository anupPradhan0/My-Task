'use client';

import { Plus } from 'lucide-react';
import { useState, useEffect, useTransition } from 'react';
import { createTask } from '@/app/actions';
import { loadFormOptions } from '@/components/formOptions';
import { ModalPortal } from '@/components/ModalPortal';

export function CreateTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        <span className="hidden sm:inline">Add Task</span>
      </button>

      {isOpen && <CreateTaskModal onClose={() => setIsOpen(false)} />}
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

function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [plannedDate, setPlannedDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    let cancelled = false;
    loadFormOptions().then(({ categories: cats, topics: tops, projects: projs }) => {
      if (cancelled) return;
      setCategories(cats);
      setTopics(tops);
      setProjects(projs);
      if (cats.length > 0) setCategoryId(cats[0].id);
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
      await createTask({
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
          <h3 className="mb-5 sm:mb-6 text-xl font-bold text-slate-800 tracking-tight">Create New Task</h3>
          
          {loading ? (
            <FormSkeleton />
          ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Task Title</label>
              <input
                required
                placeholder="What needs to be done?"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white appearance-none"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Date</label>
                <input
                  type="date"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={plannedDate}
                  onChange={(e) => setPlannedDate(e.target.value)}
                />
              </div>
            </div>

            {showTopics && (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Topic</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white"
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
                className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-[2] rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 disabled:opacity-50 transition-all"
              >
                {isPending ? 'Saving...' : 'Create Task'}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </ModalPortal>
  );
}
