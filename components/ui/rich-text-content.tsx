import { cn } from '@/lib/utils';
import { sanitizeRichTextHtml } from '@/lib/sanitize-html';

type RichTextContentProps = {
  html?: string | null;
  className?: string;
  plainFallback?: boolean;
};

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export default function RichTextContent({
  html,
  className,
  plainFallback = true,
}: RichTextContentProps) {
  if (!html?.trim()) return null;

  if (plainFallback && !looksLikeHtml(html)) {
    return (
      <p className={cn('whitespace-pre-line leading-relaxed text-gray-600', className)}>
        {html}
      </p>
    );
  }

  const sanitized = sanitizeRichTextHtml(html);

  return (
    <div
      className={cn(
        'rich-text-content leading-relaxed text-gray-600',
        '[&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-purple-deep',
        '[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-purple-deep',
        '[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-purple-deep',
        '[&_p]:mb-3 [&_p:last-child]:mb-0',
        '[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5',
        '[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:mb-1',
        '[&_strong]:font-semibold [&_b]:font-semibold',
        '[&_em]:italic [&_i]:italic',
        '[&_u]:underline',
        '[&_s]:line-through [&_strike]:line-through',
        '[&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-purple-200 [&_blockquote]:bg-purple-50/40 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:italic',
        '[&_a]:font-medium [&_a]:text-purple-deep [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-purple-700',
        '[&_mark]:rounded-sm [&_mark]:bg-yellow-200/80 [&_mark]:px-0.5',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
