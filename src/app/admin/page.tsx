import Link from 'next/link';
import { requireAdmin } from '@/lib/require-auth';
import { createClient } from '@/lib/supabase/server';
import type { AdminSettings } from '@/types/database';
import { AdminSettingsForm } from './AdminSettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  await requireAdmin();

  const supabase = await createClient();
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, created_at')
    .order('created_at', { ascending: false });

  const { data: settings } = await supabase
    .from('admin_settings')
    .select('id, weather_service')
    .limit(1)
    .single();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Admin</h1>

      <section className="mt-8">
        <h2 className="text-xl font-medium">Weather service</h2>
        <AdminSettingsForm settings={(settings ?? {}) as AdminSettings} />
      </section>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium">Posts</h2>
          <Link
            href="/new-post"
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            New post
          </Link>
        </div>
        <ul className="mt-4 space-y-2">
          {(posts ?? []).map((post: { id: string; title: string; created_at: string }) => (
            <li key={post.id} className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-2 dark:border-zinc-800">
              <Link href={`/blog/${post.id}`} className="font-medium hover:underline">
                {post.title}
              </Link>
              <div className="flex gap-2">
                <Link
                  href={`/edit-post/${post.id}`}
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
        {(!posts || posts.length === 0) && (
          <p className="mt-4 text-zinc-500">No posts yet.</p>
        )}
      </section>
    </div>
  );
}
