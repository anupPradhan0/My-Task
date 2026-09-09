'use client';

import { Plus } from 'lucide-react';
import { useState, useEffect, useTransition } from 'react';
import { createTask, getCategories, getTopics, getProjects } from '@/app/actions';

export function CreateTaskButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add Task</span>
      </button>

      {isOpen && <CreateTaskModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

function CreateTaskModal({ onClose }: { onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [plannedDate, setPlannedDate] = useState(() => new Date().toISOString().split('T')[0]);

  useEffect(() => {
    async function loadData() {
      const [cats, tops, projs] = await Promise.all([getCategories(), getTopics(), getProjects()]);
      setCategories(cats);
      setTopics(tops);
      setProjects(projs);
      if (cats.length > 0) setCategoryId(cats[0].id);
    }
    loadData();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="mb-6 text-xl font-bold text-slate-800 tracking-tight">Create New Task</h3>
        
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

          <div className="grid grid-cols-2 gap-4">
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
            <div className="animate-in slide-in-from-top-2 duration-300">
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
            <div className="animate-in slide-in-from-top-2 duration-300">
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
          
          <div className="mt-8 flex gap-3 pt-2">
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
      </div>
    </div>
  );
}
