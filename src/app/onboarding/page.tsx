import { requireUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

async function setRole(formData: FormData) {
  'use server';
  const user = await requireUser();
  const role = formData.get('role') as string;
  const displayName = (formData.get('display_name') as string) || 'no-name';
  const handle = (formData.get('handle') as string) || `user-${user.id.slice(0, 8)}`;

  const supabase = createClient();
  await supabase.from('profiles').upsert({ id: user.id, role, display_name: displayName, handle });
  redirect('/');
}

export default async function OnboardingPage() {
  await requireUser();

  return (
    <form action={setRole} className="card mx-auto w-full max-w-xl space-y-4 text-center">
      <h1 className="section-title text-xl">ロール初期設定</h1>
      <div>
        <label className="label" htmlFor="display_name">表示名</label>
        <input id="display_name" name="display_name" placeholder="表示名" className="input" required />
      </div>
      <div>
        <label className="label" htmlFor="handle">handle（ユニーク）</label>
        <input id="handle" name="handle" placeholder="handle（ユニーク）" className="input" required />
      </div>
      <div>
        <label className="label" htmlFor="role">ロール</label>
        <select id="role" name="role" className="select" required>
          <option value="novelist">小説家</option>
          <option value="narrator">声優・ナレーター</option>
        </select>
      </div>
      <div className="flex justify-center">
        <button className="primary-btn">保存</button>
      </div>
    </form>
  );
}
