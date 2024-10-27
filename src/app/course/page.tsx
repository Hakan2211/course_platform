import { getCourseModules } from '@/helpers/file-helpers';
import Link from 'next/link';
import styles from './course.module.css';
import { formatModuleSlug } from '@/lib/utils';
import { LessonStatus } from '@/components/progress/LessonStatus';

export const metadata = {
  title: 'Course Overview',
};

interface ModuleType {
  moduleSlug: string;
  lessons: {
    slug: string;
    title: string;
    order: number;
    parent: string | null;
    moduleBadge?: string;
    moduleDescription?: string;
  }[];
}

export default async function CourseOverview() {
  const modules = await getCourseModules();

  return (
    <div
      className={`${styles.gridContainer} bg-[var(--bg-color)] tracking-[0.3px] min-h-[100%]`}
    >
      <div className={styles.gridContent}>
        {modules.map((module: ModuleType) => (
          <div key={module.moduleSlug} className={styles.module}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-[50%] flex flex-col justify-center">
                {module.lessons[0]?.moduleBadge && (
                  <span className="text-[var(--module-badge)]">
                    {module.lessons[0].moduleBadge}
                  </span>
                )}
                <h2 className="font-semibold mt-0 text-lg pb-4 text-[var(--text-color-primary-800)]">
                  {formatModuleSlug(module.moduleSlug)}
                </h2>
                {module.lessons[0]?.moduleDescription && (
                  <p className="max-w-[36ch] text-[var(--text-color-primary-600)]">
                    {module.lessons[0].moduleDescription}
                  </p>
                )}
              </div>

              <div className="border-l border-[var(--text-color-primary-300)] my-1 mx-4 hidden md:block"></div>
              <div className="md:hidden w-full my-4 border-t border-[var(--text-color-primary-300)]"></div>
              <ul className="md:w-[50%] md:pl-[8px]">
                {module.lessons.map((lesson) => (
                  <Link
                    key={lesson.slug}
                    className=""
                    href={`/course/${module.moduleSlug}/${lesson.slug}`}
                  >
                    <li
                      className={`flex justify-between items-center text-[var(--text-color-primary-800)] p-2 rounded-lg -ml-2 hover:bg-[var(--text-color-primary-300)] transition-colors duration-200 ${
                        lesson.parent ? 'pl-8 text-sm' : ''
                      }`}
                    >
                      <span>{lesson.title}</span>{' '}
                      <LessonStatus
                        moduleSlug={module.moduleSlug}
                        lessonSlug={lesson.slug}
                      />
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
