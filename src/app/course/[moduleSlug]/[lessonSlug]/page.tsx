import { MDXRemote } from 'next-mdx-remote/rsc';
import { loadLessonContent, getCourseModules } from '@/helpers/file-helpers';

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

  return (
    <div>
      <h1>{frontmatter.title}</h1>
      <MDXRemote source={content} />
    </div>
  );
}
