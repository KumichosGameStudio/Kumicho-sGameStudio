import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { GENRES } from '@/lib/constants';

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; type?: string; genre?: string } }) {
  const q = searchParams.q ?? '';
  const type = searchParams.type ?? 'all';
  const genre = searchParams.genre ?? '';
  const supabase = createClient();

  let novels: any[] = [];
  let audios: any[] = [];

  if (q) {
    if (type === 'all' || type === 'novel') {
      let query = supabase
        .from('novels')
        .select('id,title,summary,author:profiles!novels_author_id_fkey(display_name)')
        .or(`title.ilike.%${q}%,summary.ilike.%${q}%`);
      if (genre) query = query.eq('genre', genre);
      const { data } = await query;
      novels = data ?? [];
    }

    if (type === 'all' || type === 'audio') {
      let query = supabase
        .from('audios')
        .select('id,title,description,narrator:profiles!audios_narrator_id_fkey(display_name)')
        .or(`title.ilike.%${q}%,description.ilike.%${q}%`);
      if (genre) query = query.eq('genre', genre);
      const { data } = await query;
      audios = data ?? [];
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-8">
      <h1 className="section-title">検索</h1>
      <form className="card grid gap-3 text-center md:grid-cols-4">
        <input name="q" defaultValue={q} className="input md:col-span-2" placeholder="タイトル・概要・作者名" />
        <select name="type" defaultValue={type} className="select">
          <option value="all">すべて</option>
          <option value="novel">小説</option>
          <option value="audio">音声</option>
        </select>
        <select name="genre" defaultValue={genre} className="select">
          <option value="">全ジャンル</option>
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <div className="flex justify-center md:col-span-4">
          <button className="primary-btn">検索</button>
        </div>
      </form>

      <section className="space-y-3 text-center">
        <h2 className="text-xl font-bold text-slate-800">小説結果</h2>
        {novels.map((n) => <Link key={n.id} className="card block font-bold hover:border-blue-300" href={`/novels/${n.id}`}>{n.title}</Link>)}
      </section>

      <section className="space-y-3 text-center">
        <h2 className="text-xl font-bold text-slate-800">音声結果</h2>
        {audios.map((a) => <Link key={a.id} className="card block font-bold hover:border-blue-300" href={`/audios/${a.id}`}>{a.title}</Link>)}
      </section>
    </div>
  );
}
