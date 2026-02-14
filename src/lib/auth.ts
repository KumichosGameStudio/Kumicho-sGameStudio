import { redirect } from 'next/navigation';
import { createClient } from './supabase-server';

export async function getCurrentUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/');
  return user;
}
