import Link from 'next/link';
import { getDailyTopData } from '@/lib/data';
import { createClient } from '@/lib/supabase-server';

export default async function HomePage() {
  const { orderedNovels, audiosByNovel, randomAudios } = await getDailyTopData();
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  let role: string | null = null;
  if (user) {
    const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    role = data?.role ?? null;
  }

  return (
    <div className="w-full space-y-12">
      <section className="space-y-4">
        <h1 className="section-title text-3xl">Your Underrated Novelists and Voices</h1>
        <p className="mx-auto max-w-3xl text-center text-sm leading-7 text-[var(--text-soft)]">
          小説と音声の創作を、まっすぐにつなぐためのシンプルな場所。
        </p>
      </section>

      <section className="w-full space-y-5">
        <h2 className="section-title">今日のランダムピックアップ</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {orderedNovels.map((novel) => (
            <div key={novel.id} className="card space-y-4 text-center">
              <div className="flex items-center justify-center gap-3">
                <img
                  src={novel.author?.avatar_url || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'}
                  alt="avatar"
                  className="h-11 w-11 rounded-full border border-blue-100 object-cover"
                />
                <div>
                  <p className="text-xs font-normal text-slate-500">小説 / {novel.genre}</p>
                  <Link href={`/novels/${novel.id}`} className="text-lg font-bold text-slate-800 hover:text-[var(--accent)]">
                    {novel.title}
                  </Link>
                </div>
              </div>
              <p className="line-clamp-2 text-sm font-normal leading-7 text-[var(--text-soft)]">{novel.summary}</p>
              {audiosByNovel.get(novel.id)?.length ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                  <p className="mb-2 text-xs font-bold text-blue-700">対応オーディオ（同時表示）</p>
                  <div className="space-y-1.5">
                    {audiosByNovel.get(novel.id)?.map((audio) => (
                      <Link key={audio.id} href={`/audios/${audio.id}`} className="block text-sm font-normal text-blue-700 hover:underline">
                        {audio.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs font-normal text-slate-400">まだ音声版はありません</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="w-full space-y-5">
        <h2 className="section-title">今日の音声ランダム10件</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {randomAudios.map((audio) => (
            <div key={audio.id} className="card space-y-1.5 text-center">
              <p className="text-xs font-normal text-slate-500">音声 / {audio.genre}</p>
              <Link href={`/audios/${audio.id}`} className="text-base font-bold text-slate-800 hover:text-[var(--accent)]">
                {audio.title}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="card mx-auto w-full max-w-3xl space-y-4 text-center">
        <h2 className="section-title text-xl">登録</h2>
        {!user ? (
          <p className="text-sm font-normal leading-7 text-[var(--text-soft)]">
            Googleログイン後にロール（小説家 / 声優・ナレーター）を選択できます。
          </p>
        ) : role ? (
          <p className="text-sm font-normal text-[var(--text-soft)]">
            現在のロール: <span className="font-bold text-slate-800">{role}</span>
          </p>
        ) : (
          <div className="flex justify-center">
            <Link href="/onboarding" className="primary-btn">ロールを設定する</Link>
          </div>
        )}
      </section>
    </div>
  );
}
