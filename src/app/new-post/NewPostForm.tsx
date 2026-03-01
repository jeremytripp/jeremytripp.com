'use client';

import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
    >
      {pending ? 'Saving…' : 'Save post'}
    </button>
  );
}

type Props = {
  action: (formData: FormData) => Promise<void>;
};

export function NewPostForm({ action }: Props) {
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Title
        </label>
        <input
          id="title"
          name="title"
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
          className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
      </div>
      <SubmitButton />
    </form>
  );
}
