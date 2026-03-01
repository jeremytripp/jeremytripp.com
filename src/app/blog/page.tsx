import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function BlogListPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, description, author, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <ul className="mt-8 space-y-6">
        {(posts ?? []).map((post) => (
          <li key={post.id} className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
            <Link href={`/blog/${post.id}`} className="block group">
              <h2 className="text-xl font-medium text-zinc-900 group-hover:underline dark:text-zinc-100">
                {post.title}
              </h2>
              {post.description && (
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">{post.description}</p>
              )}
              <p className="mt-2 text-sm text-zinc-500">
                {post.author && <span>{post.author}</span>}
                {post.created_at && (
                  <span>
                    {post.author && ' · '}
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                )}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      {(!posts || posts.length === 0) && (
        <p className="mt-8 text-zinc-500">No posts yet.</p>
      )}
    </div>
  );
}
