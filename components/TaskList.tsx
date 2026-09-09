'use client';

import { Check, Trash2, MoreHorizontal, Circle, PlayCircle, CheckCircle2 } from 'lucide-react';
import { updateTaskStatus, deleteTask } from '@/app/actions';
import { useTransition, useState } from 'react';

type TaskListProps = {
  title: string;
  tasks: any[];
  color: 'blue' | 'orange' | 'purple';
};

export function TaskList({ title, tasks, color }: TaskListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold text-slate-700`}>{title}</span>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-2.5 flex-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 opacity-60">
            <p className="text-sm text-slate-400 font-medium">No tasks</p>
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
    <div className={`group relative flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all hover:shadow-md ${
      isCompleted ? 'opacity-60 bg-slate-50/50' : ''
    }`}>
      <div className="flex items-start justify-between gap-3">
        <p className={`text-sm font-medium leading-snug ${
          isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'
        }`}>
          {data.task.title}
        </p>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 rounded p-1 -mr-1 -mt-1"
          title="Delete task"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        {/* Status Pill */}
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-colors hover:bg-slate-100 border border-slate-100"
          >
            {data.task.status === 'TODO' && <><Circle className="h-3 w-3 text-slate-400" /><span className="text-slate-600">To Do</span></>}
            {data.task.status === 'IN_PROGRESS' && <><PlayCircle className="h-3 w-3 text-blue-500" /><span className="text-blue-700">In Progress</span></>}
            {data.task.status === 'COMPLETED' && <><CheckCircle2 className="h-3 w-3 text-emerald-500" /><span className="text-emerald-700">Done</span></>}
          </button>

          {isMenuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
              <div className="absolute left-0 top-full mt-1 w-36 rounded-md border border-slate-200 bg-white p-1 shadow-lg z-20">
                <button onClick={() => setStatus('TODO')} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-slate-100 text-slate-700">
                  <Circle className="h-3 w-3 text-slate-400" /> To Do
                </button>
                <button onClick={() => setStatus('IN_PROGRESS')} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-slate-100 text-blue-700">
                  <PlayCircle className="h-3 w-3 text-blue-500" /> In Progress
                </button>
                <button onClick={() => setStatus('COMPLETED')} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-slate-100 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Done
                </button>
              </div>
            </>
          )}
        </div>

        {(data.topic?.name || data.project?.name) && (
          <span className="inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 truncate max-w-[120px]">
            {data.topic?.name || data.project?.name}
          </span>
        )}
      </div>
    </div>
  );
}

