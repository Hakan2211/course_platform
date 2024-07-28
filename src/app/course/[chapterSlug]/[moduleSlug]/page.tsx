import { MDXRemote } from 'next-mdx-remote/rsc';
import { loadModuleContent, getCourseChapters } from '@/helpers/file-helpers';

export const generateStaticParams = async () => {
  const chapters = await getCourseChapters();

  return chapters.flatMap((chapter) =>
    chapter.modules.map((module) => ({
      chapterSlug: chapter.chapterSlug,
      moduleSlug: module.slug, // Ensure moduleSlug does not include chapterSlug
    }))
  );
};

type ModuleDetailProps = {
  params: {
    chapterSlug: string;
    moduleSlug: string;
  };
};

export default async function ModuleDetail({ params }: ModuleDetailProps) {
  const { chapterSlug, moduleSlug } = params;
  const moduleContent = await loadModuleContent(chapterSlug, moduleSlug);

  if (!moduleContent) {
    return <div>Module not found</div>;
  }

  const { frontmatter, content } = moduleContent;

  return (
    <div>
      <h1>{frontmatter.title}</h1>
      <MDXRemote source={content} />
    </div>
  );
}
