import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { linkify } from '@/lib/linkify';
import type { Post } from '@/types/database';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  const p = post as Post;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/blog" className="text-sm text-zinc-500 hover:underline">← Back to blog</Link>
      <header className="mt-4">
        <h1 className="text-3xl font-semibold">{p.title}</h1>
        {(p.author || p.created_at) && (
          <p className="mt-2 text-sm text-zinc-500">
            {p.author && <span>{p.author}</span>}
            {p.created_at && (
              <span>{p.author ? ' · ' : ''}{new Date(p.created_at).toLocaleDateString()}</span>
            )}
          </p>
        )}
      </header>
      <div className="mt-6 prose prose-zinc dark:prose-invert max-w-none">
        {p.body ? (
          <div className="whitespace-pre-wrap">{linkify(p.body)}</div>
        ) : (
          <p className="text-zinc-500">No content.</p>
        )}
      </div>
    </article>
  );
}
