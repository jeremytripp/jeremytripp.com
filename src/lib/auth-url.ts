/**
 * Base URL for the app. Matches Supabase's recommended pattern for Vercel so
 * OAuth redirectTo is accepted and redirects stay on the current domain.
 * In development we always use localhost so sign-in works locally even when
 * Supabase Site URL is set to production.
 * @see https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // In development, use localhost so auth callback stays on localhost (don't use NEXT_PUBLIC_SITE_URL).
  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'development';
  let url: string;
  if (isDev) {
    url =
      process.env.NEXT_PUBLIC_VERCEL_URL != null
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000';
  } else {
    url =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_VERCEL_URL ??
      'http://localhost:3000';
  }
  url = url.startsWith('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url : `${url}/`;
  return url.replace(/\/$/, '');
}

/**
 * Full URL for the auth callback. Use this as redirectTo in signInWithOAuth so
 * Supabase redirects back here after OAuth. Must be listed in Supabase Dashboard
 * → Authentication → URL Configuration → Redirect URLs (e.g. add
 * http://localhost:3000/auth/callback for local dev when Site URL is production).
 */
export function getAuthCallbackUrl(): string {
  const base = getBaseUrl();
  return `${base}/auth/callback`;
}
