'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import type { Post } from '@/types/database';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <div className="mt-4 flex gap-3">
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}

type Props = {
  post: Post;
  action: (formData: FormData) => Promise<void>;
  deleteAction: () => Promise<void>;
};

export function EditPostForm({ post, action, deleteAction }: Props) {
  const router = useRouter();

  async function handleDelete() {
    if (typeof window !== 'undefined' && !window.confirm('Delete this post?')) return;
    await deleteAction();
    router.push('/blog');
    router.refresh();
  }

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="id" value={post.id} />
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          defaultValue={post.title}
          required
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Description
        </label>
        <input
          id="description"
          name="description"
          defaultValue={post.description ?? ''}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Author
        </label>
        <input
          id="author"
          name="author"
          defaultValue={post.author ?? ''}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          rows={12}
          defaultValue={post.body ?? ''}
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>
      <SubmitButton />
      <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          Delete post
        </button>
      </div>
      <p className="text-sm text-zinc-500">
        <Link href="/blog" className="text-blue-600 hover:underline dark:text-blue-400">← Back to blog</Link>
      </p>
    </form>
  );
}
