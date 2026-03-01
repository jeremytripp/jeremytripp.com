/**
 * Base URL for the app. Matches Supabase's recommended pattern for Vercel so
 * OAuth redirectTo is accepted and redirects stay on the current domain.
 * @see https://supabase.com/docs/guides/auth/redirect-urls#vercel-preview-urls
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000';
  url = url.startsWith('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url : `${url}/`;
  return url.replace(/\/$/, '');
}

/**
 * Full URL for the auth callback. Use this as redirectTo in signInWithOAuth so
 * Supabase redirects back here after OAuth. Must be listed in Supabase Dashboard
 * → Authentication → URL Configuration → Redirect URLs.
 */
export function getAuthCallbackUrl(): string {
  const base = getBaseUrl();
  return `${base}/auth/callback`;
}
