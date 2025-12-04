import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-10 p-6 flex justify-between items-center pointer-events-none">
      <div className="pointer-events-auto">
        <Link href="/" className="text-white font-bold text-xl tracking-wider">
          TRADERS<span className="text-blue-400">.EDU</span>
        </Link>
      </div>
      <div className="pointer-events-auto">
        <Link
          href="/notes"
          className="text-white/80 hover:text-white transition-colors border border-white/20 px-4 py-2 rounded-full backdrop-blur-sm bg-black/10"
        >
          My Notes
        </Link>
      </div>
    </nav>
  );
}
