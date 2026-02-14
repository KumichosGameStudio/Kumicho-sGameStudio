import Link from 'next/link';
import { GENRES } from '@/lib/constants';
import { createClient } from '@/lib/supabase-server';

export default async function GenresPage({ searchParams }: { searchParams: { genre?: string; tab?: string } }) {
  const selected = searchParams.genre ?? GENRES[0];
  const tab = searchParams.tab ?? 'novels';
  const supabase = createClient();

  const [novelsRes, audiosRes] = await Promise.all([
    supabase.from('novels').select('id,title,genre,created_at').eq('genre', selected).order('created_at', { ascending: false }),
    supabase.from('audios').select('id,title,genre,created_at').eq('genre', selected).order('created_at', { ascending: false })
  ]);

  const list = tab === 'audios' ? audiosRes.data ?? [] : novelsRes.data ?? [];

  return (
    <div className="w-full max-w-4xl space-y-7">
      <h1 className="section-title">ジャンル</h1>
      <div className="flex flex-wrap justify-center gap-2">
        {GENRES.map((g) => (
          <Link key={g} href={`/genres?genre=${g}&tab=${tab}`} className={g === selected ? 'primary-btn' : 'secondary-btn'}>
            {g}
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-3">
        <Link href={`/genres?genre=${selected}&tab=novels`} className={tab === 'novels' ? 'primary-btn' : 'secondary-btn'}>
          小説
        </Link>
        <Link href={`/genres?genre=${selected}&tab=audios`} className={tab === 'audios' ? 'primary-btn' : 'secondary-btn'}>
          音声
        </Link>
      </div>
      <div className="grid gap-3">
        {list.map((item) => (
          <Link key={item.id} href={`/${tab === 'audios' ? 'audios' : 'novels'}/${item.id}`} className="card block text-center font-bold hover:border-blue-300">
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
