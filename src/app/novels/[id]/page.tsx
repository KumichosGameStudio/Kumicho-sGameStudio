import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export default async function NovelDetail({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: novel } = await supabase
    .from('novels')
    .select('*, author:profiles!novels_author_id_fkey(handle,display_name)')
    .eq('id', params.id)
    .single();

  const { data: audios } = await supabase
    .from('audios')
    .select('id,title,narrator:profiles!audios_narrator_id_fkey(display_name)')
    .eq('novel_id', params.id)
    .order('created_at', { ascending: false });

  return (
    <div className="w-full max-w-4xl space-y-6 text-center">
      <div className="card space-y-2">
        <p className="text-xs font-normal text-slate-500">{novel.genre}</p>
        <h1 className="text-3xl font-bold text-slate-800">{novel.title}</h1>
        <p className="mx-auto max-w-3xl text-sm font-normal leading-7 text-[var(--text-soft)]">{novel.summary}</p>
        <Link href={`/u/${novel.author.handle}`} className="text-sm font-bold text-[var(--accent)] hover:underline">
          作者: {novel.author.display_name}
        </Link>
      </div>
      <article className="card whitespace-pre-wrap text-left text-base font-normal leading-8 text-slate-700">{novel.body_text}</article>
      <section className="card space-y-3 text-center">
        <h2 className="text-xl font-bold text-slate-800">関連音声</h2>
        <div className="space-y-2">
          {(audios ?? []).map((audio) => (
            <Link key={audio.id} href={`/audios/${audio.id}`} className="block font-normal text-[var(--accent)] hover:underline">
              {audio.title}
            </Link>
          ))}
        </div>
        <div className="flex justify-center">
          <Link href={`/submit/audio?novel_id=${params.id}`} className="primary-btn">
            この作品を音読して投稿する
          </Link>
        </div>
      </section>
    </div>
  );
}
