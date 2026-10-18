'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { ArrowLeft, FilePlus2, StickyNote, Trash2 } from 'lucide-react';
import { createNote, deleteNote, updateNote } from '@/app/actions';

export type NoteRow = {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

function preview(content: string) {
  const line = content.replace(/\s+/g, ' ').trim();
  return line.slice(0, 80) || 'Empty note';
}

function formatWhen(value: Date | string) {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function NotesApp({ initialNotes }: { initialNotes: NoteRow[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedId, setSelectedId] = useState<string | null>(initialNotes[0]?.id ?? null);
  const [title, setTitle] = useState(initialNotes[0]?.title ?? '');
  const [content, setContent] = useState(initialNotes[0]?.content ?? '');
  // On phones: list vs editor. Desktop always shows both.
  const [mobilePane, setMobilePane] = useState<'list' | 'editor'>(
    initialNotes.length > 0 ? 'editor' : 'list'
  );
  const [isPending, startTransition] = useTransition();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selected = notes.find((n) => n.id === selectedId) ?? null;

  useEffect(() => {
    setNotes(initialNotes);
    if (!selectedId && initialNotes[0]) {
      setSelectedId(initialNotes[0].id);
      setTitle(initialNotes[0].title);
      setContent(initialNotes[0].content);
    }
  }, [initialNotes, selectedId]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const selectNote = (note: NoteRow) => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    setSelectedId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSaveState('idle');
    setMobilePane('editor');
  };

  const persist = (id: string, nextTitle: string, nextContent: string) => {
    setSaveState('saving');
    startTransition(async () => {
      const row = await updateNote(id, { title: nextTitle, content: nextContent });
      if (!row) return;
      setNotes((prev) => {
        const rest = prev.filter((n) => n.id !== row.id);
        return [row, ...rest];
      });
      setSaveState('saved');
    });
  };

  const scheduleSave = (nextTitle: string, nextContent: string) => {
    if (!selectedId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persist(selectedId, nextTitle, nextContent);
    }, 450);
  };

  const handleCreate = () => {
    startTransition(async () => {
      const row = await createNote();
      setNotes((prev) => [row, ...prev]);
      setSelectedId(row.id);
      setTitle(row.title);
      setContent(row.content);
      setSaveState('idle');
      setMobilePane('editor');
    });
  };

  const handleDelete = () => {
    if (!selectedId) return;
    if (!confirm('Delete this note?')) return;
    const id = selectedId;
    startTransition(async () => {
      await deleteNote(id);
      setNotes((prev) => {
        const next = prev.filter((n) => n.id !== id);
        const fallback = next[0] ?? null;
        setSelectedId(fallback?.id ?? null);
        setTitle(fallback?.title ?? '');
        setContent(fallback?.content ?? '');
        setMobilePane(fallback ? 'editor' : 'list');
        return next;
      });
      setSaveState('idle');
    });
  };

  const showListOnMobile = mobilePane === 'list';
  const showEditorOnMobile = mobilePane === 'editor';

  return (
    <div className="flex flex-col gap-3 sm:gap-5 min-h-0">
      <div className="anim-rise flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--faint)] mb-1.5 sm:mb-2">
            Scratchpad
          </p>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">Notes</h1>
          <p className="text-sm text-[var(--muted)] mt-1 hidden sm:block">
            Simple notes — write, edit, and keep ideas in one place.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={isPending}
          aria-label="New note"
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--ink)] h-11 w-11 sm:h-auto sm:w-auto sm:px-3.5 sm:py-2.5 text-sm font-semibold text-white shadow-sm transition-transform active:scale-[0.98] touch-manipulation"
        >
          <FilePlus2 className="h-4 w-4" />
          <span className="hidden sm:inline">New note</span>
        </button>
      </div>

      <div className="anim-rise grid gap-3 md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)] md:min-h-[min(70vh,720px)] md:flex-1">
        {/* Note list — full screen on mobile when in list pane */}
        <aside
          className={`surface rounded-2xl p-2 sm:p-2.5 shadow-sm flex-col min-h-0 ${
            showListOnMobile ? 'flex' : 'hidden'
          } md:flex ${showListOnMobile ? 'min-h-[60vh]' : ''} md:min-h-0`}
        >
          <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--faint)]">
            All notes ({notes.length})
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin space-y-1 max-h-[min(70vh,560px)] md:max-h-none">
            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-3 py-10 text-center">
                <StickyNote className="h-6 w-6 text-[var(--faint)]" />
                <p className="text-sm font-medium text-[var(--muted)]">No notes yet</p>
                <p className="text-xs text-[var(--faint)]">Tap + to create one.</p>
                <button
                  type="button"
                  onClick={handleCreate}
                  className="mt-2 rounded-xl bg-[var(--ink)] px-4 py-2.5 text-sm font-semibold text-white touch-manipulation md:hidden"
                >
                  New note
                </button>
              </div>
            ) : (
              notes.map((note) => {
                const active = note.id === selectedId;
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => selectNote(note)}
                    className={`w-full rounded-xl px-3 py-3 sm:py-2.5 text-left transition-colors touch-manipulation ${
                      active
                        ? 'bg-[var(--ink)] text-white'
                        : 'hover:bg-white/80 active:bg-white text-[var(--ink)]'
                    }`}
                  >
                    <p className={`truncate text-sm font-semibold ${active ? 'text-white' : ''}`}>
                      {note.title || 'Untitled'}
                    </p>
                    <p className={`mt-0.5 truncate text-xs ${active ? 'text-white/70' : 'text-[var(--muted)]'}`}>
                      {preview(note.content)}
                    </p>
                    <p className={`mt-1 text-[10px] tabular-nums ${active ? 'text-white/55' : 'text-[var(--faint)]'}`}>
                      {formatWhen(note.updatedAt)}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Editor — full screen on mobile when in editor pane */}
        <section
          className={`surface rounded-2xl p-3.5 sm:p-5 shadow-sm flex-col min-h-0 ${
            showEditorOnMobile ? 'flex' : 'hidden'
          } md:flex min-h-[min(70vh,640px)] md:min-h-0`}
        >
          {!selected ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center gap-2 px-4">
              <StickyNote className="h-8 w-8 text-[var(--faint)]" />
              <p className="font-semibold text-[var(--ink)]">Pick a note or create one</p>
              <p className="text-sm text-[var(--muted)]">Your notes stay here — plain and simple.</p>
              <button
                type="button"
                onClick={handleCreate}
                className="mt-2 rounded-xl bg-[var(--ink)] px-4 py-2.5 text-sm font-semibold text-white touch-manipulation"
              >
                New note
              </button>
            </div>
          ) : (
            <>
              <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <button
                    type="button"
                    onClick={() => setMobilePane('list')}
                    className="md:hidden inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--muted)] hover:bg-[var(--surface-2)] touch-manipulation"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Notes
                  </button>
                  <p className="text-xs font-medium text-[var(--faint)] tabular-nums truncate">
                    {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : 'Ready'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--muted)] hover:bg-red-50 hover:text-red-600 transition-colors touch-manipulation"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
              <input
                value={title}
                onChange={(e) => {
                  const next = e.target.value;
                  setTitle(next);
                  setNotes((prev) =>
                    prev.map((n) => (n.id === selectedId ? { ...n, title: next || 'Untitled' } : n))
                  );
                  scheduleSave(next, content);
                }}
                placeholder="Untitled"
                className="w-full bg-transparent text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--ink)] placeholder:text-[var(--faint)] focus:outline-none mb-2 sm:mb-3"
              />
              <textarea
                value={content}
                onChange={(e) => {
                  const next = e.target.value;
                  setContent(next);
                  setNotes((prev) =>
                    prev.map((n) => (n.id === selectedId ? { ...n, content: next } : n))
                  );
                  scheduleSave(title, next);
                }}
                placeholder="Start writing…"
                className="min-h-[50vh] md:min-h-[280px] flex-1 w-full resize-none bg-transparent text-base leading-relaxed text-[var(--ink)] placeholder:text-[var(--faint)] focus:outline-none"
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
