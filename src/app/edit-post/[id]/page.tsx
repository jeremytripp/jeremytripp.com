import { notFound, redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/require-auth';
import { createClient } from '@/lib/supabase/server';
import type { Post } from '@/types/database';
import { EditPostForm } from '../EditPostForm';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
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

  async function updatePost(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) notFound();
    const profileRes = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profileRes.data?.role !== 'admin') notFound();

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const body = formData.get('body') as string;
    const author = formData.get('author') as string;

    if (!title?.trim()) return;

    await supabase
      .from('posts')
      .update({
        title: title.trim(),
        description: description?.trim() || null,
        body: body?.trim() || null,
        author: author?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    redirect('/blog');
  }

  async function deletePost() {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const profileRes = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profileRes.data?.role !== 'admin') return;
    await supabase.from('posts').delete().eq('id', id);
  }

  const p = post as Post;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <EditPostForm
        post={p}
        action={updatePost}
        deleteAction={deletePost}
      />
    </div>
  );
}
