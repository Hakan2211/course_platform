'use client';
import useWindowSize from '@/hooks/useWindowSize';
import SideBarSheet from './sidebarSheet';

type SidebarProps = {
  moduleBadge?: string;
  moduleSlug: string;
  lessons: { slug: string; title: string; parent: string | null }[];
};

function LessonsHeader({ moduleBadge, moduleSlug, lessons }: SidebarProps) {
  const { width } = useWindowSize();
  const effectiveWidth = width ?? 0;
  return effectiveWidth > 768 ? (
    <header className="bg-[var(--bg-color)] text-[var(--text-color-primary-800)] h-[3rem] flex items-center justify-end">
      <nav>Header Icons and Buttons</nav>
    </header>
  ) : (
    <header className="bg-[var(--bg-color)] text-[var(--text-color-primary-800)] h-[3rem] flex  justify-start">
      <div className="mr-auto">
        <SideBarSheet
          lessons={lessons}
          moduleBadge={moduleBadge}
          moduleSlug={moduleSlug}
        />
      </div>
      <div className="flex items-center">
        <nav className="">Header Icons and Buttons</nav>
      </div>
    </header>
  );
}

export default LessonsHeader;
