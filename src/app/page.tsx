import Link from 'next/link';
import { getCurrentUserWithProfile } from '@/lib/auth';
import { WeatherWidget } from '@/components/WeatherWidget';

export default async function HomePage() {
  const auth = await getCurrentUserWithProfile();
  const profile = auth?.profile;
  const firstName = profile?.full_name?.split(' ')[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {auth?.user ? (
        <div>
          <h1 className="text-3xl font-semibold">Hello, {firstName ?? 'there'}</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Welcome to your dashboard.</p>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-semibold">Hello</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Welcome to the dashboard. There&apos;s nothing here because I haven&apos;t built it yet. Please{' '}
            <Link href="/login" className="text-blue-600 underline dark:text-blue-400">sign in</Link>.
          </p>
        </div>
      )}
      <WeatherWidget />
    </div>
  );
}
