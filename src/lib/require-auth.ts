import { redirect } from 'next/navigation';
import { getCurrentUserWithProfile, isAdmin } from '@/lib/auth';

export async function requireUser() {
  const auth = await getCurrentUserWithProfile();
  if (!auth?.user) {
    redirect('/please-sign-in');
  }
  return auth;
}

export async function requireAdmin() {
  const auth = await requireUser();
  if (!isAdmin(auth.profile)) {
    redirect('/need-admin');
  }
  return auth;
}
