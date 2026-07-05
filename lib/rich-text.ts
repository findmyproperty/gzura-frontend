export function isEmptyRichText(html: string) {
  const stripped = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return !stripped;
}

export function normalizeRichText(html?: string | null) {
  if (!html) return '';
  const trimmed = html.trim();
  if (!trimmed || isEmptyRichText(trimmed)) return '';
  return trimmed;
}

export function richTextToPlainText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function richTextExcerpt(html?: string | null, maxLength = 160) {
  const plain = richTextToPlainText(html || '');
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trim()}…`;
}
