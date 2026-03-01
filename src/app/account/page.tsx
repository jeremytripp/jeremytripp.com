import { requireUser } from '@/lib/require-auth';

export default async function AccountPage() {
  const { user, profile } = await requireUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Account</h1>
      <dl className="mt-6 space-y-4">
        <div>
          <dt className="text-sm font-medium text-zinc-500">Name</dt>
          <dd className="mt-1">{profile?.full_name ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500">Email</dt>
          <dd className="mt-1">{user?.email ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-zinc-500">Role</dt>
          <dd className="mt-1">{profile?.role ?? '—'}</dd>
        </div>
      </dl>
    </div>
  );
}
