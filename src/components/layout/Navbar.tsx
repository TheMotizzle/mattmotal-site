import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-display font-bold tracking-tight text-white hover:text-gray-300 transition-colors">
          Matt Motal
        </Link>
        <div className="flex gap-8">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/work"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Work
          </Link>
          <Link
            href="/resume"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Resume
          </Link>
        </div>
      </div>
    </nav>
  );
}
