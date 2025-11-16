'use client';

import useWindowSize from '@/hooks/useWindowSize';
import styles from '../../app/course/[moduleSlug]/[lessonSlug]/lesson.module.css';
import SideBarSheet from './sidebarSheet';
import HomeIcon from '../icons/homeIcon';
import Link from 'next/link';
import { formatModuleSlug } from '@/lib/utils';
import { LessonStatus } from '../progress/LessonStatus';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type SidebarProps = {
  moduleBadge?: string;
  moduleSlug: string;
  lessonSlug: string;
  lessons: { slug: string; title: string; parent: string | null }[];
};

function Sidebar({
  moduleBadge,
  moduleSlug,
  lessonSlug,
  lessons,
}: SidebarProps) {
  const { width } = useWindowSize();
  const effectiveWidth = width ?? 0;
  return effectiveWidth < 1199 && effectiveWidth > 768 ? (
    <aside>
      <SideBarSheet
        moduleBadge={moduleBadge}
        moduleSlug={moduleSlug}
        lessonSlug={lessonSlug}
        lessons={lessons}
      />
    </aside>
  ) : (
    <aside className={`${styles.sidebar}  bg-[var(--bg-color)] pl-4 pr-8`}>
      <div className="sticky top-0 w-full">
        <header className="h-[3rem] flex items-center mb-4">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={'/course'}>
                  <span className="">
                    <HomeIcon className="w-6 h-6 text-[var(--text-color-primary-800)] hover:text-yellow-600 transition-colors duration-300" />
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </header>
        <h2 className="flex flex-col mb-6 text-xl font-semibold text-[var(--text-color-primary-800)] ">
          <span className="text-[var(--text-color-primary-600)] font-normal text-base">
            {moduleBadge}
          </span>
          {formatModuleSlug(moduleSlug)}
        </h2>
        <div className="">
          <ul>
            {lessons.map((lesson) => (
              <li
                key={lesson.slug}
                className={`w-full  text-[var(--text-color-primary-800)] p-2 rounded-lg -ml-2 hover:bg-gradient-to-r from-gray-950/90 to-black/90 transition-colors duration-200 ${
                  lesson.parent ? 'pl-8 text-sm' : ''
                } ${
                  lesson.slug === lessonSlug
                    ? 'bg-[var(--text-color-primary-300)]'
                    : ''
                }`}
              >
                <Link
                  className="w-full flex justify-between items-center gap-8"
                  href={`/course/${moduleSlug}/${lesson.slug}`}
                >
                  <span
                    className="flex-1 min-w-0 whitespace-normal break-words"
                    title={lesson.title}
                  >
                    {lesson.title}
                  </span>
                  <span className="flex-shrink-0">
                    <LessonStatus
                      moduleSlug={moduleSlug}
                      lessonSlug={lesson.slug}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
