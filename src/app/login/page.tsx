import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect('/');
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Sign In</h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Sign in with your provider to continue.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="mt-6 text-sm text-zinc-500">
        <Link href="/" className="text-blue-600 underline dark:text-blue-400">Go back home</Link>
      </p>
    </div>
  );
}
