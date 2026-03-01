import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const url = request.nextUrl;

  // If Supabase sent the OAuth code to the root (e.g. when redirect_to was rejected and Site URL was used),
  // send the user to our callback so we can exchange the code. Ensures auth works when Site URL is production.
  if (url.pathname === '/' && url.searchParams.has('code')) {
    const callbackUrl = new URL('/auth/callback', url.origin);
    url.searchParams.forEach((value, key) => callbackUrl.searchParams.set(key, value));
    return NextResponse.redirect(callbackUrl);
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}
