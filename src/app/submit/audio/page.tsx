import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

async function createAudio(formData: FormData) {
  'use server';
  const user = await requireUser();
  const supabase = createClient();

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile.role !== 'narrator') redirect('/onboarding');

  const file = formData.get('audio') as File;
  const novelId = String(formData.get('novel_id'));
  const filePath = `${user.id}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from('audios').upload(filePath, file, {
    upsert: false,
    contentType: file.type || 'audio/mpeg'
  });
  if (uploadError) throw uploadError;

  const { data: publicUrl } = supabase.storage.from('audios').getPublicUrl(filePath);

  const payload = {
    novel_id: novelId,
    narrator_id: user.id,
    title: String(formData.get('title')),
    description: String(formData.get('description')),
    transcript_text: String(formData.get('transcript_text')),
    genre: String(formData.get('genre')),
    audio_url: publicUrl.publicUrl
  };

  const { data } = await supabase.from('audios').insert(payload).select('id').single();
  redirect(`/audios/${data.id}`);
}

export default async function SubmitAudioPage({ searchParams }: { searchParams: { novel_id?: string } }) {
  const user = await requireUser();
  const supabase = createClient();

  const { data: novels } = await supabase.from('novels').select('id,title,genre').order('created_at', { ascending: false }).limit(100);
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile.role !== 'narrator') redirect('/onboarding');

  return (
    <form action={createAudio} className="card mx-auto w-full max-w-2xl space-y-4 text-center">
      <h1 className="section-title text-xl">音声投稿</h1>
      <div>
        <label className="label" htmlFor="novel_id">元小説</label>
        <select id="novel_id" name="novel_id" className="select" defaultValue={searchParams.novel_id} required>
          <option value="">元小説を選択</option>
          {(novels ?? []).map((n) => <option key={n.id} value={n.id}>{n.title}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="title">タイトル</label>
        <input id="title" name="title" className="input" placeholder="タイトル" required />
      </div>
      <div>
        <label className="label" htmlFor="description">説明</label>
        <textarea id="description" name="description" className="textarea min-h-24" placeholder="説明" required />
      </div>
      <div>
        <label className="label" htmlFor="genre">ジャンル</label>
        <input id="genre" name="genre" className="input" placeholder="genre" required />
      </div>
      <div>
        <label className="label" htmlFor="audio">音声ファイル</label>
        <input id="audio" type="file" name="audio" accept="audio/mpeg,audio/mp3,audio/wav" className="input" required />
      </div>
      <div>
        <label className="label" htmlFor="transcript_text">文字起こし（必須）</label>
        <textarea id="transcript_text" name="transcript_text" className="textarea min-h-40" placeholder="文字起こし（必須）" required />
      </div>
      <div className="flex justify-center">
        <button className="primary-btn">投稿する</button>
      </div>
    </form>
  );
}
