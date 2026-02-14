import { createClient } from './supabase-server';
import { Audio, Novel } from './types';

function todayJst() {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().slice(0, 10);
}

export async function getOrCreateDailyNovelIds() {
  const supabase = createClient();
  const today = todayJst();

  const { data: existing } = await supabase
    .from('daily_picks')
    .select('novel_ids,pick_date')
    .eq('pick_date', today)
    .maybeSingle();

  if (existing?.novel_ids?.length) return existing.novel_ids as string[];

  const { data: novels } = await supabase.from('novels').select('id');
  const ids = (novels ?? []).map((n) => n.id);
  const shuffled = ids.sort(() => Math.random() - 0.5).slice(0, 10);

  await supabase.from('daily_picks').upsert({ pick_date: today, novel_ids: shuffled });
  return shuffled;
}

export async function getDailyTopData() {
  const supabase = createClient();
  const novelIds = await getOrCreateDailyNovelIds();

  const { data: novels } = await supabase
    .from('novels')
    .select('*, author:profiles!novels_author_id_fkey(id,handle,display_name,avatar_url)')
    .in('id', novelIds);

  const { data: audios } = await supabase
    .from('audios')
    .select('*, narrator:profiles!audios_narrator_id_fkey(id,handle,display_name,avatar_url)')
    .in('novel_id', novelIds);

  const novelMap = new Map((novels as Novel[] | null | undefined)?.map((n) => [n.id, n]) ?? []);
  const orderedNovels = novelIds.map((id) => novelMap.get(id)).filter(Boolean) as Novel[];

  const audiosByNovel = new Map<string, Audio[]>();
  (audios as Audio[] | null | undefined)?.forEach((a) => {
    const list = audiosByNovel.get(a.novel_id) ?? [];
    list.push(a);
    audiosByNovel.set(a.novel_id, list);
  });

  const randomAudios = ((audios as Audio[] | null | undefined) ?? [])
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  return { orderedNovels, audiosByNovel, randomAudios };
}
