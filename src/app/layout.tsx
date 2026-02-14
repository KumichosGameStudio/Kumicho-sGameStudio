import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Your Underrated Novelists and Voices',
  description: '小説家と声優をつなぐMVP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <NavBar />
        <main className="container py-8 sm:py-10">
          <div className="page-wrap">{children}</div>
        </main>
      </body>
    </html>
  );
}
