import { useState, useEffect, useRef } from 'react';

interface UseScrollSpyOptions {
  offset?: number;
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

/**
 * useScrollSpy hook to observe visibility of elements and determine the active one based on scroll position.
 *
 * @param {HTMLElement[]} elements - An array of DOM element references to be observed.
 * @param {UseScrollSpyOptions} options - Configuration options for the intersection observer.
 * @returns {number} - The index of the currently active element based on visibility.
 */

const useScrollSpy = (
  elements: HTMLElement[],
  options: UseScrollSpyOptions = {}
): number => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const lastIntersectingIndex = useRef<number>(-1);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const rootMargin = `0px 0px -80% 0px`;

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = elements.indexOf(entry.target as HTMLElement);
          if (entry.isIntersecting) {
            lastIntersectingIndex.current = index; // Update last intersecting index
            setActiveIndex(index); // Always set the active index to the last intersecting
          }
        });

        // If none are intersecting, default to the last known intersecting index
        const anyIntersecting = entries.some((entry) => entry.isIntersecting);
        if (!anyIntersecting && lastIntersectingIndex.current !== -1) {
          setActiveIndex(lastIntersectingIndex.current);
        }
      },
      {
        root: options.root || null,
        rootMargin,
        threshold: 0.1,
      }
    );

    elements.forEach((element) => {
      if (element && observer.current) {
        observer.current.observe(element);
      }
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [elements, options.root]);

  return activeIndex;
};

export default useScrollSpy;
