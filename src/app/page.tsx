import { getCurrentUserWithProfile } from '@/lib/auth';
import { WeatherWidget } from '@/components/WeatherWidget';
import { Portfolio } from '@/components/portfolio/Portfolio';

export default async function HomePage() {
  const auth = await getCurrentUserWithProfile();
  const profile = auth?.profile;
  const firstName = profile?.full_name?.split(' ')[0];

  if (auth?.user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div>
          <h1 className="text-3xl font-semibold">
            Hello, {firstName ?? 'there'}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Welcome to your dashboard.
          </p>
        </div>
        <WeatherWidget />
      </div>
    );
  }

  return <Portfolio />;
}
