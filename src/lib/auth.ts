import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

export async function getCurrentUserWithProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // If anon client got no row (RLS or missing row), try service-role read so we see the real profile (e.g. role=admin)
  if (!profile) {
    const service = createServiceRoleClient();
    if (service) {
      const { data: adminProfile } = await service
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      profile = adminProfile;
    }
  }

  // If still no profile, ensure one exists (upsert with anon; requires RLS "Users can insert own profile")
  if (!profile) {
    const { data: inserted } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
          role: 'user',
        },
        { onConflict: 'id' }
      )
      .select()
      .single();
    profile = inserted;
  }

  return {
    user: { id: user.id, email: user.email ?? undefined },
    profile: profile as Profile | null,
  };
}

export function isAdmin(profile: Profile | null): boolean {
  if (!profile) return false;
  const role = typeof profile.role === 'string' ? profile.role.trim().toLowerCase() : '';
  return role === 'admin';
}
