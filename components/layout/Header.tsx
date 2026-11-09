import { TrendingDown } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <TrendingDown className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            SlediCena
          </span>
        </Link>

        {/* Navigation and actions */}
        <div className="flex items-center gap-8">
          <nav className="hidden items-center gap-7 sm:flex">
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
            >
              How it works
            </Link>
            <Link
              href="/#products"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-600"
            >
              My products
            </Link>
          </nav>

          <Link
            href="/login"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
