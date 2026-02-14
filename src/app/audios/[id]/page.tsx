import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export default async function AudioDetail({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: audio } = await supabase
    .from('audios')
    .select('*, narrator:profiles!audios_narrator_id_fkey(display_name,handle), novel:novels!audios_novel_id_fkey(id,title)')
    .eq('id', params.id)
    .single();

  return (
    <div className="w-full max-w-4xl space-y-5 text-center">
      <div className="card space-y-2">
        <p className="text-xs font-normal text-slate-500">音声 / {audio.genre}</p>
        <h1 className="text-3xl font-bold text-slate-800">{audio.title}</h1>
        <p className="text-sm font-normal leading-7 text-[var(--text-soft)]">{audio.description}</p>
        <p className="text-sm font-normal text-[var(--text-soft)]">
          ナレーター:{' '}
          <Link href={`/u/${audio.narrator.handle}`} className="font-bold text-[var(--accent)] hover:underline">
            {audio.narrator.display_name}
          </Link>
        </p>
        <p className="text-sm font-normal">
          <Link href={`/novels/${audio.novel.id}`} className="font-bold text-[var(--accent)] hover:underline">
            元小説: {audio.novel.title}
          </Link>
        </p>
      </div>
      <div className="card">
        <audio controls src={audio.audio_url} className="mx-auto w-full max-w-2xl" />
      </div>
      <div className="card text-left">
        <h2 className="mb-2 text-center text-xl font-bold text-slate-800">文字起こし</h2>
        <p className="whitespace-pre-wrap text-base font-normal leading-8 text-slate-700">{audio.transcript_text}</p>
      </div>
    </div>
  );
}
