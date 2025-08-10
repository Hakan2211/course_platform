'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useAuth } from '@/context/auth/AuthContext';

type LessonProgress = {
  id: string;
  user_id: string;
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
  refetchProgress: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined
);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, refreshSession } = useAuth();

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgress([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/progress', {
        credentials: 'include', // Ensure cookies are sent
      });

      if (response.status === 401) {
        // Try to refresh session first
        console.warn('Authentication required, trying to refresh session...');
        await refreshSession();
        return;
      }

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
  }, [user, refreshSession]);

  useEffect(() => {
    // Only fetch progress if user is authenticated
    if (user) {
      // Add a small delay to ensure cookie is properly set after authentication
      const timer = setTimeout(() => {
        fetchProgress();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
      setProgress([]);
    }
  }, [user, fetchProgress]);

  const updateProgress = async (
    moduleSlug: string,
    lessonSlug: string,
    status: LessonProgress['status']
  ) => {
    if (!user) {
      console.warn('User not authenticated for progress update');
      return;
    }

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Ensure cookies are sent
        body: JSON.stringify({ moduleSlug, lessonSlug, status }),
      });

      if (response.status === 401) {
        console.warn('Authentication required, trying to refresh session...');
        await refreshSession();
        return;
      }

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
      value={{
        progress,
        isLoading,
        updateProgress,
        getLessonStatus,
        refetchProgress: fetchProgress,
      }}
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
