import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserWithProfile, isAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const auth = await getCurrentUserWithProfile();
  if (!auth?.user) {
    return NextResponse.redirect(new URL('/please-sign-in', request.url));
  }
  if (!isAdmin(auth.profile)) {
    return NextResponse.redirect(new URL('/need-admin', request.url));
  }

  const supabase = await createClient();

  const formData = await request.formData();
  const weather_service = (formData.get('weather_service') as string) ?? '';
  if (weather_service !== 'openweather' && weather_service !== 'openmeteo') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  const now = new Date().toISOString();
  const { data: row } = await supabase.from('admin_settings').select('id').limit(1).single();

  if (row?.id) {
    await supabase
      .from('admin_settings')
      .update({ weather_service, updated_at: now })
      .eq('id', row.id);
  } else {
    await supabase.from('admin_settings').insert({ weather_service, updated_at: now });
  }

  return NextResponse.redirect(new URL('/admin', request.url));
}
