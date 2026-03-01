'use client';

import { createClient } from '@/lib/supabase/client';
import { getAuthCallbackUrl } from '@/lib/auth-url';

export function LoginForm() {
  const supabase = createClient();
  const redirectTo = getAuthCallbackUrl();
  const showDebug =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('debug') === '1';

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
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
      {showDebug && (
        <p className="rounded bg-amber-100 px-3 py-2 text-left text-xs text-amber-900 dark:bg-zinc-800 dark:text-zinc-200">
          Redirect URL sent to Supabase: <code className="break-all">{redirectTo}</code>
        </p>
      )}
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
