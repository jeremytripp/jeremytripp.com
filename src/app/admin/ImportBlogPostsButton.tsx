'use client';

import { useState } from 'react';

export function ImportBlogPostsButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
    total: number;
    errors?: string[];
  } | null>(null);

  async function handleImport() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/import-blog-posts', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setResult({
          imported: 0,
          skipped: 0,
          total: 0,
          errors: [data.error ?? res.statusText],
        });
        return;
      }
      setResult(data);
      if (data.imported > 0) {
        window.location.reload();
      }
    } catch (e) {
      setResult({
        imported: 0,
        skipped: 0,
        total: 0,
        errors: [e instanceof Error ? e.message : 'Import failed'],
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleImport}
        disabled={loading}
        className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-200 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
      >
        {loading ? 'Importing…' : 'Import LinkedIn posts from published-posts.json'}
      </button>
      {result && (
        <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-700 dark:bg-zinc-800/50">
          <p>
            Imported <strong>{result.imported}</strong> of {result.total}
            {result.skipped > 0 && ` (${result.skipped} skipped)`}.
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
