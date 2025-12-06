import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import NotesIcon from '../icons/notesIcon';
import LibraryIcon from '../icons/libraryIcon';
import { AccountMenu } from './accountMenu';
import Link from 'next/link';

export function LessonsNav() {
  return (
    <TooltipProvider delayDuration={0}>
      <nav>
        <ul className="text-[var(--text-color-primary-800)] flex items-center gap-4">
          <li className="cursor-pointer">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/course/library">
                  <span>
                    <LibraryIcon className="w-6 h-6 hover:text-yellow-600 transition-colors duration-300 translate-y-[2px]" />
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Library</p>
              </TooltipContent>
            </Tooltip>
          </li>
          <li className="cursor-pointer">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/course/notes">
                  <NotesIcon className="w-6 h-6 hover:text-yellow-600 transition-colors duration-300" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notes</p>
              </TooltipContent>
            </Tooltip>
          </li>
          <li className="cursor-pointer">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <AccountMenu />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Account</p>
              </TooltipContent>
            </Tooltip>
          </li>
        </ul>
      </nav>
    </TooltipProvider>
  );
}
