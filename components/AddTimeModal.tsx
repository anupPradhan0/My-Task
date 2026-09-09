'use client';

import { useState, useTransition } from 'react';
import { addTimeEntry } from '@/app/actions';
import { Clock, X } from 'lucide-react';

export function AddTimeModal({ taskId, taskTitle, onClose }: { taskId: string; taskTitle: string; onClose: () => void }) {
  const [minutes, setMinutes] = useState('');
  const [isPending, startTransition] = useTransition();

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
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
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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
              className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-[2] rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-600/20 disabled:opacity-50 transition-all"
            >
              {isPending ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
