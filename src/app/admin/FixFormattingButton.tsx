'use client';

import { useState } from 'react';

export function FixFormattingButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    updated: number;
    total: number;
    errors?: string[];
  } | null>(null);

  async function handleFix() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/fix-post-formatting', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setResult({
          updated: 0,
          total: 0,
          errors: [data.error ?? res.statusText],
        });
        return;
      }
      setResult(data);
      if (data.updated > 0) {
        window.location.reload();
      }
    } catch (e) {
      setResult({
        updated: 0,
        total: 0,
        errors: [e instanceof Error ? e.message : 'Request failed'],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleFix}
        disabled={loading}
        className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-200 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
      >
        {loading ? 'Fixing…' : 'Fix post formatting (spaces + paragraphs)'}
      </button>
      {result && (
        <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800/50">
          <p>
            Updated <strong>{result.updated}</strong> of {result.total} posts.
          </p>
          {result.errors && result.errors.length > 0 && (
            <ul className="mt-1 list-inside list-disc text-zinc-600 dark:text-zinc-400">
              {result.errors.slice(0, 5).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
              {result.errors.length > 5 && (
                <li>…and {result.errors.length - 5} more</li>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
