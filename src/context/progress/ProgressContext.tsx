'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type LessonProgress = {
  module_slug: string;
  lesson_slug: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at: string | null;
};

type ProgressContextType = {
  progress: LessonProgress[];
  isLoading: boolean;
  updateProgress: (
    moduleSlug: string,
    lessonSlug: string,
    status: LessonProgress['status']
  ) => Promise<void>;
  getLessonStatus: (
    moduleSlug: string,
    lessonSlug: string
  ) => LessonProgress['status'];
};

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined
);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progress');
      if (response.ok) {
        const data = await response.json();
        // Ensure data.progress is an array
        if (Array.isArray(data.progress)) {
          setProgress(data.progress);
        } else {
          console.error('Unexpected progress format:', data);
          setProgress([]);
        }
      } else {
        console.error('Failed to fetch progress:', response.statusText);
        setProgress([]);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgress([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (
    moduleSlug: string,
    lessonSlug: string,
    status: LessonProgress['status']
  ) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleSlug, lessonSlug, status }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedProgress: LessonProgress = data.progress;

        setProgress((prev) => {
          const index = prev.findIndex(
            (p) => p.module_slug === moduleSlug && p.lesson_slug === lessonSlug
          );
          if (index === -1) {
            // LessonProgress not found, add it
            return [...prev, updatedProgress];
          }
          // LessonProgress found, update it
          const newProgress = [...prev];
          newProgress[index] = updatedProgress;
          return newProgress;
        });
      } else {
        console.error('Failed to update progress:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getLessonStatus = (moduleSlug: string, lessonSlug: string) => {
    const lessonProgress = progress.find(
      (p) => p.module_slug === moduleSlug && p.lesson_slug === lessonSlug
    );
    return lessonProgress?.status || 'not_started';
  };

  return (
    <ProgressContext.Provider
      value={{ progress, isLoading, updateProgress, getLessonStatus }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
