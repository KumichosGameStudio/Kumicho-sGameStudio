'use client';

import { createClient } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';

export default function AuthButton() {
  const supabase = createClient();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setLoggedIn(Boolean(data.user)));
  }, [supabase]);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return loggedIn ? (
    <button onClick={signOut} className="secondary-btn">ログアウト</button>
  ) : (
    <button onClick={signIn} className="primary-btn">Googleログイン</button>
  );
}
