import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/constants';
import AuthButton from './auth-button';

export default function NavBar() {
  return (
    <header className="border-b border-blue-100 bg-white">
      <nav className="container flex flex-col items-center justify-between gap-4 py-4 sm:flex-row sm:gap-6">
        <div className="text-center sm:text-left">
          <Link href="/" className="block text-lg font-bold text-slate-800">
            Your Underrated Novelists and Voices
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-bold text-slate-600 transition hover:text-[var(--accent)]">
              {item.label}
            </Link>
          ))}
          <AuthButton />
        </div>
      </nav>
    </header>
  );
}
