'use client';

import useWindowSize from '@/hooks/useWindowSize';
import styles from '../../app/course/[moduleSlug]/[lessonSlug]/lesson.module.css';
import SideBarSheet from './sidebarSheet';
import HomeIcon from '../icons/homeIcon';
import Link from 'next/link';
import { formatModuleSlug } from '@/lib/utils';
import { LessonStatus } from '../progress/LessonStatus';

type SidebarProps = {
  moduleBadge?: string;
  moduleSlug: string;
  lessons: { slug: string; title: string; parent: string | null }[];
};

function Sidebar({ moduleBadge, moduleSlug, lessons }: SidebarProps) {
  const { width } = useWindowSize();
  const effectiveWidth = width ?? 0;
  return effectiveWidth < 1199 && effectiveWidth > 768 ? (
    <aside>
      <SideBarSheet
        moduleBadge={moduleBadge}
        moduleSlug={moduleSlug}
        lessons={lessons}
      />
    </aside>
  ) : (
    <aside className={`${styles.sidebar}  bg-[var(--bg-color)] pl-4 pr-8 `}>
      <div className="fixed">
        <header className="h-[3rem] flex items-center mb-4">
          <Link href={'/course'}>
            <span>
              <HomeIcon className="w-6 h-6 text-[var(--text-color-primary-800)]" />
            </span>
          </Link>
        </header>
        <h2 className="flex flex-col mb-6 text-xl font-semibold text-[var(--text-color-primary-800)] ">
          <span className="text-[var(--text-color-primary-600)] font-normal text-base">
            {moduleBadge}
          </span>
          {formatModuleSlug(moduleSlug)}
        </h2>
        <div className={``}>
          <ul>
            {lessons.map((lesson) => (
              <li
                key={lesson.slug}
                className={`text-[var(--text-color-primary-800)] p-2 rounded-lg -ml-2 hover:bg-[var(--text-color-primary-300)] transition-colors duration-200 ${
                  lesson.parent ? 'pl-8 text-sm' : ''
                }`}
              >
                <Link
                  className="flex justify-between items-center"
                  href={`/course/${moduleSlug}/${lesson.slug}`}
                >
                  <span className="pr-2">{lesson.title}</span>
                  <LessonStatus
                    moduleSlug={moduleSlug}
                    lessonSlug={lesson.slug}
                  />
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
