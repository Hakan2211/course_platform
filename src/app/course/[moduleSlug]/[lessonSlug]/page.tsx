import { MDXRemote } from 'next-mdx-remote/rsc';
import { loadLessonContent, getCourseModules } from '@/helpers/file-helpers';
import styles from './lesson.module.css';
import Sidebar from '@/components/layout/sidebar';
import LessonsHeader from '@/components/layout/lessonsHeader';

export const generateStaticParams = async () => {
  const modules = await getCourseModules();

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

export default async function LessonDetail({ params }: LessonDetailProps) {
  const { moduleSlug, lessonSlug } = params;
  console.log(
    `Loading content for module: ${moduleSlug}, lesson: ${lessonSlug}`
  );
  const lessonContent = await loadLessonContent(moduleSlug, lessonSlug);

  if (!lessonContent) {
    console.warn(
      `Lesson not found for module: ${moduleSlug}, lesson: ${lessonSlug}`
    );
    return <div>Lesson not found</div>;
  }

  const { frontmatter, content } = lessonContent;
  const modules = await getCourseModules();
  const currentModule = modules.find(
    (module) => module.moduleSlug === moduleSlug
  );
  const lessons = currentModule?.lessons || [];

  return (
    <div className={`${styles.lessons_grid} h-[100dvh] bg-[var(--bg-color)]`}>
      <Sidebar
        moduleBadge={frontmatter.moduleBadge}
        moduleSlug={moduleSlug}
        lessons={lessons}
      />
      <main className={`${styles.content}`}>
        <LessonsHeader
          moduleBadge={frontmatter.moduleBadge}
          moduleSlug={moduleSlug}
          lessons={lessons}
        />
        <div
          className={`${styles.content_grid} text-[var(--text-color-primary-800)] md:mr-4 px-2 md:px-16 pt-16 pb-24 border border-[var(--text-color-primary-500)] rounded-lg  bg-[var(--bg-color)]`}
        >
          <div className={`${styles.content_area}`}>
            <h1>{frontmatter.title}</h1>
            <MDXRemote source={content} />
          </div>
        </div>
      </main>
      <aside className={`${styles.table_of_contents} bg-blue-300`}>
        <div className={`bg-blue-300`}>Table of contents</div>
      </aside>
    </div>
  );
}
