'use client';

import { useEffect, useState, useTransition } from 'react';
import { addTimeEntry } from '@/app/actions';
import { Clock, X } from 'lucide-react';
import { ModalPortal } from '@/components/ModalPortal';

export function AddTimeModal({ taskId, taskTitle, onClose }: { taskId: string; taskTitle: string; onClose: () => void }) {
  const [minutes, setMinutes] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minutes) return;
    
    startTransition(async () => {
      const today = new Date().toISOString().split('T')[0];
      await addTimeEntry(taskId, parseInt(minutes, 10), today);
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
          className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl bg-white p-6 shadow-2xl pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Clock className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Log Time</h3>
            </div>
            <button onClick={onClose} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="mb-6 text-sm font-medium text-slate-500 truncate px-1">{taskTitle}</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Minutes Spent</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="e.g. 30"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">min</span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-[2] min-h-11 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 disabled:opacity-50 transition-all touch-manipulation"
              >
                {isPending ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
