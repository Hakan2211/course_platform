import UserIcon from '../icons/userIcon';
import NotesIcon from '../icons/notesIcon';
import LibraryIcon from '../icons/libraryIcon';

export function LessonsNav() {
  return (
    <nav>
      <ul className="text-[var(--text-color-primary-800)] flex items-center gap-4">
        <li className="cursor-pointer">
          <LibraryIcon className="w-6 h-6 hover:text-yellow-600 transition-colors duration-300" />
        </li>
        <li className="cursor-pointer">
          <NotesIcon className="w-6 h-6 hover:text-yellow-600 transition-colors duration-300" />
        </li>
        <li className="cursor-pointer">
          <UserIcon className="w-6 h-6 hover:text-yellow-600 transition-colors duration-300 " />
        </li>
      </ul>
    </nav>
  );
}
