'use client';

import { useRouter } from 'next/navigation';
import { useTransition, MouseEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { LessonStatus } from '@/components/progress/LessonStatus';
import { cn } from '@/lib/utils';

interface Lesson {
  slug: string;
  title: string;
  parent: string | null;
}

interface LessonLinkProps {
  moduleSlug: string;
  lesson: Lesson;
  basePath?: string;
}

export function LessonLink({
  moduleSlug,
  lesson,
  basePath = '/course',
}: LessonLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const href = `${basePath}/${moduleSlug}/${lesson.slug}`;

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="block"
      onMouseEnter={() => router.prefetch(href)}
    >
      <li
        className={cn(
          'flex justify-between items-center text-[var(--text-color-primary-800)] p-2 rounded-lg -ml-2 hover:bg-[var(--text-color-primary-300)] transition-colors duration-200',
          lesson.parent ? 'pl-8 text-sm' : ''
        )}
      >
        <span>{lesson.title}</span>
        {isPending ? (
          <div className="w-5 h-5 flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-[var(--module-badge)]" />
          </div>
        ) : (
          <LessonStatus moduleSlug={moduleSlug} lessonSlug={lesson.slug} />
        )}
      </li>
    </a>
  );
}
