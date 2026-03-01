'use client';

import { useEffect, useState } from 'react';

type WeatherData = {
  temp: number;
  city: string;
  condition: string;
  summary?: string;
  highTemp?: number;
  lowTemp?: number;
  icon?: string;
};

export function WeatherWidget() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/weather')
      .then((res) => {
        if (!res.ok) {
          return res.json().then(
            (body: { error?: string; detail?: string }) => {
              throw new Error(body.detail || body.error || (res.status === 503 ? 'Weather not configured' : 'Failed to load'));
            },
            () => {
              throw new Error(res.status === 503 ? 'Weather not configured' : 'Failed to load');
            }
          );
        }
        return res.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <p className="mt-6 text-zinc-500">
        {error}. Configure OPENWEATHER_API_KEY or use Open-Meteo in Admin settings.
      </p>
    );
  }

  if (!data) {
    return <p className="mt-6 text-zinc-500">Loading weather…</p>;
  }

  return (
    <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-2xl font-semibold">{data.city}</p>
      <p className="mt-2 text-5xl font-light">{data.temp}°</p>
      <p className="mt-1 text-zinc-600 dark:text-zinc-400">{data.condition}</p>
      {(data.highTemp != null || data.lowTemp != null) && (
        <p className="mt-2 text-sm text-zinc-500">
          High {data.highTemp ?? '—'}° / Low {data.lowTemp ?? '—'}°
        </p>
      )}
      {data.summary && <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{data.summary}</p>}
    </div>
  );
}
