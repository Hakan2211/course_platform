import styles from './notes.module.css';
import HomeIcon from '@/components/icons/homeIcon';
import { LessonsNav } from '@/components/layout/lessonsNav';
import { getSession } from '@/lib/auth';
import { fetchNotes } from '@/lib/notesService';
import NotesCard from '@/components/notes/NotesCard';
import { deleteNote, Note } from '@/lib/notesCrud';
import Link from 'next/link';

async function Notes() {
  const session = await getSession();
  if (!session) {
    // Handle unauthorized state, e.g., redirect to login
    return <div>Unauthorized</div>;
  }
  const notes = await fetchNotes(session.userId);

  return (
    <div
      className={`${styles.notes_grid} gap-12 bg-[var(--bg-color)] min-h-[100%] `}
    >
      <div
        className={`text-[var(--text-color-primary-800)] flex flex-col items-end justify-start px-8 py-4`}
      >
        <Link className="" href="/course">
          <HomeIcon className="w-6 h-6 hover:text-yellow-600 transition-all duration-300 " />
        </Link>
      </div>{' '}
      <main className={`${styles.content}`}>
        <div className={'flex justify-end px-2 py-2'}>
          <LessonsNav />
        </div>
        <div
          className={`${styles.content_grid} text-[var(--text-color-primary-800)] md:mr-2 md:ml-2 px-2 md:px-16 pt-16 pb-24 border border-[var(--text-color-primary-300)] rounded-lg  bg-[var(--bg-color)]`}
        >
          <div className={`${styles.content_area}`}>
            <h1 className="mb-10">Your Notes</h1>
            <div className={`${styles.cards_grid}`}>
              {notes.map((note: Note) => (
                <NotesCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Notes;
