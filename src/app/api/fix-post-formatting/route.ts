import { createServiceRoleClient } from '@/lib/supabase/server';
import { getCurrentUserWithProfile, isAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { formatPostBody, formatPostTitle } from '@/lib/format-post-body';

export async function POST() {
  const auth = await getCurrentUserWithProfile();
  if (!auth?.user) {
    return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  }
  if (!isAdmin(auth.profile)) {
    return NextResponse.json({ error: 'Admin only.' }, { status: 403 });
  }

  const service = createServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      { error: 'Server misconfiguration: SUPABASE_SERVICE_ROLE_KEY not set.' },
      { status: 500 }
    );
  }

  const { data: posts, error: fetchError } = await service
    .from('posts')
    .select('id, title, description, body')
    .not('body', 'is', null);

  if (fetchError) {
    return NextResponse.json(
      { error: fetchError.message },
      { status: 500 }
    );
  }

  if (!posts?.length) {
    return NextResponse.json({
      updated: 0,
      total: 0,
      message: 'No posts to fix.',
    });
  }

  let updated = 0;
  const errors: string[] = [];

  for (const post of posts) {
    const rawBody = post.body ?? '';
    const rawTitle = post.title ?? '';
    const newBody = formatPostBody(rawBody);
    const newTitle = formatPostTitle(rawTitle);
    const newDescription =
      newBody.length > 200
        ? newBody.slice(0, 197).trim() + '…'
        : newBody || null;

    const bodyChanged = newBody !== rawBody;
    const titleChanged = newTitle !== rawTitle;
    const descriptionChanged =
      newDescription !== (post.description ?? null);
    if (!bodyChanged && !titleChanged && !descriptionChanged) {
      continue;
    }

    const { error } = await service
      .from('posts')
      .update({
        title: newTitle,
        description: newDescription,
        body: newBody,
        updated_at: new Date().toISOString(),
      })
      .eq('id', post.id);

    if (error) {
      errors.push(`Post ${post.id} (${rawTitle.slice(0, 40)}…): ${error.message}`);
      continue;
    }
    updated++;
  }

  return NextResponse.json({
    updated,
    total: posts.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
