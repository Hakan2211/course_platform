'use client';

import { Button } from '@/components/ui/button';
import { useProgress } from '@/context/progress/ProgressContext';

type ProgressButtonProps = {
  moduleSlug: string;
  lessonSlug: string;
};

export function ProgressButton({
  moduleSlug,
  lessonSlug,
}: ProgressButtonProps) {
  const { getLessonStatus, updateProgress } = useProgress();
  const status = getLessonStatus(moduleSlug, lessonSlug);

  const handleClick = async () => {
    const newStatus = status === 'completed' ? 'not_started' : 'completed';
    await updateProgress(moduleSlug, lessonSlug, newStatus);
  };

  return (
    <Button
      onClick={handleClick}
      variant={status === 'completed' ? 'outline' : 'default'}
      className="mt-8 bg-slate-500"
    >
      {status === 'completed' ? 'Mark as Incomplete' : 'Mark as Complete'}
    </Button>
  );
}