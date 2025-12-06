import { getLibraryModules } from '@/helpers/file-helpers';
import styles from '../course.module.css';
import { formatModuleSlug } from '@/lib/utils';
import Image from 'next/image';
import { NavBar } from '@/components/hero/NavBar';
import { LessonLink } from '../LessonLink';

export const metadata = {
  title: 'Library',
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
    moduleImage?: string;
  }[];
}

export default async function LibraryOverview() {
  const modules = await getLibraryModules();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-color)]">
      <div className="relative">
        <NavBar />
        <div className={`${styles.gridContainer}`}>
          <div className={`${styles.gridContent} pt-4 pb-12`}>
            <h1 className="text-4xl font-bold text-[var(--text-color-primary-800)] mb-4">
              Library
            </h1>
            <p className="text-[var(--text-color-primary-600)] max-w-2xl">
              Additional resources, market analysis, and educational content to
              supplement your trading journey.
            </p>
          </div>
        </div>
      </div>

      <div className={`${styles.gridContainer} tracking-[0.3px]`}>
        <div className={styles.gridContent}>
          {modules.map((module: ModuleType) => (
            <div key={module.moduleSlug} className={styles.module}>
              {module.lessons[0]?.moduleImage && (
                <div className={styles.moduleImageContainer}>
                  <Image
                    src={module.lessons[0].moduleImage}
                    alt={formatModuleSlug(module.moduleSlug)}
                    width={1200}
                    height={400}
                    className="w-full h-auto rounded-lg object-cover"
                    priority={false}
                  />
                </div>
              )}
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
                  {modules.flatMap((m) => m.lessons).length === 0 ? (
                    <p className="text-gray-500 italic">
                      No content available yet.
                    </p>
                  ) : (
                    module.lessons.map((lesson) => (
                      <LessonLink
                        key={lesson.slug}
                        moduleSlug={module.moduleSlug}
                        lesson={lesson}
                        basePath="/course/library"
                      />
                    ))
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
