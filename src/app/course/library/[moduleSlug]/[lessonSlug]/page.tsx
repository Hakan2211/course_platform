import { MDXRemote } from 'next-mdx-remote/rsc';
import { loadLibraryContent, getLibraryModules } from '@/helpers/file-helpers';
import styles from '../../../[moduleSlug]/[lessonSlug]/lesson.module.css';
import Sidebar from '@/components/layout/sidebar';
import LessonsHeader from '@/components/layout/lessonsHeader';
import COMPONENT_MAP from '@/helpers/mdx-components-map';
import TableOfContents from '@/components/layout/tableOfContents/tableOfContents';
import { NextLessonButton } from '@/components/progress/NextLessonButton';

export const generateStaticParams = async () => {
  const modules = await getLibraryModules();

  return modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      moduleSlug: module.moduleSlug,
      lessonSlug: lesson.slug,
    }))
  );
};

type LessonDetailProps = {
  params: {
    moduleSlug: string;
    lessonSlug: string;
  };
};

export default async function LibraryDetail({ params }: LessonDetailProps) {
  const { moduleSlug, lessonSlug } = params;

  const lessonContent = await loadLibraryContent(moduleSlug, lessonSlug);

  if (!lessonContent) {
    return <div>Content not found</div>;
  }

  const { frontmatter, content, headings } = lessonContent;
  const modules = await getLibraryModules();
  const currentModuleIndex = modules.findIndex(
    (module) => module.moduleSlug === moduleSlug
  );
  const currentModule = modules[currentModuleIndex];
  const lessons = currentModule?.lessons || [];

  const currentLessonIndex = lessons.findIndex(
    (lesson) => lesson.slug === lessonSlug
  );

  let nextItem = null;

  if (currentLessonIndex < lessons.length - 1) {
    // Next lesson in the same module
    nextItem = {
      type: 'lesson' as const,
      moduleSlug,
      lessonSlug: lessons[currentLessonIndex + 1].slug,
    };
  } else if (currentModuleIndex < modules.length - 1) {
    // First lesson of the next module
    const nextModule = modules[currentModuleIndex + 1];
    if (nextModule.lessons.length > 0) {
      nextItem = {
        type: 'module' as const,
        moduleSlug: nextModule.moduleSlug,
        lessonSlug: nextModule.lessons[0].slug,
      };
    }
  }

  return (
    <div
      className={`${styles.lessons_grid} gap-12 bg-[var(--bg-color)] min-h-[100%] `}
    >
      <Sidebar
        moduleBadge={frontmatter.moduleBadge}
        moduleSlug={moduleSlug}
        lessonSlug={lessonSlug}
        lessons={lessons}
        basePath="/course/library"
      />

      <main className={`${styles.content}`}>
        <LessonsHeader
          moduleBadge={frontmatter.moduleBadge}
          moduleSlug={moduleSlug}
          lessons={lessons}
          lessonSlug={lessonSlug}
          basePath="/course/library"
        />
        <div
          className={`${styles.content_grid} text-[var(--text-color-primary-800)] md:mr-2 md:ml-2 px-2 md:px-16 pt-16 pb-24 border border-[var(--text-color-primary-300)] rounded-lg  bg-[var(--bg-color)]`}
        >
          <div className={`${styles.content_area}`}>
            <h1 className="mb-10">{frontmatter.title}</h1>
            <MDXRemote source={content} components={COMPONENT_MAP} />
          </div>
        </div>
        <div className="flex gap-4">
          <NextLessonButton
            moduleSlug={moduleSlug}
            lessonSlug={lessonSlug}
            nextItem={nextItem}
            basePath="/course/library"
            skipProgress={true}
          />
        </div>
      </main>
      <aside className={`${styles.table_of_contents} `}>
        <TableOfContents headings={headings} />
      </aside>
    </div>
  );
}
