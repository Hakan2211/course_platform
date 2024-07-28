// /app/course/page.js

import { getCourseChapters } from '@/helpers/file-helpers';
import { get } from 'http';
import Link from 'next/link';

export const metadata = {
  title: 'Course Overview',
};

interface ChapterType {
  chapterSlug: string;
  modules: {
    slug: string;
    title: string;
  }[];
}

export default async function CourseOverview() {
  const chapters = await getCourseChapters();

  return (
    <div>
      <h1>Course Overview</h1>
      {chapters.map((chapter: ChapterType) => (
        <div key={chapter.chapterSlug}>
          <h2>{chapter.chapterSlug}</h2>
          <ul>
            {chapter.modules.map((module) => (
              <li key={module.slug}>
                <Link href={`/course/${chapter.chapterSlug}/${module.slug}`}>
                  {module.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
