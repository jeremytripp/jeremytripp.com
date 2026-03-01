import Link from 'next/link';

export default function AuthCodeErrorPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Sign-in error</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Something went wrong during sign-in. Please try again.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Try again
      </Link>
    </div>
  );
}
