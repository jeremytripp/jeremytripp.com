'use client';

import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const supabase = createClient();

  const handleGoogleSignIn = async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback` },
    });
    if (error) {
      console.error(error);
      return;
    }
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
      >
        Sign in with Google
      </button>
    </div>
  );
}
