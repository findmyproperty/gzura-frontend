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
        '[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-purple-deep',
        '[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-purple-deep',
        '[&_p]:mb-3 [&_p:last-child]:mb-0',
        '[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5',
        '[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:mb-1',
        '[&_strong]:font-semibold [&_em]:italic',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
