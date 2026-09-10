import { Check, Trash2, MoreHorizontal, Circle, PlayCircle, CheckCircle2, Pencil } from 'lucide-react';
import { updateTaskStatus, deleteTask, editTask, getCategories, getTopics, getProjects } from '@/app/actions';
import { useTransition, useState, useEffect } from 'react';

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
      <div className={`group relative flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all hover:shadow-md ${
        isCompleted ? 'opacity-60 bg-slate-50/50' : ''
      }`}>
        <div className="flex items-start justify-between gap-3">
          <p className={`text-sm font-medium leading-snug ${
            isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'
          }`}>
            {data.task.title}
          </p>

          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity -mr-1 -mt-1">
            <button
              onClick={() => setIsEditOpen(true)}
              className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded p-1"
              title="Edit task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded p-1"
              title="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
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

          {data.category?.name && (
            <span className="inline-flex items-center rounded-sm bg-blue-50 text-blue-600 px-1.5 py-0.5 text-[10px] font-medium truncate max-w-[120px]">
              {data.category.name}
            </span>
          )}

          {(data.topic?.name || data.project?.name) && (
            <span className="inline-flex items-center rounded-sm bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 truncate max-w-[120px]">
              {data.topic?.name || data.project?.name}
            </span>
          )}
        </div>
      </div>

      {isEditOpen && <EditTaskModal data={data} onClose={() => setIsEditOpen(false)} />}
    </>
  );
}

function EditTaskModal({ data, onClose }: { data: any; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [title, setTitle] = useState(data.task.title);
  const [categoryId, setCategoryId] = useState(data.task.categoryId || '');
  const [topicId, setTopicId] = useState(data.task.topicId || '');
  const [projectId, setProjectId] = useState(data.task.projectId || '');
  const [plannedDate, setPlannedDate] = useState(data.task.plannedDate || '');

  useEffect(() => {
    async function loadData() {
      const [cats, tops, projs] = await Promise.all([getCategories(), getTopics(), getProjects()]);
      setCategories(cats);
      setTopics(tops);
      setProjects(projs);
    }
    loadData();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="mb-6 text-xl font-bold text-slate-800 tracking-tight">Edit Task</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Task Title</label>
            <input
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
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
                <option value="">-- Select --</option>
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
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

