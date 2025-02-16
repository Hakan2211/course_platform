'use client';

import { useProgress } from '@/context/progress/ProgressContext';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

type NextLessonButtonProps = {
  moduleSlug: string;
  lessonSlug: string;
  nextItem: {
    type: 'lesson' | 'module';
    moduleSlug: string;
    lessonSlug?: string;
  } | null;
};

export function NextLessonButton({
  moduleSlug,
  lessonSlug,
  nextItem,
}: NextLessonButtonProps) {
  const router = useRouter();
  const { updateProgress } = useProgress();

  const handleClick = async () => {
    await updateProgress(moduleSlug, lessonSlug, 'completed');

    if (nextItem) {
      router.push(`/course/${nextItem.moduleSlug}/${nextItem.lessonSlug}`);
    }
  };

  if (!nextItem) {
    return null; // Don't render the button if there's no next item
  }

  const buttonText = nextItem.type === 'lesson' ? 'Next Lesson' : 'Next Module';
  return (
    <Button className="my-8" onClick={handleClick} variant="notStartedButton">
      {buttonText}
    </Button>
  );
}
