import { getCourseModules } from '@/helpers/file-helpers';
import Link from 'next/link';
import styles from './course.module.css';

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

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const formatModuleSlug = (slug: string) => {
  const formattedSlug = slug.replace(/^\d{2}-/, '');
  return capitalizeFirstLetter(formattedSlug);
};

export default async function CourseOverview() {
  const modules = await getCourseModules();

  return (
    <div
      className={`${styles.gridContainer} bg-[var(--bg-color)] tracking-[0.3px] h-[100dvh]`}
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
                <h2 className="font-semibold text-lg pb-4 text-[var(--text-color-primary-800)]">
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
                    className=""
                    href={`/course/${module.moduleSlug}/${lesson.slug}`}
                  >
                    <li
                      key={lesson.slug}
                      className={`text-[var(--text-color-primary-800)] p-2 rounded-lg -ml-2 hover:bg-[var(--text-color-primary-300)] transition-colors duration-200 ${
                        lesson.parent ? 'pl-8 text-sm' : ''
                      }`}
                    >
                      {lesson.title}
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
