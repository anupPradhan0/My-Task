import { getNotes } from '@/app/actions';
import { NotesApp } from '@/components/NotesApp';

export default async function NotesPage() {
  const notes = await getNotes();
  return <NotesApp initialNotes={notes} />;
}
