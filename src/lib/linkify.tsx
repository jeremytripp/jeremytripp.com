import type { ReactNode } from 'react';

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

/**
 * Trim trailing punctuation that was likely not part of the URL.
 */
function trimUrl(url: string): string {
  return url.replace(/[.,;:!?)'"]+$/, '');
}

/**
 * Splits text by URLs and returns React nodes: plain text and anchor tags for links.
 * Use inside a container with whitespace-pre-wrap to preserve line breaks.
 */
export function linkify(text: string | null): ReactNode {
  if (!text) return null;
  const parts = text.split(URL_REGEX);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      const href = trimUrl(part);
      const trailing = part.slice(href.length);
      return (
        <span key={i}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400 break-all"
          >
            {href}
          </a>
          {trailing}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
