'use client';

import { useFormStatus } from 'react-dom';
import type { AdminSettings } from '@/types/database';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? 'Saving…' : 'Save'}
    </button>
  );
}

type Props = {
  settings: Partial<AdminSettings>;
};

export function AdminSettingsForm({ settings }: Props) {
  const weatherService = settings?.weather_service ?? 'openweather';

  return (
    <form action="/api/admin/settings" method="post" className="mt-2">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="weather_service"
          value="openweather"
          defaultChecked={weatherService === 'openweather'}
          className="rounded border-zinc-300"
        />
        <span>OpenWeather</span>
      </label>
      <label className="mt-1 flex items-center gap-2">
        <input
          type="radio"
          name="weather_service"
          value="openmeteo"
          defaultChecked={weatherService === 'openmeteo'}
          className="rounded border-zinc-300"
        />
        <span>Open-Meteo</span>
      </label>
      <SubmitButton />
    </form>
  );
}
