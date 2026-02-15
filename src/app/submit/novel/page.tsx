import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';
import { GENRES } from '@/lib/constants';
import { redirect } from 'next/navigation';

async function createNovel(formData: FormData) {
  'use server';
  const user = await requireUser();
  const supabase = createClient();

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile.role !== 'novelist') redirect('/onboarding');

  const payload = {
    author_id: user.id,
    title: String(formData.get('title')),
    body_text: String(formData.get('body_text')),
    summary: String(formData.get('summary')),
    genre: String(formData.get('genre'))
  };

  const { data } = await supabase.from('novels').insert(payload).select('id').single();
  redirect(`/novels/${data.id}`);
}

export default async function SubmitNovelPage() {
  await requireUser();

  return (
    <form action={createNovel} className="card mx-auto w-full max-w-2xl space-y-4 text-center">
      <h1 className="section-title text-xl">小説投稿</h1>
      <div>
        <label className="label" htmlFor="title">タイトル</label>
        <input id="title" name="title" className="input" placeholder="タイトル" required />
      </div>
      <div>
        <label className="label" htmlFor="summary">概要</label>
        <textarea id="summary" name="summary" className="textarea min-h-24" placeholder="概要" required />
      </div>
      <div>
        <label className="label" htmlFor="body_text">本文</label>
        <textarea id="body_text" name="body_text" className="textarea min-h-72 text-left" placeholder="本文" required />
      </div>
      <div>
        <label className="label" htmlFor="genre">ジャンル</label>
        <select id="genre" name="genre" className="select">
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="flex justify-center">
        <button className="primary-btn">投稿する</button>
      </div>
    </form>
  );
}
