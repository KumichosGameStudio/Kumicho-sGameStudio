import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';

export default async function ProfilePage({ params }: { params: { handle: string } }) {
  const supabase = createClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('handle', params.handle).single();
  const { data: userData } = await supabase.auth.getUser();
  const isOwner = userData.user?.id === profile.id;

  const [novelsRes, audiosRes] = await Promise.all([
    supabase.from('novels').select('id,title,created_at').eq('author_id', profile.id).order('created_at', { ascending: false }),
    supabase.from('audios').select('id,title,created_at').eq('narrator_id', profile.id).order('created_at', { ascending: false })
  ]);

  return (
    <div className="w-full max-w-4xl space-y-5 text-center">
      <section className="card space-y-4">
        <div className="flex flex-col items-center gap-3">
          <img
            src={profile.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
            alt="avatar"
            className="h-20 w-20 rounded-full border border-blue-100 object-cover"
          />
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{profile.display_name}</h1>
            <p className="text-sm font-normal text-slate-500">@{profile.handle} / {profile.role}</p>
          </div>
        </div>
        <p className="mx-auto max-w-2xl text-sm font-normal leading-7 text-[var(--text-soft)]">{profile.bio || '自己紹介未設定'}</p>
        {profile.social_links && (
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {Object.entries(profile.social_links).map(([k, v]) => (
              <a key={k} href={String(v)} className="font-bold text-[var(--accent)] hover:underline">
                {k}
              </a>
            ))}
          </div>
        )}
        {isOwner && (
          <div className="flex justify-center">
            <Link href="/onboarding" className="secondary-btn">プロフィール編集</Link>
          </div>
        )}
      </section>

      <section className="card space-y-2">
        <h2 className="text-xl font-bold text-slate-800">小説投稿</h2>
        {(novelsRes.data ?? []).map((n) => (
          <Link key={n.id} href={`/novels/${n.id}`} className="block font-normal text-[var(--accent)] hover:underline">
            {n.title}
          </Link>
        ))}
      </section>

      <section className="card space-y-2">
        <h2 className="text-xl font-bold text-slate-800">音声投稿</h2>
        {(audiosRes.data ?? []).map((a) => (
          <Link key={a.id} href={`/audios/${a.id}`} className="block font-normal text-[var(--accent)] hover:underline">
            {a.title}
          </Link>
        ))}
      </section>
    </div>
  );
}
