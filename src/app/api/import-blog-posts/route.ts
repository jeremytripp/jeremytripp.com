import { createServiceRoleClient } from '@/lib/supabase/server';
import { getCurrentUserWithProfile, isAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

const AUTHOR = 'Jeremy Tripp';

type LinkedInPost = {
  title: string;
  publish_date: string;
  body: string;
};

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

  let raw: LinkedInPost[];
  try {
    const filePath = path.join(process.cwd(), 'published-posts.json');
    raw = JSON.parse(readFileSync(filePath, 'utf-8'));
    if (!Array.isArray(raw)) {
      return NextResponse.json(
        { error: 'published-posts.json must be a JSON array.' },
        { status: 400 }
      );
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to read published-posts.json';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { data: existing } = await service.from('posts').select('title');
  const existingTitles = new Set((existing ?? []).map((r) => r.title));

  let imported = 0;
  const errors: string[] = [];

  for (const p of raw) {
    const title = (p.title ?? '').trim();
    if (!title) {
      errors.push('Skipped item with empty title.');
      continue;
    }
    if (existingTitles.has(title)) {
      errors.push(`Skipped duplicate title: "${title.slice(0, 50)}…".`);
      continue;
    }

    const body = typeof p.body === 'string' ? p.body.trim() : '';
    const publishDate = p.publish_date ?? new Date().toISOString();
    const description =
      body.length > 200 ? body.slice(0, 197).trim() + '…' : body || null;

    const { error } = await service.from('posts').insert({
      title,
      description: description || null,
      body: body || null,
      author: AUTHOR,
      created_at: publishDate,
      updated_at: publishDate,
    });

    if (error) {
      if (error.code === '23505') {
        existingTitles.add(title);
        errors.push(`Duplicate title skipped: "${title.slice(0, 50)}…".`);
      } else {
        errors.push(`Insert failed for "${title.slice(0, 50)}…": ${error.message}`);
      }
      continue;
    }
    existingTitles.add(title);
    imported++;
  }

  return NextResponse.json({
    imported,
    skipped: raw.length - imported,
    total: raw.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
