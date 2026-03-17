import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-8 flex justify-between items-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Matt Motal</p>
        <Link href="/resume" className="hover:text-white transition-colors">
          Resume
        </Link>
      </div>
    </footer>
  );
}
