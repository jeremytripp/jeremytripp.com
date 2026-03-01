import Link from 'next/link';
import { getCurrentUserWithProfile, isAdmin } from '@/lib/auth';

export async function Nav() {
  const auth = await getCurrentUserWithProfile();
  const profile = auth?.profile ?? null;
  const user = auth?.user ?? null;
  const admin = isAdmin(profile);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          jeremytripp.com
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Home
          </Link>
          <Link href="/blog" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            Blog
          </Link>
          {user ? (
            <>
              {admin && (
                <Link href="/admin" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  Admin
                </Link>
              )}
              <Link href="/account" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                Profile
              </Link>
              <form action="/auth/signout" method="post" className="inline">
                <button type="submit" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
