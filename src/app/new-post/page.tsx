import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/require-auth';
import { createClient } from '@/lib/supabase/server';
import { NewPostForm } from './NewPostForm';

export default async function NewPostPage() {
  await requireAdmin();

  async function createPost(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/please-sign-in');

    const profileRes = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profileRes.data?.role !== 'admin') redirect('/need-admin');

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const body = formData.get('body') as string;
    const author = formData.get('author') as string;

    if (!title?.trim()) return;

    await supabase.from('posts').insert({
      title: title.trim(),
      description: description?.trim() || null,
      body: body?.trim() || null,
      author: author?.trim() || null,
    });

    redirect('/blog');
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">New post</h1>
      <NewPostForm action={createPost} />
    </div>
  );
}
